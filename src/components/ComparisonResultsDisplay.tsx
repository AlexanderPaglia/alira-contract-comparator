import type { ComparisonOutput } from '../../types';
import React from 'react';
import { CheckCircleIcon, XCircleIconSolid, DocumentDuplicateIcon, DocumentTextIcon, InformationCircleIcon, SparklesIcon } from './Icons';

interface ComparisonResultsDisplayProps {
  results: ComparisonOutput;
  doc1Name: string;
  doc2Name: string;
}

interface ResultSectionProps {
  title: string;
  content: string | string[];
  icon: React.ReactNode;
  iconColorClass: string;
  baseBgColorClass?: string;
  darkBgColorClass?: string;
  baseBorderColorClass?: string;
  darkBorderColorClass?: string;
  titleColorClass?: string;
  darkTitleColorClass?: string;
  baseTextColorClass?: string;
  darkTextColorClass?: string;
  basePreBgColorClass?: string;
  darkPreBgColorClass?: string;
  isSummary?: boolean;
}

const ResultSection: React.FC<ResultSectionProps> = ({ 
  title, 
  content, 
  icon,
  iconColorClass,
  baseBgColorClass = 'bg-slate-50',
  darkBgColorClass = 'dark:bg-slate-700/60',
  baseBorderColorClass = 'border-slate-200/80',
  darkBorderColorClass = 'dark:border-slate-600/70',
  titleColorClass = 'text-slate-800',
  darkTitleColorClass = 'dark:text-slate-100',
  baseTextColorClass = 'text-slate-600',
  darkTextColorClass = 'dark:text-slate-300',
  basePreBgColorClass = 'bg-slate-100',
  darkPreBgColorClass = 'dark:bg-slate-800/70',
  isSummary = false,
}) => {
  const preClasses = `
    whitespace-pre-wrap break-words text-sm sm:text-base leading-loose 
    ${baseTextColorClass} ${darkTextColorClass} 
    p-4 ${basePreBgColorClass} ${darkPreBgColorClass} rounded-md font-serif
    max-h-[400px] overflow-y-auto
  `;

  const displayText = Array.isArray(content) ? content.join('\n') : content;
  const hasContent = displayText && displayText.trim().length > 0;

  return (
    <div className={`rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border ${baseBgColorClass} ${darkBgColorClass} ${baseBorderColorClass} ${darkBorderColorClass}`}>
      <div className="flex items-center mb-4">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-8 h-8 ${iconColorClass}` }) : icon}
        <h3 className={`ml-3 text-xl font-semibold ${titleColorClass} ${darkTitleColorClass}`}>{title}</h3>
      </div>
      {hasContent ? (
        isSummary ? (
          <p className={`text-sm sm:text-base leading-loose ${baseTextColorClass} ${darkTextColorClass} p-1 font-serif`}>
            {displayText}
          </p>
        ) : (
          <pre className={preClasses.trim()}>
            {displayText}
          </pre>
        )
      ) : (
        <div className={`flex items-start text-sm sm:text-base italic ${baseTextColorClass} ${darkTextColorClass} ${basePreBgColorClass} ${darkPreBgColorClass} p-4 rounded-md font-serif`}>
          <InformationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 opacity-70" />
          <span>{isSummary ? 'No executive summary provided.' : `No specific items found for ${title.toLowerCase()}.`}</span>
        </div>
      )}
    </div>
  );
};

export const ComparisonResultsDisplay: React.FC<ComparisonResultsDisplayProps> = ({ results, doc1Name, doc2Name }) => {
  return (
    <div className="space-y-8 mt-8" aria-label="Comparison Results">
      {results.executiveSummary && results.executiveSummary.trim().length > 0 && (
         <ResultSection
            title="Executive Summary"
            content={results.executiveSummary}
            icon={<SparklesIcon />}
            iconColorClass="text-amber-500 dark:text-amber-400"
            baseBgColorClass="bg-amber-50/80"
            darkBgColorClass="dark:bg-amber-900/40"
            baseBorderColorClass="border-amber-300/50"
            darkBorderColorClass="dark:border-amber-500/40"
            titleColorClass="text-amber-700"
            darkTitleColorClass="dark:text-amber-300"
            baseTextColorClass="text-amber-600"
            darkTextColorClass="dark:text-amber-200"
            isSummary={true}
        />
      )}

      <ResultSection
        title="Agreements"
        content={results.agreements}
        icon={<CheckCircleIcon />}
        iconColorClass="text-green-500 dark:text-green-400"
        baseBgColorClass="bg-green-50/80"
        darkBgColorClass="dark:bg-green-900/40"
        baseBorderColorClass="border-green-300/50"
        darkBorderColorClass="dark:border-green-500/40"
        titleColorClass="text-green-700"
        darkTitleColorClass="dark:text-green-300"
        baseTextColorClass="text-green-600"
        darkTextColorClass="dark:text-green-200"
        basePreBgColorClass="bg-green-100/70"
        darkPreBgColorClass="dark:bg-green-800/40"
      />
      <ResultSection
        title="Disputes / Differences"
        content={results.disputes}
        icon={<XCircleIconSolid />}
        iconColorClass="text-red-500 dark:text-red-400"
        baseBgColorClass="bg-red-50/80"
        darkBgColorClass="dark:bg-red-900/40"
        baseBorderColorClass="border-red-300/50"
        darkBorderColorClass="dark:border-red-500/40"
        titleColorClass="text-red-700"
        darkTitleColorClass="dark:text-red-300"
        baseTextColorClass="text-red-600"
        darkTextColorClass="dark:text-red-200"
        basePreBgColorClass="bg-red-100/70"
        darkPreBgColorClass="dark:bg-red-800/40"
      />
      <div className="grid md:grid-cols-2 gap-8">
        <ResultSection
          title={`Unique to ${doc1Name}`}
          content={results.uniqueDoc1}
          icon={<DocumentDuplicateIcon />}
          iconColorClass="text-sky-500 dark:text-sky-400"
          baseBgColorClass="bg-sky-50/80"
          darkBgColorClass="dark:bg-sky-900/40"
          baseBorderColorClass="border-sky-300/50"
          darkBorderColorClass="dark:border-sky-500/40"
          titleColorClass="text-sky-700"
          darkTitleColorClass="dark:text-sky-300"
          baseTextColorClass="text-sky-600"
          darkTextColorClass="dark:text-sky-200"
          basePreBgColorClass="bg-sky-100/70"
          darkPreBgColorClass="dark:bg-sky-800/40"
        />
        <ResultSection
          title={`Unique to ${doc2Name}`}
          content={results.uniqueDoc2}
          icon={<DocumentTextIcon />}
          iconColorClass="text-purple-500 dark:text-purple-400"
          baseBgColorClass="bg-purple-50/80"
          darkBgColorClass="dark:bg-purple-900/40"
          baseBorderColorClass="border-purple-300/50"
          darkBorderColorClass="dark:border-purple-500/40"
          titleColorClass="text-purple-700"
          darkTitleColorClass="dark:text-purple-300"
          baseTextColorClass="text-purple-600"
          darkTextColorClass="dark:text-purple-200"
          basePreBgColorClass="bg-purple-100/70"
          darkPreBgColorClass="dark:bg-purple-800/40"
        />
      </div>
    </div>
  );
};
