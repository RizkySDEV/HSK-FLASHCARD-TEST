import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { HSKItem } from '../types';

interface QuizProps {
  allData: HSKItem[];
  onComplete: () => void;
}

export default function Quiz({ allData, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentItem = allData[currentIndex];

  useEffect(() => {
    if (currentItem && !quizFinished) {
      // Generate 3 random wrong options
      const wrongOptions = allData
        .filter(item => item.id !== currentItem.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(item => item.meaning);
      
      const newOptions = [...wrongOptions, currentItem.meaning].sort(() => Math.random() - 0.5);
      setOptions(newOptions);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [currentIndex, currentItem, quizFinished, allData]);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const correct = option === currentItem.meaning;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    // Auto next after 1.5s
    setTimeout(() => {
      if (currentIndex < 9) { // Max 10 questions
        setCurrentIndex(c => c + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white border border-stone-200 rounded-[24px] shadow-xl max-w-md mx-auto min-h-[400px]">
        <h2 className="text-3xl font-bold text-text-main mb-4">Quiz Selesai!</h2>
        <p className="text-text-sub mb-8 text-lg">Skor Anda: <span className="font-bold text-accent">{score}</span> / 10</p>
        <div className="flex gap-4">
          <button 
            onClick={restartQuiz}
            className="px-6 py-3 bg-primary text-white rounded-xl flex items-center gap-2 hover:opacity-90 transition-colors shadow-lg shadow-primary/20"
          >
            <RotateCcw size={18} />
            Coba Lagi
          </button>
          <button 
            onClick={onComplete}
            className="px-6 py-3 border border-stone-200 text-text-sub rounded-xl hover:bg-stone-50 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6 px-2">
        <span className="text-text-sub text-xs font-bold uppercase tracking-widest">Question {currentIndex + 1} of 10</span>
        <span className="text-accent font-bold">Score: {score}</span>
      </div>

      <div className="p-12 bg-white border border-stone-100 rounded-[24px] shadow-xl mb-6 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <span className="text-text-sub text-[10px] uppercase font-bold tracking-[0.2em] mb-6">Pilih Arti yang Benar</span>
        <h1 className="text-[100px] font-medium text-text-main leading-none">{currentItem?.hanzi}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === currentItem?.meaning;
          
          let buttonClass = "w-full p-5 text-left border rounded-2xl transition-all flex justify-between items-center shadow-sm ";
          if (isSelected) {
            buttonClass += isCorrect ? "border-accent bg-green-50 text-green-700 font-bold" : "border-rose-400 bg-rose-50 text-rose-700 font-bold";
          } else if (selectedOption !== null && isCorrectOption) {
             buttonClass += "border-accent bg-green-50 text-green-700 font-bold scale-[1.02]";
          } else {
            buttonClass += "border-stone-100 bg-white text-text-sub hover:border-primary/30 hover:shadow-md";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              disabled={selectedOption !== null}
              className={buttonClass}
            >
              <span className="text-sm">{option}</span>
              {isSelected && (
                isCorrect ? <CheckCircle2 size={24} className="text-accent" /> : <XCircle size={24} className="text-rose-500" />
              )}
              {selectedOption !== null && isCorrectOption && !isSelected && <CheckCircle2 size={24} className="text-accent" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
