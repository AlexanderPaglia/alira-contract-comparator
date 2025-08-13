export interface ComparisonOutput {
  agreements: string[];
  disputes: string[];
  uniqueDoc1: string[];
  uniqueDoc2: string[];
  executiveSummary: string;
}

export interface AppError {
  message: string;
  type: 'error' | 'warning' | 'info';
}
