import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw } from 'lucide-react';
import { HSKItem } from '../types';
import { useTTS } from '../hooks/useTTS';

interface FlashcardProps {
  item: HSKItem;
  onReview: (difficult: 'easy' | 'good' | 'hard') => void;
}

export default function Flashcard({ item, onReview }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { speak } = useTTS();

  useEffect(() => {
    setIsFlipped(false);
  }, [item]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.hanzi);
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <div 
        className="relative min-h-[400px] cursor-pointer"
        onClick={handleFlip}
      >
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-card-bg border border-stone-100 rounded-[24px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]"
            >
              <h1 className="text-[120px] font-medium text-text-main mb-4 leading-none">{item.hanzi}</h1>
              <button 
                onClick={handleSpeak}
                className="absolute top-6 right-6 w-10 h-10 bg-stone-50 text-primary rounded-full hover:bg-stone-100 transition-colors flex items-center justify-center"
                aria-label="Listen"
              >
                <Volume2 size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-card-bg border border-stone-100 rounded-[24px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] text-center"
            >
              <div className="mb-6">
                <p className="text-primary font-bold text-2xl mb-2 tracking-wide uppercase">{item.pinyin}</p>
                <h2 className="text-xl font-medium text-text-sub">{item.meaning}</h2>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl max-w-[85%] border border-stone-100">
                <p className="text-text-main text-sm font-medium mb-1">"{item.example}"</p>
                <p className="text-xs text-text-sub">({item.examplePinyin})</p>
              </div>

              <div className="mt-10 flex gap-4">
                 <button 
                  onClick={(e) => { e.stopPropagation(); onReview('hard'); }}
                  className="flex-1 px-8 py-3 bg-hard text-hard-text rounded-xl hover:opacity-80 transition-all flex flex-col items-center"
                >
                  <span className="font-bold text-sm">Hard</span>
                  <span className="text-[10px] opacity-70">Ulang 1m</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onReview('good'); }}
                  className="flex-1 px-8 py-3 bg-good text-good-text rounded-xl hover:opacity-80 transition-all flex flex-col items-center"
                >
                  <span className="font-bold text-sm">Good</span>
                  <span className="text-[10px] opacity-70">Ulang 1h</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onReview('easy'); }}
                  className="flex-1 px-8 py-3 bg-easy text-easy-text rounded-xl hover:opacity-80 transition-all flex flex-col items-center"
                >
                  <span className="font-bold text-sm">Easy</span>
                  <span className="text-[10px] opacity-70">Ulang 4d</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors text-sm"
        >
          <RotateCcw size={16} />
          {isFlipped ? 'Lihat Hanzi' : 'Lihat Arti'}
        </button>
      </div>
    </div>
  );
}
