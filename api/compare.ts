import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import type { ComparisonOutput } from "../types";

export const config = {
  runtime: 'edge',
};

if (!process.env.API_KEY) {
  throw new Error("API_KEY for Gemini is not set.");
}
if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn("Vercel KV environment variables not found. Rate limiting will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ratelimit = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(5, '1 d'),
      analytics: true,
      prefix: '@alira_ratelimit',
    })
  : null;

const SYSTEM_PROMPT = "You are a professional document analysis assistant specializing in legal and formal documents. Do not engage in irrelevant, offensive, or inappropriate content. If the input does not appear to be a contract, tender, bid, proposal, or similar formal document, reply with a JSON object containing an 'error' key explaining the issue.";

const PROMPT_TEMPLATE = (doc1Text: string, doc2Text: string): string => `
You are a meticulous document comparison expert. You will be given the text content of two documents. Your task is to analyze these and provide a clear, concise, and non-repetitive comparison.

Structure your response STRICTLY according to the provided JSON schema.
- "executiveSummary": A concise (2-4 sentences) overview of the most critical differences OR very significant unique clauses.
- "agreements": Identify substantially similar points.
- "disputes": Identify different or conflicting points.
- "uniqueDoc1": Describe significant clauses present in Document 1 but absent in Document 2.
- "uniqueDoc2": Describe significant clauses present in Document 2 but absent in Document 1.

IMPORTANT:
1. Be Concise and Summarize. Do not repeat large blocks of text.
2. A point should only be in ONE category.
3. For any category with no findings, provide an empty array ([]).
4. If the input seems invalid, return a JSON with an 'error' key.

Document 1:
---
${doc1Text}
---

Document 2:
---
${doc2Text}
---
`;

const comparisonSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: "A very concise (2-4 sentences) overview of the most critical differences or significant unique clauses. Highlight substantive issues like financial terms, liability, or scope. If documents are similar, state that."
    },
    agreements: {
      type: Type.ARRAY,
      description: "Clauses or points that are substantially the same or convey the same meaning.",
      items: { type: Type.STRING }
    },
    disputes: {
      type: Type.ARRAY,
      description: "Clauses or points that are different, conflicting, or contradictory.",
      items: { type: Type.STRING }
    },
    uniqueDoc1: {
      type: Type.ARRAY,
      description: "Significant clauses, provisions, or offerings present in Document 1 but entirely absent from Document 2.",
      items: { type: Type.STRING }
    },
    uniqueDoc2: {
      type: Type.ARRAY,
      description: "Significant clauses, provisions, or requirements present in Document 2 but entirely absent from Document 1.",
      items: { type: Type.STRING }
    },
    error: {
        type: Type.STRING,
        description: "An error message if the input documents are not valid for comparison.",
        optional: true
    }
  },
  required: ["executiveSummary", "agreements", "disputes", "uniqueDoc1", "uniqueDoc2"]
};

const MAX_RETRIES = 3;

function getCorsHeaders() {
  const vercelUrl = process.env.VERCEL_URL;
  const allowedOrigin = process.env.NODE_ENV === 'production' && vercelUrl
    ? `https://${vercelUrl}`
    : '*';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function compareWithRetries(prompt: string): Promise<ComparisonOutput> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{role: "user", parts: [{text: prompt}]}],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: comparisonSchema,
          temperature: 0.2,
        }
      });

    const jsonStr = (response.text ?? "").trim();
      const parsedData = JSON.parse(jsonStr);
      
      if (parsedData.error) {
          throw new Error(parsedData.error);
      }

      if (
        typeof parsedData.executiveSummary === 'string' &&
        Array.isArray(parsedData.agreements) &&
        Array.isArray(parsedData.disputes) &&
        Array.isArray(parsedData.uniqueDoc1) &&
        Array.isArray(parsedData.uniqueDoc2)
      ) {
        return parsedData as ComparisonOutput;
      } else {
        throw new Error("AI response did not match the expected format.");
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      lastError = error instanceof Error ? error : new Error('An unknown error occurred during API call.');
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  }
  throw lastError || new Error(`Failed to get a valid response after ${MAX_RETRIES} attempts.`);
}

export default async function handler(req: Request) {
  const corsHeaders = getCorsHeaders();

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  if (ratelimit) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
  
  try {
    const { doc1Text, doc2Text } = await req.json();

    if (!doc1Text || !doc2Text || typeof doc1Text !== 'string' || typeof doc2Text !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid input.' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const prompt = PROMPT_TEMPLATE(doc1Text, doc2Text);
    const result = await compareWithRetries(prompt);

    return new Response(JSON.stringify(result), {
      status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Error in compare handler:', error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
