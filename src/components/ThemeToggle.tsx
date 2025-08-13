import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-slate-500 dark:text-slate-400 
                 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-sky-500 dark:focus:ring-sky-400
                 transition-all duration-200"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      ) : (
        <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      )}
    </button>
  );
};
