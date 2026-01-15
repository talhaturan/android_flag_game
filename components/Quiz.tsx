
import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuestionType, GameStats } from '../types';

interface QuizProps {
  question: QuizQuestion;
  handleAnswer: (answer: string) => Promise<boolean | undefined>;
  nextQuestion: () => void;
  stats: GameStats;
  funFact: string | null;
  onFlagTap: (url: string) => void;
}

const Quiz: React.FC<QuizProps> = ({ question, handleAnswer, nextQuestion, stats, funFact, onFlagTap }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    setSelected(null);
    setIsCorrect(null);
    setIsAnswering(false);
  }, [question]);

  const onOptionClick = async (option: string) => {
    if (selected || isAnswering) return;
    setIsAnswering(true);
    setSelected(option);
    const correct = await handleAnswer(option);
    setIsCorrect(!!correct);
    setIsAnswering(false);
  };

  const getQuestionText = () => {
    switch (question.type) {
      case QuestionType.NAME: return "Which country does this flag belong to?";
      case QuestionType.CAPITAL: return `What is the capital of ${question.country.name.common}?`;
      case QuestionType.CURRENCY: return `What currency is used in ${question.country.name.common}?`;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col animate-in fade-in duration-500">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {stats.total + 1} of 10</span>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Score: {stats.score}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${(stats.total / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flag Display */}
      <div className="mb-8 flex flex-col items-center">
        <div 
          className="relative group cursor-pointer w-full max-w-[240px] aspect-[3/2] rounded-xl overflow-hidden shadow-xl ring-4 ring-white"
          onClick={() => onFlagTap(question.country.flags.svg)}
        >
          <img 
            src={question.country.flags.svg} 
            alt="Country Flag" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <i className="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 transition-opacity"></i>
          </div>
        </div>
        <p className="mt-6 text-xl font-bold text-slate-800 text-center">{getQuestionText()}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-8">
        {question.options.map((option, idx) => {
          const isSelected = selected === option;
          const isActuallyCorrect = option === question.correctAnswer;
          
          let buttonClass = "w-full p-4 text-left font-semibold rounded-2xl border-2 transition-all flex items-center justify-between ";
          
          if (!selected) {
            buttonClass += "border-slate-100 hover:border-indigo-200 text-slate-700 hover:bg-indigo-50/30";
          } else {
            if (isActuallyCorrect) {
              buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
            } else if (isSelected) {
              buttonClass += "border-rose-500 bg-rose-50 text-rose-700";
            } else {
              buttonClass += "border-slate-100 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={!!selected}
              onClick={() => onOptionClick(option)}
              className={buttonClass}
            >
              <span>{option}</span>
              {selected && isActuallyCorrect && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
              {selected && isSelected && !isActuallyCorrect && <i className="fa-solid fa-circle-xmark text-rose-500"></i>}
            </button>
          );
        })}
      </div>

      {/* Result Feedback */}
      {selected && (
        <div className="mt-auto space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          {isCorrect && funFact && (
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
              <i className="fa-solid fa-lightbulb text-amber-500 mt-1"></i>
              <div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-tighter mb-1">Fun Fact</p>
                <p className="text-sm text-indigo-900 font-medium">{funFact}</p>
              </div>
            </div>
          )}
          
          <button 
            onClick={nextQuestion}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            {stats.total >= 9 ? 'Finish Quiz' : 'Next Question'}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
