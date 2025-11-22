import React, { useState } from 'react';
import { RefreshCcw, ArrowLeft, User } from 'lucide-react';
import { SINGLES_QUESTIONS } from '../constants';
import { ViewProps, AssessmentResult } from '../types';

const SinglesAssessment: React.FC<ViewProps> = ({ setView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentIndex < SINGLES_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    const maxPossible = SINGLES_QUESTIONS.length * 5;
    const total = finalAnswers.reduce((a, b) => a + b, 0);
    const avg = total / finalAnswers.length;
    
    let summary = "";
    let rec = "";

    if (avg >= 4) {
      summary = "Spiritually Prepared";
      rec = "You show strong signs of emotional maturity and readiness. Continue praying for wisdom in your relationships.";
    } else if (avg >= 2.5) {
      summary = "Growing in Grace";
      rec = "You are on the right path, but there are areas of healing or maturity to address before entering a covenant marriage.";
    } else {
      summary = "Season of Waiting";
      rec = "This may be a season to focus deeply on your own healing and walk with God before pursuing a relationship.";
    }

    setResult({
      score: Math.round((total / maxPossible) * 100),
      summary,
      recommendation: rec
    });
  };

  const reset = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setResult(null);
  };

  if (result) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-material-lg border border-teal-100 dark:border-teal-900/30 w-full max-w-sm text-center transition-colors duration-200">
          <div className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <span className="text-3xl font-bold font-serif">{result.score}%</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-3">{result.summary}</h2>
          <p className="text-slate-600 dark:text-slate-300 text-base mb-8 leading-relaxed">{result.recommendation}</p>
          
          <div className="space-y-4">
             <button 
              onClick={() => setView('chat')}
              className="w-full bg-teal-600 text-white py-4 rounded-full font-bold hover:bg-teal-700 transition-colors shadow-md"
            >
              Discuss Readiness in Chat
            </button>
            <button 
              onClick={() => setView('home')}
              className="w-full bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-4 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Return Home
            </button>
            <button 
              onClick={reset}
              className="flex items-center justify-center gap-2 w-full text-slate-500 dark:text-slate-400 text-sm mt-4 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <RefreshCcw size={14} /> Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / SINGLES_QUESTIONS.length) * 100;
  const currentQuestion = SINGLES_QUESTIONS[currentIndex];

  return (
    <div className="p-6 max-w-md mx-auto h-full flex flex-col">
      <button 
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 text-sm transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-widest">
            <User size={14} /> Singles Readiness
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-3 text-right uppercase">Question {currentIndex + 1} of {SINGLES_QUESTIONS.length}</p>
      </div>

      <div className="flex-1 flex flex-col justify-start overflow-y-auto pb-4">
        <h3 className="text-2xl font-serif font-semibold text-slate-800 dark:text-slate-100 mb-8 text-center leading-snug transition-colors">
          {currentQuestion.text}
        </h3>

        <div className="grid gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all active:scale-[0.98] bg-white dark:bg-slate-800 shadow-sm"
            >
              <span className="text-base font-medium text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300 text-left">
                {option.label}
              </span>
              <div className={`w-6 h-6 flex-shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-teal-500 dark:group-hover:border-teal-400 flex items-center justify-center ml-3`}>
                <div className="w-3 h-3 rounded-full bg-teal-500 dark:bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglesAssessment;