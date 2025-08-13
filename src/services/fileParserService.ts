import mammoth from 'mammoth';

// These types are simplified representations for pdf.js.
// A full implementation would use types from pdfjs-dist.
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface PdfTextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  hasEOL?: boolean;
}

interface PdfTextContent {
  items: PdfTextItem[];
}

interface PdfPage {
  getTextContent: () => Promise<PdfTextContent>;
}

interface PdfDocument {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
}

export const parseFile = async (file: File): Promise<string> => {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith('.txt')) {
    return parseTxtFile(file);
  } else if (fileName.endsWith('.pdf')) {
    return parsePdfFile(file);
  } else if (fileName.endsWith('.docx')) {
    return parseDocxFile(file);
  } else {
    throw new Error('Unsupported file type. Please upload a .txt, .pdf, or .docx file.');
  }
};

const parseTxtFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (error) => {
      reject(new Error(`Error reading .txt file: ${error.target?.error?.message || 'Unknown error'}`));
    };
    reader.readAsText(file);
  });
};

const parsePdfFile = async (file: File): Promise<string> => {
  if (typeof window === 'undefined' || !window.pdfjsLib) {
    throw new Error('PDF.js library is not loaded. Please ensure it is included in your HTML file.');
  }
  
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);

  try {
    const pdf: PdfDocument = await window.pdfjsLib.getDocument({ data: typedArray }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent: PdfTextContent = await page.getTextContent();
      
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText.replace(/\s+/g, ' ').trim() + '\n\n';
    }
    return fullText.trim();
  } catch (error) {
    console.error('Error parsing PDF:', error);
    if (error instanceof Error) {
        throw new Error(`Error parsing PDF file: ${error.message}`);
    }
    throw new Error('Unknown error parsing PDF file.');
  }
};

const parseDocxFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX file:', error);
    if (error instanceof Error) {
      throw new Error(`Error parsing .docx file: ${error.message}`);
    }
    throw new Error('Unknown error parsing .docx file.');
  }
};
