
import React from 'react';

interface HomeProps {
  startQuiz: () => void;
  enterLearn: () => void;
}

const Home: React.FC<HomeProps> = ({ startQuiz, enterLearn }) => {
  return (
    <div className="p-6 flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-indigo-50 rounded-3xl mb-4">
          <i className="fa-solid fa-flag-checkered text-6xl text-indigo-600"></i>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">Test Your Global Knowledge</h2>
        <p className="text-slate-500 max-w-[280px] mx-auto">Master flags, capitals, and currencies of the world with our interactive quiz.</p>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={startQuiz}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <i className="fa-solid fa-play"></i>
          Start Quiz
        </button>
        <button 
          onClick={enterLearn}
          className="w-full py-4 bg-white border-2 border-slate-100 hover:border-indigo-100 text-slate-700 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <i className="fa-solid fa-book-open text-indigo-500"></i>
          Learn Mode
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full pt-8">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-amber-800 text-sm font-semibold mb-1">Total Countries</p>
          <p className="text-2xl font-black text-amber-900">250+</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-emerald-800 text-sm font-semibold mb-1">Quiz Length</p>
          <p className="text-2xl font-black text-emerald-900">10 Rounds</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
