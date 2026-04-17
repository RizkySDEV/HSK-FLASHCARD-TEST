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
  const [isSpeakingWord, setIsSpeakingWord] = useState(false);
  const [isSpeakingExample, setIsSpeakingExample] = useState(false);
  const [speechMode, setSpeechMode] = useState<'normal' | 'dictation'>('normal');
  const { speak } = useTTS();

  useEffect(() => {
    setIsFlipped(false);
  }, [item]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Toggle logic: if already speaking word, cycle mode
    let nextMode = speechMode;
    if (isSpeakingWord) {
      nextMode = speechMode === 'normal' ? 'dictation' : 'normal';
      setSpeechMode(nextMode);
    }

    setIsSpeakingWord(true);
    speak(item.hanzi, nextMode === 'dictation' ? 0.3 : 0.9);
    
    // Adjust timeout based on length and mode
    const duration = nextMode === 'dictation' ? 2000 : 1000;
    setTimeout(() => setIsSpeakingWord(false), duration);
  };

  const handleSpeakExample = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    let nextMode = speechMode;
    if (isSpeakingExample) {
      nextMode = speechMode === 'normal' ? 'dictation' : 'normal';
      setSpeechMode(nextMode);
    }

    setIsSpeakingExample(true);
    speak(item.example, nextMode === 'dictation' ? 0.3 : 0.9);
    
    const duration = nextMode === 'dictation' ? 5000 : 2500;
    setTimeout(() => setIsSpeakingExample(false), duration);
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
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl transition-colors"
            >
              <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${speechMode === 'dictation' ? 'bg-orange-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                   {speechMode === 'dictation' ? 'Dikte (Lambat)' : 'Normal'}
                </div>
              </div>

              <motion.h1 
                animate={isSpeakingWord ? { scale: [1, 1.1, 1] } : {}}
                className="text-[120px] font-medium text-text-main dark:text-dark-text-main mb-4 leading-none select-none"
              >
                {item.hanzi}
              </motion.h1>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSpeak}
                className={`absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isSpeakingWord 
                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                    : 'bg-slate-100 dark:bg-slate-800 text-primary hover:bg-primary hover:text-white dark:hover:bg-primary'
                }`}
                aria-label="Listen"
              >
                <div className="relative">
                  {isSpeakingWord && (
                    <motion.div 
                      layoutId="pulse"
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute inset-0 bg-primary rounded-full"
                    />
                  )}
                  <Volume2 size={24} />
                </div>
              </motion.button>
              
              <p className="absolute bottom-10 text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] animate-pulse">
                Ketuk untuk membalik
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl text-center transition-colors"
            >
              <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${speechMode === 'dictation' ? 'bg-orange-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                   {speechMode === 'dictation' ? 'Dikte' : 'Normal'}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-primary font-bold text-3xl mb-3 tracking-wide uppercase">{item.pinyin}</p>
                <h2 className="text-2xl font-semibold text-text-main dark:text-dark-text-main">{item.meaning}</h2>
              </div>

              <div className="group relative bg-slate-50 dark:bg-slate-800/40 p-6 pt-10 rounded-2xl max-w-[90%] border border-slate-100 dark:border-slate-800 transition-all hover:border-primary/30">
                <button 
                  onClick={handleSpeakExample}
                  className={`absolute top-3 right-3 p-2 rounded-xl transition-all ${isSpeakingExample ? 'bg-primary text-white' : 'text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700'}`}
                >
                  <Volume2 size={18} />
                </button>
                <p className="text-text-main dark:text-slate-200 text-lg font-medium mb-1">"{item.example}"</p>
                <p className="text-sm text-text-sub dark:text-dark-text-sub font-mono italic mb-2">({item.examplePinyin})</p>
                <div className="h-px w-8 bg-primary/20 mx-auto mb-2"></div>
                <p className="text-xs text-text-sub dark:text-dark-text-sub font-medium opacity-80 uppercase tracking-wider">{item.exampleMeaning}</p>
              </div>

              <div className="mt-12 flex gap-3 w-full max-w-sm">
                 <button 
                  onClick={(e) => { e.stopPropagation(); onReview('hard'); }}
                  className="flex-1 px-4 py-4 bg-hard dark:bg-dark-hard text-hard-text dark:text-dark-hard-text rounded-2xl hover:opacity-90 transition-all flex flex-col items-center shadow-lg shadow-hard/20 dark:shadow-dark-hard/20"
                >
                  <span className="font-bold text-sm">Hard</span>
                  <span className="text-[10px] opacity-70">Ulang 1m</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onReview('good'); }}
                  className="flex-1 px-4 py-4 bg-good dark:bg-dark-good text-good-text dark:text-dark-good-text rounded-2xl hover:opacity-90 transition-all flex flex-col items-center shadow-lg shadow-good/20 dark:shadow-dark-good/20"
                >
                  <span className="font-bold text-sm">Good</span>
                  <span className="text-[10px] opacity-70">Ulang 1h</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onReview('easy'); }}
                  className="flex-1 px-4 py-4 bg-easy dark:bg-dark-easy text-easy-text dark:text-dark-easy-text rounded-2xl hover:opacity-90 transition-all flex flex-col items-center shadow-lg shadow-easy/20 dark:shadow-dark-easy/20"
                >
                  <span className="font-bold text-sm">Easy</span>
                  <span className="text-[10px] opacity-70">Ulang 4d</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-10 flex justify-center">
        <motion.button 
          whileHover={{ x: [0, -2, 2, 0] }}
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <RotateCcw size={18} />
          {isFlipped ? 'Hanzi' : 'Detail'}
        </motion.button>
      </div>
    </div>
  );
}
