import { jsPDF } from 'jspdf';
import type { ComparisonOutput } from '../../types';

const generateFilename = (doc1Name: string, doc2Name: string, extension: 'txt' | 'pdf'): string => {
  const sanitize = (name: string) => name.replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
  const d1 = sanitize(doc1Name.substring(0, doc1Name.lastIndexOf('.')) || doc1Name);
  const d2 = sanitize(doc2Name.substring(0, doc2Name.lastIndexOf('.')) || doc2Name);
  return `Comparison_${d1}_vs_${d2}_${new Date().toISOString().split('T')[0]}.${extension}`;
};

const getSectionTextForExport = (sectionContent: string | string[] | undefined, defaultMessage: string): string => {
  if (typeof sectionContent === 'string') {
    return sectionContent.trim() ? sectionContent : defaultMessage;
  }
  if (Array.isArray(sectionContent) && sectionContent.length > 0) {
    const joined = sectionContent.join('\n');
    return joined.trim() ? joined : defaultMessage;
  }
  return defaultMessage;
};

export const exportToTxt = (
  results: ComparisonOutput,
  doc1Name: string | undefined,
  doc2Name: string | undefined
): void => {
  const safeDoc1Name = doc1Name ?? "Document1";
  const safeDoc2Name = doc2Name ?? "Document2";
  let content = `CONTRACT COMPARISON REPORT\n`;
  content += `========================================\n`;
  content += `Document 1: ${safeDoc1Name}\n`;
  content += `Document 2: ${safeDoc2Name}\n`;
  content += `Report Generated: ${new Date().toLocaleString()}\n`;
  content += `========================================\n\n`;

  if (results.executiveSummary && results.executiveSummary.trim().length > 0) {
    content += `EXECUTIVE SUMMARY:\n----------------------------------------\n`;
    content += `${results.executiveSummary}\n\n`;
  }

  content += `AGREEMENTS:\n----------------------------------------\n`;
  content += `${getSectionTextForExport(results.agreements, 'No specific agreements found.')}\n\n`;

  content += `DISPUTES / DIFFERENCES:\n----------------------------------------\n`;
  content += `${getSectionTextForExport(results.disputes, 'No specific disputes or differences found.')}\n\n`;

  content += `UNIQUE TO ${safeDoc1Name.toUpperCase()}:\n----------------------------------------\n`;
  content += `${getSectionTextForExport(results.uniqueDoc1, `No specific unique clauses found in ${safeDoc1Name}.`)}\n\n`;

  content += `UNIQUE TO ${safeDoc2Name.toUpperCase()}:\n----------------------------------------\n`;
  content += `${getSectionTextForExport(results.uniqueDoc2, `No specific unique clauses found in ${safeDoc2Name}.`)}\n\n`;
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = generateFilename(safeDoc1Name, safeDoc2Name, 'txt');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const exportToPdf = (
  results: ComparisonOutput,
  doc1Name: string | undefined,
  doc2Name: string | undefined
): void => {
  const safeDoc1Name = doc1Name ?? "Document1";
  const safeDoc2Name = doc2Name ?? "Document2";
  const doc = new jsPDF();
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - 2 * margin;
  let yPos = margin;

  doc.setFontSize(18);
  doc.text('Contract Comparison Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(10);
  doc.text(`Document 1: ${safeDoc1Name}`, margin, yPos);
  yPos += 6;
  doc.text(`Document 2: ${safeDoc2Name}`, margin, yPos);
  yPos += 6;
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, margin, yPos);
  yPos += 10;

  const addSection = (title: string, sectionData: string | string[], isSummary?: boolean) => {
    if (yPos > doc.internal.pageSize.getHeight() - 30) { 
      doc.addPage();
      yPos = margin;
    }
    doc.setFontSize(isSummary ? 12 : 14);
    doc.setFont("helvetica", 'bold');
    doc.text(title, margin, yPos);
    yPos += isSummary ? 6 : 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", 'normal');
    
    const defaultMessage = isSummary ? 'No executive summary provided.' : 'No specific items found for this section.';
    const textForPdf = getSectionTextForExport(sectionData, defaultMessage);
    const splitText = doc.splitTextToSize(textForPdf, usableWidth);
    
    splitText.forEach((line: string) => {
      if (yPos > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 5; 
    });
    yPos += isSummary ? 6 : 7; 
  };

  if (results.executiveSummary && results.executiveSummary.trim().length > 0) {
    addSection('Executive Summary', results.executiveSummary, true);
  }

  addSection('Agreements', results.agreements);
  addSection('Disputes / Differences', results.disputes);
  addSection(`Unique to ${safeDoc1Name}`, results.uniqueDoc1);
  addSection(`Unique to ${safeDoc2Name}`, results.uniqueDoc2);

  doc.save(generateFilename(safeDoc1Name, safeDoc2Name, 'pdf'));
};
