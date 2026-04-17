import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { CardState } from '../types';
import { useState } from 'react';

interface CalendarProps {
  progress: Record<string, CardState>;
}

export default function Calendar({ progress }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const days = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Group progress by date
  const dueDates = Object.values(progress).reduce((acc: Record<string, number>, curr) => {
    const date = new Date(curr.nextReview).toDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-dark-card-bg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-dark-text-main">{monthName}</h2>
            <p className="text-sm text-slate-500">{year}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg dark:text-dark-text-sub">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg dark:text-dark-text-sub">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-16" />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isToday = date.toDateString() === new Date().toDateString();
          const countDue = dueDates[date.toDateString()];

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.05 }}
              className={`h-16 p-2 rounded-2xl flex flex-col items-center justify-between border transition-all ${
                isToday 
                  ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                  : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'
              }`}
            >
              <span className={`text-xs font-bold ${isToday ? 'text-primary' : 'dark:text-dark-text-sub text-slate-500'}`}>
                {day}
              </span>
              {countDue && (
                <div className="w-full">
                  <div className="h-1 bg-primary rounded-full mb-1" style={{ opacity: Math.min(countDue / 5, 1) }} />
                  <p className="text-[8px] text-center font-bold text-primary truncate">
                    {countDue} items
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">Summary</h4>
        <div className="flex gap-4">
          <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Total Due</p>
            <p className="text-2xl font-bold dark:text-dark-text-main">
              {Object.values(dueDates).reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Mastered</p>
            <p className="text-2xl font-bold dark:text-dark-text-main">{Object.keys(progress).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
