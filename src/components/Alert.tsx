import React from 'react';
import { InformationCircleIcon, ExclamationTriangleIcon, XCircleIcon } from './Icons';

interface AlertProps {
  message: string;
  type: 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  let baseBgColor, darkBgColor, baseTextColor, darkTextColor, baseBorderColor, darkBorderColor, IconComp, iconColorClass;

  switch (type) {
    case 'error':
      baseBgColor = 'bg-red-50';
      darkBgColor = 'dark:bg-red-900/50';
      baseTextColor = 'text-red-700';
      darkTextColor = 'dark:text-red-200';
      baseBorderColor = 'border-red-400';
      darkBorderColor = 'dark:border-red-500/70';
      IconComp = XCircleIcon;
      iconColorClass = 'text-red-500 dark:text-red-400';
      break;
    case 'warning':
      baseBgColor = 'bg-yellow-50';
      darkBgColor = 'dark:bg-yellow-800/40';
      baseTextColor = 'text-yellow-700';
      darkTextColor = 'dark:text-yellow-200';
      baseBorderColor = 'border-yellow-400';
      darkBorderColor = 'dark:border-yellow-500/70';
      IconComp = ExclamationTriangleIcon;
      iconColorClass = 'text-yellow-500 dark:text-yellow-400';
      break;
    case 'info':
    default:
      baseBgColor = 'bg-sky-50';
      darkBgColor = 'dark:bg-sky-900/50';
      baseTextColor = 'text-sky-700';
      darkTextColor = 'dark:text-sky-200';
      baseBorderColor = 'border-sky-400';
      darkBorderColor = 'dark:border-sky-500/70';
      IconComp = InformationCircleIcon;
      iconColorClass = 'text-sky-500 dark:text-sky-400';
      break;
  }

  return (
    <div
      className={`p-4 mb-6 border-l-4 rounded-md flex items-start shadow-sm ${baseBgColor} ${darkBgColor} ${baseTextColor} ${darkTextColor} ${baseBorderColor} ${darkBorderColor}`}
      role="alert"
    >
      <IconComp className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${iconColorClass}`} />
      <span className="flex-grow text-sm sm:text-base">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-4 -mr-1 -mt-1 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-75 
                     ${baseTextColor} ${darkTextColor} 
                     hover:bg-opacity-20 hover:bg-current
                     transition-colors duration-200`}
          aria-label="Close alert"
        >
          <span className="sr-only">Dismiss</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};