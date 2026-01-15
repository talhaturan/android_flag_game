
import React from 'react';
import { GameStats } from '../types';

interface ResultProps {
  stats: GameStats;
  restart: () => void;
  goHome: () => void;
}

const Result: React.FC<ResultProps> = ({ stats, restart, goHome }) => {
  const percentage = (stats.score / stats.total) * 100;

  const getMessage = () => {
    if (percentage >= 90) return { title: "Global Genius!", text: "You're a master of world geography.", icon: "🏆", color: "text-amber-500" };
    if (percentage >= 70) return { title: "Great Explorer!", text: "Impressive knowledge! Keep exploring.", icon: "🌟", color: "text-emerald-500" };
    if (percentage >= 50) return { title: "Voyager!", text: "Good effort! Practice makes perfect.", icon: "⛵", color: "text-indigo-500" };
    return { title: "Backpacker", text: "Time to hit the books and try again!", icon: "🎒", color: "text-slate-500" };
  };

  const message = getMessage();

  return (
    <div className="p-8 flex flex-col h-full items-center text-center animate-in fade-in zoom-in duration-500">
      <div className="mt-8 mb-6 relative">
        <span className="text-7xl block mb-4">{message.icon}</span>
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black border-4 border-white shadow-lg">
          {Math.round(percentage)}%
        </div>
      </div>

      <h2 className={`text-3xl font-black mb-2 ${message.color}`}>{message.title}</h2>
      <p className="text-slate-500 font-medium mb-12">{message.text}</p>

      <div className="w-full bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-12">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Correct</p>
            <p className="text-3xl font-black text-emerald-600">{stats.score}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Questions</p>
            <p className="text-3xl font-black text-slate-800">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={restart}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 active:scale-95 transition-all"
        >
          Try Again
        </button>
        <button 
          onClick={goHome}
          className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold active:scale-95 transition-all"
        >
          Main Menu
        </button>
      </div>

      <div className="mt-12 w-full">
        <h3 className="text-left text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quiz History</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {stats.history.map((h, i) => (
            <div 
              key={i} 
              className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${h.correct ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-rose-100 bg-rose-50 text-rose-600'}`}
              title={h.country}
            >
              <i className={`fa-solid ${h.correct ? 'fa-check' : 'fa-xmark'}`}></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Result;
