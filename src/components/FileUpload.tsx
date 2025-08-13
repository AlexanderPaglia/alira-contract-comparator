import React, { useState, useCallback, useRef } from 'react';
import { DocumentArrowUpIcon, XCircleIcon, CheckCircleIcon } from './Icons';

interface FileUploadProps {
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
  acceptedFileTypes?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ id, label, onFileChange, acceptedFileTypes }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      if (acceptedFileTypes) {
        const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
        const allowedTypes = acceptedFileTypes.split(',').map(type => type.trim());
        if (!allowedTypes.includes(fileExtension)) {
          alert(`Invalid file type. Please upload ${allowedTypes.join(', ').replace(/,\s*([^,]*)$/, ' or $1')}.`);
          setFileName(null);
          onFileChange(null);
          if(fileInputRef.current) fileInputRef.current.value = ""; 
          return;
        }
      }
      setFileName(selectedFile.name);
      onFileChange(selectedFile);
    } else {
      setFileName(null);
      onFileChange(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [onFileChange, acceptedFileTypes]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files ? event.target.files[0] : null);
  };

  const handleClearFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); 
    event.preventDefault();
    handleFileSelect(null);
  };
  
  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault(); 
    event.stopPropagation();
    setIsDragging(true); 
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileSelect(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const baseClasses = "flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform";
  
  const normalStateClasses = "bg-slate-50 dark:bg-slate-700/40 border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-slate-100 dark:hover:bg-slate-700/60";
  const draggingStateClasses = "bg-sky-50 dark:bg-sky-700/30 border-sky-500 dark:border-sky-400 ring-2 ring-sky-300 dark:ring-sky-600 ring-offset-2 dark:ring-offset-slate-800 scale-105";
  const fileSelectedStateClasses = "bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600";

  let currentClasses = normalStateClasses;
  if (isDragging) {
    currentClasses = draggingStateClasses;
  } else if (fileName) {
    currentClasses = fileSelectedStateClasses;
  }

  const displayAcceptedTypes = acceptedFileTypes
    ? acceptedFileTypes.split(',').map(type => type.substring(1).toUpperCase()).join(', ').replace(/,\s*([^,]*)$/, ' or $1') + ' files'
    : 'files';

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-3 text-center">{label}</h3>
      <label
        htmlFor={id}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${baseClasses} ${currentClasses}`}
        aria-label={`${label}: Click or drag and drop a file here. Accepted types: ${displayAcceptedTypes}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {fileName ? (
            <>
              <CheckCircleIcon className="w-12 h-12 mb-3 text-green-500 dark:text-green-400" />
              <p className="mb-1 text-sm font-medium text-green-700 dark:text-green-300 break-all">{fileName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">File selected. Drag & drop or click to change.</p>
            </>
          ) : (
            <>
              <DocumentArrowUpIcon className={`w-10 h-10 mb-3 ${isDragging ? 'text-sky-500 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Click to upload</span>
                <span className={isDragging ? 'hidden' : ''}> or drag and drop</span>
              </p>
              <p className={`text-xs ${isDragging ? 'text-sky-500 dark:text-sky-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                {isDragging ? 'Drop your file here!' : displayAcceptedTypes}
              </p>
            </>
          )}
        </div>
        <input id={id} type="file" className="hidden" onChange={handleChange} accept={acceptedFileTypes} ref={fileInputRef} />
      </label>
      {fileName && !isDragging && (
         <div className="mt-2 text-right">
            <button
            onClick={handleClearFile}
            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center justify-end ml-auto py-1 px-2 rounded hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors"
            aria-label={`Remove ${fileName}`}
            >
            <XCircleIcon className="w-4 h-4 mr-1" />
            Remove file
            </button>
        </div>
      )}
    </div>
  );
};
