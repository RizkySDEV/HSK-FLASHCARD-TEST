/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import hskData from './data/hsk1.json';
import { HSKItem, CardState, ViewMode } from './types';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import Calendar from './components/Calendar';
import { BookOpen, Trophy, BarChart3, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Moon, Sun, Menu, X, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'hsk1_progress';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('flashcard');
  const [progress, setProgress] = useState<Record<string, CardState>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load progress & theme
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProgress(JSON.parse(saved));

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  // Save progress
  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const allWords = hskData as HSKItem[];
  const currentItem = allWords[currentIndex];

  const handleReview = (difficulty: 'easy' | 'good' | 'hard') => {
    const now = Date.now();
    let interval = 1;
    if (difficulty === 'good') interval = 2;
    if (difficulty === 'easy') interval = 4;

    const newState: CardState = {
      id: currentItem.id,
      nextReview: now + interval * 24 * 60 * 60 * 1000,
      interval: interval,
      stability: difficulty === 'easy' ? 2 : 1
    };

    setProgress(prev => ({
      ...prev,
      [currentItem.id]: newState
    }));

    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < allWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const learnedCount = Object.keys(progress).length;

  const NavItems = () => (
    <>
      <button 
        onClick={() => { setViewMode('flashcard'); setIsSidebarOpen(false); }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${viewMode === 'flashcard' ? 'bg-primary/10 text-primary' : 'text-text-sub dark:text-dark-text-sub hover:bg-slate-100 dark:hover:bg-slate-800'}`}
      >
        <BookOpen size={20} />
        Belajar
      </button>
      <button 
        onClick={() => { setViewMode('quiz'); setIsSidebarOpen(false); }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${viewMode === 'quiz' ? 'bg-primary/10 text-primary' : 'text-text-sub dark:text-dark-text-sub hover:bg-slate-100 dark:hover:bg-slate-800'}`}
      >
        <Trophy size={20} />
        Mode Kuis
      </button>
      <button 
        onClick={() => { setViewMode('calendar'); setIsSidebarOpen(false); }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${viewMode === 'calendar' ? 'bg-primary/10 text-primary' : 'text-text-sub dark:text-dark-text-sub hover:bg-slate-100 dark:hover:bg-slate-800'}`}
      >
        <CalendarIcon size={20} />
        Kalender
      </button>
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-bg dark:bg-dark-bg transition-colors duration-300">
      
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-dark-card-bg border-b dark:border-slate-800 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
            华
          </div>
          <h1 className="font-extrabold text-lg tracking-tight text-primary">HSK 1</h1>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-text-sub dark:text-dark-text-sub hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-text-sub dark:text-dark-text-sub hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`fixed inset-0 lg:relative lg:flex w-full lg:w-72 bg-white dark:bg-dark-card-bg border-r border-slate-200 dark:border-slate-800 p-6 flex-col justify-between shrink-0 z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          <div className="hidden lg:flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-primary/20">
              华
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight text-primary">Master</h1>
          </div>

          <nav className="flex flex-col gap-2 mb-10">
            <NavItems />
          </nav>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-text-sub dark:text-dark-text-sub text-[10px] uppercase font-bold tracking-widest mb-2">
                <BarChart3 size={14} />
                Mastered
              </div>
              <h3 className="text-3xl font-bold dark:text-dark-text-main">{learnedCount} / {allWords.length}</h3>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-6">
          <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-3xl">
            <p className="text-primary text-[10px] uppercase font-bold tracking-widest mb-3">Overall Progress</p>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(learnedCount / allWords.length) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>
            <p className="text-xs text-primary font-bold text-right">
              {Math.round((learnedCount / allWords.length) * 100)}% Complete
            </p>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-text-sub dark:text-dark-text-sub hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative p-6 lg:p-12 flex flex-col items-center">
        
        {/* Top Navigation - Badge & Mode Switcer */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-10">
          <div className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
            {viewMode === 'flashcard' ? 'Reviewing' : viewMode === 'quiz' ? 'Quiz Mode' : 'Monthly View'}
          </div>
          <div className="hidden lg:flex items-center gap-2">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-text-sub dark:text-dark-text-sub text-[10px] font-bold">
               <Monitor size={14} />
               Desktop Mode
             </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="w-full h-full flex items-center justify-center pb-20 lg:pb-0"
          >
            {viewMode === 'flashcard' && (
              <div className="flex flex-col items-center max-w-2xl w-full">
                <Flashcard item={currentItem} onReview={handleReview} />
                
                <div className="mt-14 flex items-center gap-10">
                  <button 
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-5 bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 rounded-[24px] text-text-sub dark:text-dark-text-sub hover:text-primary transition-all shadow-xl hover:shadow-2xl disabled:opacity-20"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <div className="bg-primary/5 dark:bg-primary/10 px-8 py-4 rounded-[28px] border border-primary/20">
                    <span className="text-primary text-xl font-black font-mono">
                      {String(currentIndex + 1).padStart(2, '0')} / {allWords.length}
                    </span>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="p-5 bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 rounded-[24px] text-text-sub dark:text-dark-text-sub hover:text-primary transition-all shadow-xl hover:shadow-2xl"
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>
              </div>
            )}

            {viewMode === 'quiz' && (
              <div className="w-full max-w-lg">
                <Quiz allData={allWords} onComplete={() => setViewMode('flashcard')} />
              </div>
            )}

            {viewMode === 'calendar' && (
              <Calendar progress={progress} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Navbar Overlay */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 h-18 bg-white/10 dark:bg-dark-card-bg/10 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[32px] flex items-center justify-around px-8 shadow-2xl z-40">
           <button 
            onClick={() => setViewMode('flashcard')}
            className={`p-3 rounded-2xl transition-all ${viewMode === 'flashcard' ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'text-slate-400'}`}
          >
            <BookOpen size={24} />
          </button>
          <button 
            onClick={() => setViewMode('quiz')}
            className={`p-3 rounded-2xl transition-all ${viewMode === 'quiz' ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'text-slate-400'}`}
          >
            <Trophy size={24} />
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`p-3 rounded-2xl transition-all ${viewMode === 'calendar' ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'text-slate-400'}`}
          >
            <CalendarIcon size={24} />
          </button>
        </div>
      </main>
    </div>
  );
}
