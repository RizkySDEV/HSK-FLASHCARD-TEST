/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import hskData from './data/hsk1.json';
import { HSKItem, CardState, ViewMode } from './types';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import { BookOpen, Trophy, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'hsk1_progress';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('flashcard');
  const [progress, setProgress] = useState<Record<string, CardState>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  const allWords = hskData as HSKItem[];

  // Sort words based on intervals for "Review" mode eventually
  // But for now, we'll just use a simple index to browse
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

    // Go to next card automatically
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < allWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back for now
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const learnedCount = Object.keys(progress).length;

  return (
    <div className="flex h-screen overflow-hidden bg-bg font-sans text-text-main">
      {/* Sidebar */}
      <aside className="w-70 bg-white border-r border-stone-200 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              华
            </div>
            <h1 className="font-extrabold text-xl tracking-tight text-primary">HSK 1 Flashcards</h1>
          </div>

          <nav className="flex flex-col gap-2 mb-8">
            <button 
              onClick={() => setViewMode('flashcard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${viewMode === 'flashcard' ? 'bg-stone-100 text-primary' : 'text-text-sub hover:bg-stone-50'}`}
            >
              <BookOpen size={20} />
              Belajar
            </button>
            <button 
              onClick={() => setViewMode('quiz')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${viewMode === 'quiz' ? 'bg-stone-100 text-primary' : 'text-text-sub hover:bg-stone-50'}`}
            >
              <Trophy size={20} />
              Mode Kuis
            </button>
          </nav>

          <div className="space-y-3">
            <div className="bg-bg p-4 rounded-xl border border-stone-100">
              <p className="text-text-sub text-[10px] uppercase font-bold tracking-widest mb-1">Kosa Kata Mastered</p>
              <h3 className="text-2xl font-bold">{learnedCount} / {allWords.length}</h3>
            </div>
            <div className="bg-bg p-4 rounded-xl border border-stone-100">
              <p className="text-text-sub text-[10px] uppercase font-bold tracking-widest mb-1">Session</p>
              <h3 className="text-2xl font-bold">A+</h3>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-text-sub text-[10px] uppercase font-bold tracking-widest mb-2">Progres HSK Level 1</p>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-accent transition-all duration-500" 
              style={{ width: `${(learnedCount / allWords.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-text-sub text-right font-medium">
            {Math.round((learnedCount / allWords.length) * 100)}% Selesai
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative flex flex-col items-center justify-center p-10">
        <div className="absolute top-10 right-10 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
          {viewMode === 'flashcard' ? 'Mode Belajar: Spaced Repetition' : 'Mode Latihan: Kuis Interaktif'}
        </div>

        {viewMode === 'flashcard' ? (
          <div className="flex flex-col items-center max-w-2xl w-full">
            <Flashcard 
              item={currentItem} 
              onReview={handleReview} 
            />
            
            <div className="mt-12 flex items-center gap-8">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-4 bg-white border border-stone-200 rounded-2xl text-text-sub hover:text-primary disabled:opacity-30 transition-all shadow-sm hover:shadow-md"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="text-text-sub text-sm font-bold font-mono bg-white px-4 py-2 rounded-lg border border-stone-100">
                {String(currentIndex + 1).padStart(2, '0')} / {allWords.length}
              </span>
              <button 
                onClick={handleNext}
                className="p-4 bg-white border border-stone-200 rounded-2xl text-text-sub hover:text-primary transition-all shadow-sm hover:shadow-md"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <p className="mt-10 text-text-sub text-xs italic opacity-60">
              Tip: Klik kartu untuk membalik atau gunakan tombol review di dalam kartu
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <Quiz allData={allWords} onComplete={() => setViewMode('flashcard')} />
          </div>
        )}
      </main>
    </div>
  );
}
