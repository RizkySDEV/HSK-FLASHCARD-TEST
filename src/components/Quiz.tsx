import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, Timer, Trophy, Star, ChevronLeft } from 'lucide-react';
import { HSKItem } from '../types';

interface QuizProps {
  allData: HSKItem[];
  onComplete: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

export default function Quiz({ allData, onComplete }: QuizProps) {
  const [level, setLevel] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter items based on selected level
  const quizItems = useMemo(() => {
    if (level === null) return [];
    const start = (level - 1) * 10;
    const end = start + 10;
    return allData.slice(start, end);
  }, [level, allData]);

  const currentItem = quizItems[currentIndex];

  const getDuration = useCallback(() => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 5;
      case 'hard': return 2;
      default: return 10;
    }
  }, [difficulty]);

  useEffect(() => {
    if (currentItem && !quizFinished && difficulty) {
      // Generate 3 random wrong options from allData to make it challenging
      const wrongOptions = allData
        .filter(item => item.id !== currentItem.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(item => item.meaning);
      
      const newOptions = [...wrongOptions, currentItem.meaning].sort(() => Math.random() - 0.5);
      setOptions(newOptions);
      setSelectedOption(null);
      setIsCorrect(null);
      setTimeLeft(getDuration());
      setIsPaused(false);
    }
  }, [currentIndex, currentItem, quizFinished, allData, difficulty, getDuration]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isPaused && !quizFinished && selectedOption === null) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 0.1), 100);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && selectedOption === null && difficulty) {
      handleOptionClick('TIMEOUT');
    }
  }, [timeLeft, isPaused, quizFinished, selectedOption, difficulty]);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const correct = option === currentItem.meaning;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    setIsPaused(true);

    // Auto next after 1s
    setTimeout(() => {
      if (currentIndex < quizItems.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
    setLevel(null);
    setDifficulty(null);
  };

  if (!level) {
    return (
      <div className="w-full max-w-2xl bg-white dark:bg-dark-card-bg p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl">
        <h2 className="text-3xl font-black text-primary mb-8 text-center flex items-center justify-center gap-3">
          <Trophy size={32} />
          Pilih Level Belajar
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setLevel(i + 1)}
              className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xl font-bold text-text-main dark:text-dark-text-main hover:bg-primary hover:text-white transition-all border border-slate-100 dark:border-slate-700"
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button 
          onClick={onComplete}
          className="w-full py-4 text-text-sub dark:text-dark-text-sub font-bold hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} />
          Kembali ke Flashcard
        </button>
      </div>
    );
  }

  if (level && !difficulty) {
    return (
      <div className="w-full max-w-md bg-white dark:bg-dark-card-bg p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
        <h2 className="text-2xl font-black text-text-main dark:text-dark-text-main mb-2">Level {level}</h2>
        <p className="text-text-sub dark:text-dark-text-sub mb-10">Pilih tingkat kesulitan latihan</p>
        
        <div className="space-y-4">
          {[
            { id: 'easy', label: 'Mudah', color: 'bg-green-500', desc: '10 detik per soal' },
            { id: 'medium', label: 'Menengah', color: 'bg-orange-500', desc: '5 detik per soal' },
            { id: 'hard', label: 'Sulit', color: 'bg-red-500', desc: '2 detik per soal' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setDifficulty(mode.id as Difficulty)}
              className="w-full p-6 text-left bg-slate-50 dark:bg-slate-800/50 rounded-[28px] border border-slate-100 dark:border-slate-700 hover:border-primary/50 transition-all group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xl font-black dark:text-dark-text-main">{mode.label}</span>
                <div className={`w-3 h-3 rounded-full ${mode.color} shadow-lg shadow-${mode.id}-500/30`}></div>
              </div>
              <p className="text-xs text-text-sub dark:text-dark-text-sub">{mode.desc}</p>
            </button>
          ))}
        </div>

        <button 
          onClick={() => setLevel(null)}
          className="mt-8 text-text-sub dark:text-dark-text-sub hover:text-primary font-bold text-sm"
        >
          Ganti Level
        </button>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 rounded-[40px] shadow-2xl max-w-md mx-auto min-h-[450px] text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
          <Star size={48} className="fill-primary" />
        </div>
        <h2 className="text-4xl font-black dark:text-dark-text-main mb-2">Latihan Selesai!</h2>
        <p className="text-text-sub dark:text-dark-text-sub mb-8 text-lg font-medium">Level {level} - {difficulty}</p>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 px-10 py-6 rounded-[32px] mb-10">
          <p className="text-text-sub dark:text-dark-text-sub text-xs uppercase font-bold tracking-widest mb-1">Total Skor</p>
          <p className="text-5xl font-black text-primary">{score} / {quizItems.length}</p>
        </div>

        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={restartQuiz}
            className="w-full py-5 bg-primary text-white rounded-[24px] font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
          >
            <RotateCcw size={20} />
            LATIHAN LAGI
          </button>
          <button 
            onClick={onComplete}
            className="w-full py-5 border border-slate-200 dark:border-slate-800 text-text-sub dark:text-dark-text-sub rounded-[24px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase text-sm tracking-widest"
          >
            Keluar
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = (timeLeft / getDuration()) * 100;

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-0">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex flex-col">
          <span className="text-primary text-[10px] uppercase font-black tracking-widest">Level {level} - {difficulty}</span>
          <span className="text-text-sub dark:text-dark-text-sub text-[10px] font-bold">SOAL {currentIndex + 1} / {quizItems.length}</span>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-dark-card-bg px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <Timer size={16} className={timeLeft < 2 ? 'text-red-500 animate-pulse' : 'text-primary'} />
           <span className={`font-mono font-bold ${timeLeft < 2 ? 'text-red-500' : 'text-text-main dark:text-dark-text-main'}`}>
             {timeLeft.toFixed(1)}s
           </span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
        <motion.div 
          initial={false}
          animate={{ 
            width: `${progressPercentage}%`,
            backgroundColor: progressPercentage < 30 ? '#ef4444' : '#4f46e5'
          }}
          className="h-full bg-primary"
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="p-10 bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 rounded-[40px] shadow-2xl mb-8 flex flex-col items-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center"
          >
            <span className="text-text-sub dark:text-dark-text-sub text-[10px] uppercase font-black tracking-[0.2em] mb-8">Pilih Arti yang Benar</span>
            <h1 className="text-8xl sm:text-[120px] font-black text-text-main dark:text-dark-text-main leading-none drop-shadow-sm font-sans underline decoration-primary/20 decoration-8 underline-offset-12 mb-4">
              {currentItem?.hanzi}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-20 sm:pb-0">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === currentItem?.meaning;
          
          let buttonClass = "group w-full p-6 text-left border-[2px] rounded-[28px] transition-all flex justify-between items-center shadow-sm relative overflow-hidden ";
          if (isSelected) {
            buttonClass += isCorrect ? "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-black scale-[1.03]" : "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-black";
          } else if (selectedOption !== null && isCorrectOption) {
             buttonClass += "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-black";
          } else {
            buttonClass += "border-slate-100 dark:border-slate-800 bg-white dark:bg-dark-card-bg text-text-sub dark:text-dark-text-sub hover:border-primary/50 hover:shadow-lg disabled:opacity-50";
          }

          return (
            <motion.button
              key={idx}
              whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
              whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
              onClick={() => handleOptionClick(option)}
              disabled={selectedOption !== null}
              className={buttonClass}
            >
              <div className="flex items-center gap-4">
                 <div className={`w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black ${isSelected ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800'}`}>
                    {String.fromCharCode(65 + idx)}
                 </div>
                 <span className="text-lg font-bold">{option}</span>
              </div>
              <AnimatePresence>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    {isCorrect ? <CheckCircle2 size={24} className="text-green-500" /> : <XCircle size={24} className="text-red-500" />}
                  </motion.div>
                )}
                {selectedOption !== null && isCorrectOption && !isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 size={24} className="text-green-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
