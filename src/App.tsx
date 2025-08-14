import { FileUpload } from './components/FileUpload';
import React, { useState, useCallback, useEffect } from 'react';
import { ComparisonResultsDisplay } from './components/ComparisonResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Alert } from './components/Alert';
import { ThemeToggle } from './components/ThemeToggle';
import { SproutLogoIcon } from './components/SproutLogoIcon';
import { AliraTextLogoIcon } from './components/AliraTextLogoIcon';
import { LandingPage } from './components/LandingPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { parseFile } from './services/fileParserService';
import { compareContracts } from './services/geminiService';
import { exportToTxt, exportToPdf } from './services/exportService';
import type { ComparisonOutput, AppError } from '../types';
import { ScaleIcon, LightBulbIcon, FileTextIcon, FilePdfIcon, EnvelopeIcon } from './components/Icons';

type Theme = 'light' | 'dark';
type ViewMode = 'app' | 'landing' | 'contact' | 'privacy';

const App: React.FC = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) return savedTheme;
      return 'dark'; 
    }
    return 'dark';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [viewHistory, setViewHistory] = useState<ViewMode[]>([]);
  // Custom navigation function to push to history
  const navigateTo = (mode: ViewMode) => {
    setViewHistory((prev) => {
      const newHistory = [...prev, viewMode];
      console.log('navigateTo:', { mode, viewMode, newHistory });
      return newHistory;
    });
    setViewMode(mode);
    console.log('navigateTo: setViewMode', mode);
  };

  // Go back to previous view
  const navigateBack = () => {
    setViewHistory((prev) => {
      if (prev.length === 0) {
        console.warn('navigateBack: history empty, cannot go back', { viewMode });
        return prev;
      }
      const last = prev[prev.length - 1];
      console.log('navigateBack:', { last, prev });
      setViewMode(last);
      console.log('navigateBack: setViewMode', last);
      return prev.slice(0, -1);
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Scroll to top when viewMode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [viewMode]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const resetStateForNewComparison = () => {
    setComparisonResult(null);
    setError(null);
  };

  const handleFile1Change = (file: File | null) => {
    setFile1(file);
    resetStateForNewComparison();
  };

  const handleFile2Change = (file: File | null) => {
    setFile2(file);
    resetStateForNewComparison();
  };

  const handleCompare = useCallback(async () => {
    if (!file1 || !file2) {
      setError({ message: 'Please upload two documents to compare.', type: 'warning' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setComparisonResult(null);

    try {
      const [doc1Text, doc2Text] = await Promise.all([
        parseFile(file1),
        parseFile(file2),
      ]);

      if (doc1Text.trim().length === 0 || doc2Text.trim().length === 0) {
        setError({ message: 'One or both documents appear to be empty or could not be read.', type: 'error' });
        setIsLoading(false);
        return;
      }
      
      const result = await compareContracts(doc1Text, doc2Text);
      setComparisonResult(result);
    } catch (err) {
      console.error('Comparison failed:', err);
      if (err instanceof Error) {
         setError({ message: `An error occurred: ${err.message}`, type: 'error' });
      } else {
         setError({ message: 'An unknown error occurred during comparison.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [file1, file2]);

  const handleExportTxt = () => {
    if (comparisonResult && file1 && file2) {
      exportToTxt(
        comparisonResult,
        file1.name,
        file2.name
      );
    } else {
      setError({ message: 'No comparison results to export.', type: 'info'})
    }
  };

  const handleExportPdf = () => {
    if (comparisonResult && file1 && file2) {
      exportToPdf(
        comparisonResult,
        file1.name,
        file2.name
      );
    } else {
      setError({ message: 'No comparison results to export.', type: 'info'})
    }
  };

  const isCompareDisabled = isLoading || !file1 || !file2;

  const renderContent = () => {
    switch (viewMode) {
      case 'landing':
        return <LandingPage 
          onNavigateToApp={() => navigateTo('app')}
          onNavigateToPrivacy={() => navigateTo('privacy')}
          onNavigateToContact={() => navigateTo('contact')}
          onNavigateHome={() => setViewMode('landing')}
        />;
      case 'contact':
        return <ContactPage 
          onNavigateHome={() => navigateTo('landing')}
          onNavigateToPrivacy={() => navigateTo('privacy')}
        />;
      case 'privacy':
        return <PrivacyPolicyPage 
          onNavigateHome={() => navigateTo('landing')}
          onNavigateToContact={() => navigateTo('contact')}
        />;
      case 'app':
      default:
        return (
          <div className="w-full flex flex-col items-center p-4 sm:p-8">
            <header className="w-full max-w-5xl mb-12 sm:mb-16 text-center pt-16 sm:pt-20">
              <button 
                onClick={() => setViewMode('landing')}
                className="inline-block focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg transition-transform duration-200 hover:scale-105"
                aria-label="Back to Alira Home"
              >
                <AliraTextLogoIcon
                  className="h-12 sm:h-14 mb-2 mx-auto text-[#7AD7FF] dark:text-[#7AD7FF]"
                />
              </button>
              <p className="text-lg text-slate-500 dark:text-slate-400">AI-Powered Contract Comparator</p>
            </header>

            <main className="w-full max-w-5xl bg-white dark:bg-slate-800/80 backdrop-blur-sm shadow-xl md:shadow-2xl shadow-sky-200/20 dark:shadow-indigo-900/20 rounded-2xl p-6 sm:p-10">
              {error && <Alert message={error.message} type={error.type} onClose={() => setError(null)} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
                <FileUpload
                  id="file1"
                  label="Document 1"
                  onFileChange={handleFile1Change}
                  acceptedFileTypes=".txt,.pdf,.docx"
                />
                <FileUpload
                  id="file2"
                  label="Document 2"
                  onFileChange={handleFile2Change}
                  acceptedFileTypes=".txt,.pdf,.docx"
                />
              </div>

              <div className="text-center mb-8 sm:mb-10">
                <button
                  onClick={handleCompare}
                  disabled={isCompareDisabled}
                  title={isCompareDisabled ? "Please upload two documents to compare" : "Compare uploaded documents"}
                  className="px-10 py-3.5 text-base font-semibold text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 transform hover:scale-105
                            bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 hover:from-sky-600 hover:via-cyan-600 hover:to-teal-600
                            dark:from-sky-400 dark:via-cyan-400 dark:to-teal-400 dark:hover:from-sky-500 dark:hover:via-cyan-500 dark:hover:to-teal-500
                            disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:shadow-none disabled:text-slate-500 disabled:dark:text-slate-400 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  aria-live="polite"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner small />
                      <span className="ml-2">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <ScaleIcon className="w-5 h-5 mr-2.5" />
                      Compare Documents
                    </>
                  )}
                </button>
              </div>
              
              {!isLoading && !comparisonResult && !error && (
                <div className="text-center p-8 sm:p-10 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-slate-700/50 dark:to-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                  <LightBulbIcon className="w-16 h-16 mx-auto text-sky-500 dark:text-sky-400 mb-4" />
                  <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-200 mb-2">Ready to Compare?</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                    Upload two documents (TXT, PDF, or DOCX) and click "Compare Documents" to see an AI-generated analysis.
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="mt-8 flex justify-center" aria-label="Loading comparison results">
                  <LoadingSpinner />
                </div>
              )}

              {comparisonResult && !isLoading && (
                <>
                  <div className="flex justify-end space-x-3 mb-6 -mt-4">
                    <button
                      onClick={handleExportTxt}
                      className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500
                                border border-sky-300 dark:border-sky-600 bg-sky-50 dark:bg-sky-800/30 hover:bg-sky-100 dark:hover:bg-sky-700/50 text-sky-700 dark:text-sky-300"
                      aria-label="Export comparison results as TXT file"
                    >
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      Export TXT
                    </button>
                    <button
                      onClick={handleExportPdf}
                      className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500
                                border border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-800/30 hover:bg-purple-100 dark:hover:bg-purple-700/50 text-purple-700 dark:text-purple-300"
                      aria-label="Export comparison results as PDF file"
                    >
                      <FilePdfIcon className="w-4 h-4 mr-2" />
                      Export PDF
                    </button>
                  </div>

                  <ComparisonResultsDisplay 
                    results={comparisonResult} 
                    doc1Name={file1?.name || 'Document 1'}
                    doc2Name={file2?.name || 'Document 2'}
                  />
                </>
              )}
            </main>

            <footer className="w-full max-w-5xl mt-12 mb-6 text-center text-sm">
              <p className="text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} Alira. All rights reserved.</p> 
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Disclaimer: This is a technology tool for informational purposes and not legal advice. Use at your own risk.
              </p>
              <div className="mt-3 space-x-4">
                <button 
                  onClick={() => setViewMode('privacy')}
                  className="text-sky-600 dark:text-sky-400 hover:underline text-sm font-medium"
                  aria-label="View Privacy Policy"
                >
                  Privacy Policy
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <SproutLogoIcon className="h-7 w-7 text-[#547732] dark:text-[#6b9449]" />
                <a 
                  href="https://www.sproutcircle.ca" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 hover:underline transition-colors"
                  aria-label="Visit Sprout Circle website (opens in a new tab)"
                >
                  Crafted by Sprout Circle
                </a>
              </div>
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-indigo-950 text-slate-800 dark:text-gray-100 flex flex-col items-center transition-colors duration-300">
      <header className="w-full flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6 z-50">
        <div className="flex items-center space-x-2">
          {viewMode !== 'landing' && (
            <button 
              onClick={navigateBack}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-sky-600 dark:text-sky-300 bg-white/80 dark:bg-slate-800/60 hover:bg-sky-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-transform duration-200 hover:scale-105"
              aria-label="Go Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
          )}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <div>
          <button
            onClick={() => navigateTo('contact')}
            className="flex items-center px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 
                       bg-white/70 dark:bg-slate-700/70 hover:bg-slate-200/90 dark:hover:bg-slate-600/90 backdrop-blur-sm
                       border border-slate-300 dark:border-slate-600
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent focus:ring-sky-500 dark:focus:ring-sky-400
                       transition-all duration-200"
            aria-label="Contact Us"
          >
            <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-0 sm:mr-1.5" />
            <span className="hidden sm:inline">Contact Us</span>
          </button>
        </div>
      </header>
      {renderContent()}
    </div>
  );
};

export default App;
