
import React, { useMemo } from 'react';
import { MessageCircle, ClipboardList, User, ShieldAlert, BookOpen, ArrowRight, PenTool } from 'lucide-react';
import { ViewProps } from '../types';
import { DAILY_VERSES } from '../constants';

const HomeView: React.FC<ViewProps> = ({ setView }) => {
  // Select a "Verse of the Day"
  const verseOfTheDay = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
  }, []);

  return (
    <div className="flex flex-col w-full bg-surface-light dark:bg-surface-dark pb-8 h-full overflow-y-auto transition-colors duration-200">
      {/* Top Verse Banner */}
      <div className="px-4 pt-6 pb-2">
        <div className="max-w-4xl mx-auto bg-brand-50 dark:bg-slate-800/50 rounded-3xl p-6 text-center border border-brand-100 dark:border-slate-700">
           <p className="font-serif text-slate-700 dark:text-slate-200 text-lg italic leading-relaxed">"{verseOfTheDay.text}"</p>
           <p className="text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mt-3">— {verseOfTheDay.ref}</p>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-7xl mx-auto w-full mt-6">
        <div className="mb-8 ml-2">
            <h2 className="text-sm md:text-base font-medium font-serif text-slate-600 dark:text-slate-300 mb-1 leading-tight">
              Welcome to KFM Counsel (King’s Family Marriage Counsel) an AI-powered marriage counseling chatbot
            </h2>
            <p className="text-lg md:text-xl text-slate-800 dark:text-slate-100 font-bold">
              How can we help you today?
            </p>
        </div>
        
        {/* Main Grid Layout - 2-3-1 Configuration on Desktop */}
        {/* md:grid-cols-2 creates a 2-column layout on tablets */}
        {/* lg:grid-cols-6 creates the 6-column grid for the 2-3-1 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">

          {/* --- ROW 1: 2 Items (Large) --- */}

          {/* 1. Counsel Chat */}
          <div 
            onClick={() => setView('chat')}
            className="lg:col-span-3 bg-blue-50 dark:bg-slate-800/80 rounded-[2rem] p-6 shadow-none hover:shadow-material-md transition-all cursor-pointer group flex flex-col h-full border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
          >
            <div className="flex justify-between items-start mb-4">
               <div className="w-14 h-14 bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                 <MessageCircle size={28} />
               </div>
               <div className="bg-white dark:bg-slate-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-blue-600 dark:text-blue-300" />
               </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-serif">Counsel Chat</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Speak with KFM Counsel for biblical advice and support.
            </p>
          </div>

          {/* 2. Relationship Check */}
          <div 
            onClick={() => setView('triage')}
            className="lg:col-span-3 bg-purple-50 dark:bg-slate-800/80 rounded-[2rem] p-6 shadow-none hover:shadow-material-md transition-all cursor-pointer group flex flex-col h-full border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 bg-purple-200 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <ClipboardList size={28} />
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-purple-600 dark:text-purple-300" />
               </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-serif">Relationship Check</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Take a quick assessment to see where your marriage stands.
            </p>
          </div>

          {/* --- ROW 2: 3 Items (Medium) --- */}

          {/* 3. Prayer Room */}
          <div 
            onClick={() => setView('prayer')}
            className="lg:col-span-2 bg-amber-50 dark:bg-slate-800/80 rounded-[2rem] p-6 shadow-none hover:shadow-material-md transition-all cursor-pointer group flex flex-col h-full border border-transparent hover:border-amber-200 dark:hover:border-amber-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 bg-amber-200 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <BookOpen size={28} />
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-amber-600 dark:text-amber-300" />
               </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-serif">Prayer Room</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive a personalized prayer and scripture anchor.
            </p>
          </div>

           {/* 4. Singles Prep */}
           <div 
            onClick={() => setView('singles')}
            className="lg:col-span-2 bg-teal-50 dark:bg-slate-800/80 rounded-[2rem] p-6 shadow-none hover:shadow-material-md transition-all cursor-pointer group flex flex-col h-full border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 bg-teal-200 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <User size={28} />
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-teal-600 dark:text-teal-300" />
               </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-serif">Singles Prep</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Check your spiritual and emotional readiness for marriage.
            </p>
          </div>

          {/* 5. My Journal - Placed here to complete the middle row of 3 */}
          {/* md:col-span-2 ensures it takes full width on tablet to avoid a gap before the Help card */}
          <div 
            onClick={() => setView('journal')}
            className="md:col-span-2 lg:col-span-2 bg-rose-50 dark:bg-slate-800/80 rounded-[2rem] p-6 shadow-none hover:shadow-material-md transition-all cursor-pointer group flex flex-col h-full border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
          >
            <div className="flex justify-between items-start mb-4">
               <div className="w-14 h-14 bg-rose-200 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                 <PenTool size={28} />
               </div>
               <div className="bg-white dark:bg-slate-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-rose-600 dark:text-rose-300" />
               </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-serif">My Journal</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Track your progress, answered prayers, and gratitude.
            </p>
          </div>

          {/* --- ROW 3: 1 Item (Full Width) --- */}

          {/* 6. Need Human Help - Stands alone */}
          <div 
             onClick={() => setView('counselor')}
             className="md:col-span-2 lg:col-span-6 bg-red-50 dark:bg-red-950/30 rounded-[2rem] p-6 shadow-none hover:shadow-material-md transition-all cursor-pointer relative overflow-hidden group border border-red-100 dark:border-red-900/50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-bl-full -mr-10 -mt-10 z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="w-16 h-16 bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <ShieldAlert size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 font-serif">Need Human Help?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  If you need to speak to a human counselor, we treat it as urgent, please click here.
                </p>
              </div>
              <div className="flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-md group-hover:bg-red-700 transition-colors">
                Get Help Now <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeView;
