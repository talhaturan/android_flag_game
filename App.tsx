
import React, { useState, useEffect, useCallback } from 'react';
import { Country, GameView, QuestionType, QuizQuestion, GameStats } from './types';
import { getFunFact } from './services/geminiService';

// Components
import Home from './components/Home';
import Quiz from './components/Quiz';
import LearnMode from './components/LearnMode';
import Result from './components/Result';

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<GameView>(GameView.HOME);
  const [stats, setStats] = useState<GameStats>({ score: 0, total: 0, history: [] });
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const [funFact, setFunFact] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,currencies,cca3,region,population');
        const data = await res.json();
        setCountries(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch countries", error);
        setLoading(false);
      }
    };
    loadCountries();
  }, []);

  const generateQuestion = useCallback(() => {
    if (countries.length === 0) return;

    const types = [QuestionType.NAME, QuestionType.CAPITAL, QuestionType.CURRENCY];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Pick a random country that has the required data
    let targetCountry: Country;
    do {
      targetCountry = countries[Math.floor(Math.random() * countries.length)];
    } while (
      (type === QuestionType.CAPITAL && (!targetCountry.capital || targetCountry.capital.length === 0)) ||
      (type === QuestionType.CURRENCY && (!targetCountry.currencies || Object.keys(targetCountry.currencies).length === 0))
    );

    let correctAnswer = '';
    if (type === QuestionType.NAME) correctAnswer = targetCountry.name.common;
    if (type === QuestionType.CAPITAL) correctAnswer = targetCountry.capital?.[0] || 'Unknown';
    if (type === QuestionType.CURRENCY) {
      // FIX: Explicitly cast Object.values to avoid 'unknown' type errors during property access
      const currencyList = Object.values(targetCountry.currencies || {}) as any[];
      correctAnswer = currencyList[0]?.name || 'Unknown';
    }

    // Pick 3 wrong options
    const options = [correctAnswer];
    while (options.length < 4) {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      let wrongValue = '';
      if (type === QuestionType.NAME) wrongValue = randomCountry.name.common;
      if (type === QuestionType.CAPITAL) wrongValue = randomCountry.capital?.[0] || 'Unknown';
      if (type === QuestionType.CURRENCY) {
        // FIX: Explicitly cast Object.values to avoid 'unknown' type errors during property access
        const currencyList = Object.values(randomCountry.currencies || {}) as any[];
        wrongValue = currencyList[0]?.name || 'Unknown';
      }

      if (wrongValue && !options.includes(wrongValue) && wrongValue !== 'Unknown') {
        options.push(wrongValue);
      }
    }

    setCurrentQuestion({
      country: targetCountry,
      options: options.sort(() => Math.random() - 0.5),
      correctAnswer,
      type
    });
    setFunFact(null);
  }, [countries]);

  const startQuiz = () => {
    setStats({ score: 0, total: 0, history: [] });
    generateQuestion();
    setView(GameView.QUIZ);
  };

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const fact = await getFunFact(currentQuestion.country.name.common);
      setFunFact(fact);
    }

    setStats(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      total: prev.total + 1,
      history: [...prev.history, { country: currentQuestion.country.name.common, correct: isCorrect }]
    }));

    return isCorrect;
  };

  const nextQuestion = () => {
    if (stats.total >= 10) {
      setView(GameView.RESULT);
    } else {
      generateQuestion();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-medium animate-pulse">Mapping the world...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative overflow-hidden flex flex-col">
      {/* App Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
        <button 
          onClick={() => setView(GameView.HOME)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <i className="fa-solid fa-earth-americas text-indigo-600 text-xl"></i>
        </button>
        <h1 className="text-lg font-bold text-slate-800">Global Explorer</h1>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {view === GameView.HOME && <Home startQuiz={startQuiz} enterLearn={() => setView(GameView.LEARN)} />}
        {view === GameView.QUIZ && currentQuestion && (
          <Quiz 
            question={currentQuestion} 
            handleAnswer={handleAnswer} 
            nextQuestion={nextQuestion} 
            stats={stats}
            funFact={funFact}
            onFlagTap={setSelectedFlag}
          />
        )}
        {view === GameView.LEARN && <LearnMode countries={countries} onFlagTap={setSelectedFlag} />}
        {view === GameView.RESULT && <Result stats={stats} restart={startQuiz} goHome={() => setView(GameView.HOME)} />}
      </main>

      {/* Fullscreen Flag Modal */}
      {selectedFlag && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200"
          onClick={() => setSelectedFlag(null)}
        >
          <img src={selectedFlag} alt="Flag Detail" className="max-w-full max-h-[80vh] shadow-2xl rounded-lg" />
          <button className="absolute top-8 right-8 text-white text-3xl">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
