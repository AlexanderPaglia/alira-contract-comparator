import type { ComparisonOutput } from '../../types';

export const compareContracts = async (doc1Text: string, doc2Text: string): Promise<ComparisonOutput> => {
  try {
    const response = await fetch('/api/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ doc1Text, doc2Text }),
    });

    if (response.status === 429) {
      throw new Error('You have exceeded the daily limit of 5 comparisons. Please try again tomorrow.');
    }
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `Server responded with status: ${response.status}`);
    }
    
    if (result.error) {
        throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('Error fetching from backend API:', error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('failed to fetch')) {
            throw new Error('Could not connect to the server. Please check your network connection.');
        }
        throw error;
    }
    throw new Error('An unknown error occurred while trying to compare documents.');
  }
};
