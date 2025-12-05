
import React from 'react';
import { AlertTriangle, MessageCircle, XCircle } from 'lucide-react';

interface SafetyModeProps {
  onClose: () => void;
  onEscalate: () => void;
}

const SafetyMode: React.FC<SafetyModeProps> = ({ onClose, onEscalate }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-red-50/95 dark:bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 transition-colors">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 border-2 border-red-100 dark:border-red-900/50">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
        </div>
        
        <h2 className="text-2xl font-serif font-bold text-red-900 dark:text-red-200 mb-2">Safety Alert</h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
          We detected language that suggests immediate danger or abuse. Your safety matters deeply to God and to us. Please reach out for human help immediately.
        </p>

        <div className="space-y-3">
          <a 
            href="https://wa.me/2349061130702"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors shadow-md"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp (Emergency)
          </a>
          
          <button 
            onClick={onEscalate}
            className="w-full bg-slate-900 dark:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shadow-sm"
          >
            Speak to a Counselor Now
          </button>

          <button 
            onClick={onClose}
            className="w-full bg-white dark:bg-transparent text-slate-500 dark:text-slate-400 font-medium py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            I am safe, return to chat
          </button>
        </div>

        <div className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          "God is our refuge and strength, an ever-present help in trouble." <br/>— Psalm 46:1
        </div>
      </div>
    </div>
  );
};

export default SafetyMode;
