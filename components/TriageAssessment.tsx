
import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, RefreshCcw, ArrowLeft } from 'lucide-react';
import { TRIAGE_QUESTIONS } from '../constants';
import { ViewProps, AssessmentResult, UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';

const TriageAssessment: React.FC<ViewProps> = ({ setView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const { user } = useAuth();

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentIndex < TRIAGE_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const saveResultToProfile = (finalResult: AssessmentResult) => {
      const profileKey = user ? `kfm_profile_${user.id}` : 'kfm_profile_guest';
      const savedProfile = localStorage.getItem(profileKey);
      let profile: UserProfile = savedProfile ? JSON.parse(savedProfile) : { name: '', spouseName: '', triageHistory: [] };
      
      if (!profile.triageHistory) profile.triageHistory = [];
      
      profile.triageHistory.push({
          date: Date.now(),
          score: finalResult.score,
          summary: finalResult.summary
      });
      
      localStorage.setItem(profileKey, JSON.stringify(profile));
  };

  const calculateResult = (finalAnswers: number[]) => {
    const maxPossible = TRIAGE_QUESTIONS.length * 5;
    const total = finalAnswers.reduce((a, b) => a + b, 0);
    const avg = total / finalAnswers.length;
    
    let summary = "";
    let rec = "";

    // Safety check
    const conflictScore = finalAnswers[2]; 
    
    if (conflictScore === 1) {
        summary = "Safety Priority";
        rec = "You indicated feeling unsafe during conflicts. Please prioritize your physical and emotional safety. We strongly recommend seeking immediate support from a counselor or safe contact.";
    } else if (avg >= 4) {
      summary = "Strong Foundation";
      rec = "Your marriage shows great resilience. Keep investing in spiritual intimacy to maintain this bond.";
    } else if (avg >= 2.5) {
      summary = "Needs Attention";
      rec = "There are some gaps in connection. Consider setting aside dedicated time for communication this week.";
    } else {
      summary = "Critical Care Needed";
      rec = "Your relationship is under significant strain. We strongly recommend speaking with a counselor.";
    }

    const res = {
      score: Math.round((total / maxPossible) * 100),
      summary,
      recommendation: rec
    };

    setResult(res);
    saveResultToProfile(res);
  };

  const reset = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setResult(null);
  };

  if (result) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-material-lg w-full max-w-sm text-center transition-colors duration-200">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${result.summary === 'Safety Priority' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'}`}>
            <span className="text-3xl font-bold font-serif">{result.score}%</span>
          </div>
          <h2 className={`text-3xl font-serif font-bold mb-3 ${result.summary === 'Safety Priority' ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>{result.summary}</h2>
          <p className="text-slate-600 dark:text-slate-300 text-base mb-8 leading-relaxed">{result.recommendation}</p>
          
          <div className="space-y-4">
             <button 
              onClick={() => setView('chat')}
              className="w-full bg-brand-600 text-white py-4 rounded-full font-bold shadow-md hover:bg-brand-700 transition-all active:scale-[0.98]"
            >
              Discuss in Chat
            </button>
            <button 
              onClick={() => setView('counselor')}
              className="w-full bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-4 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
            >
              Connect with Counselor
            </button>
            <button 
              onClick={reset}
              className="flex items-center justify-center gap-2 w-full text-slate-500 dark:text-slate-400 text-sm mt-4 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <RefreshCcw size={14} /> Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / TRIAGE_QUESTIONS.length) * 100;
  const currentQuestion = TRIAGE_QUESTIONS[currentIndex];

  return (
    <div className="p-6 max-w-md mx-auto h-full flex flex-col">
      <button 
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 text-sm transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="mb-8">
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-3 text-right uppercase tracking-wide">Question {currentIndex + 1} of {TRIAGE_QUESTIONS.length}</p>
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
              className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-slate-700 shadow-sm transition-all active:scale-[0.98]"
            >
              <span className="text-base font-medium text-slate-700 dark:text-slate-200 group-hover:text-brand-800 dark:group-hover:text-brand-200 text-left">
                {option.label}
              </span>
              <div className={`w-6 h-6 flex-shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-500 group-hover:border-brand-500 dark:group-hover:border-brand-400 flex items-center justify-center ml-3`}>
                <div className="w-3 h-3 rounded-full bg-brand-500 dark:bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TriageAssessment;
