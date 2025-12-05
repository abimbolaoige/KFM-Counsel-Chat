
import React, { useState, useEffect } from 'react';
import { Book, Plus, Trash2, ArrowLeft, Calendar, PenTool, CheckCircle2, Lock } from 'lucide-react';
import { ViewProps, JournalEntry } from '../types';
import { useAuth } from '../contexts/AuthContext';
import SecurityLock from './SecurityLock';
import { subscribeToJournal, addJournalEntry, deleteJournalEntry } from '../services/dataService';

const JournalView: React.FC<ViewProps> = ({ setView }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntryText, setNewEntryText] = useState('');
  const [category, setCategory] = useState<'prayer' | 'progress' | 'gratitude'>('progress');
  const [isAdding, setIsAdding] = useState(false);
  const { user, isFeaturesUnlocked } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToJournal(user.id, (fetchedEntries) => {
        setEntries(fetchedEntries);
    });

    return () => unsubscribe();
  }, [user]);

  const addEntry = async () => {
    if (!newEntryText.trim() || !user) return;

    try {
        await addJournalEntry(user.id, {
            date: Date.now(),
            text: newEntryText.trim(),
            category
        });
        setNewEntryText('');
        setIsAdding(false);
    } catch (e) {
        console.error("Error adding entry", e);
        alert("Failed to save entry. Check connection.");
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    if (window.confirm('Delete this entry?')) {
        try {
            await deleteJournalEntry(user.id, id);
        } catch (e) {
            console.error("Error deleting", e);
        }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'prayer': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'gratitude': return 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800';
      default: return 'bg-brand-100 text-brand-700 border-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800';
    }
  };

  if (!user) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
             <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-6 relative">
                 <Book size={32} className="text-brand-600 dark:text-brand-400" />
                 <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Lock size={16} className="text-slate-400" />
                 </div>
             </div>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 font-serif">Journal Restricted</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs text-sm leading-relaxed">
                 Your reflections are private and personal. Please sign in to access your secure journaling space.
             </p>
             <button 
                onClick={() => setView('auth')}
                className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-brand-700 transition-colors"
             >
                 Login or Sign Up
             </button>
             <button 
                onClick={() => setView('home')}
                className="mt-6 text-slate-400 text-sm font-medium hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
             >
                 Go Back
             </button>
        </div>
      );
  }

  // --- FEATURE LOCK ---
  if (!isFeaturesUnlocked) {
      return <SecurityLock onUnlock={() => {}} onBack={() => setView('home')} />;
  }

  return (
    <div className="flex flex-col h-full bg-surface-light dark:bg-surface-dark transition-colors duration-200 relative">
       <div className="p-6 pb-2">
            <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4 text-sm transition-colors font-medium"
            >
                <ArrowLeft size={18} /> Back
            </button>
            
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">My Journal</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Track your journey, prayers, and growth.</p>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="bg-brand-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-md hover:bg-brand-700 transition-transform active:scale-95"
                    >
                        <Plus size={18} /> New Entry
                    </button>
                )}
            </div>
       </div>

       {/* Add Entry Form */}
       {isAdding && (
           <div className="px-6 mb-6 animate-in slide-in-from-top-4">
               <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-brand-100 dark:border-slate-700 shadow-lg">
                   <div className="flex gap-2 mb-3">
                       {['progress', 'prayer', 'gratitude'].map((c) => (
                           <button
                               key={c}
                               onClick={() => setCategory(c as any)}
                               className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors
                               ${category === c 
                                ? getCategoryColor(c) 
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}
                           >
                               {c}
                           </button>
                       ))}
                   </div>
                   <textarea
                        autoFocus
                        value={newEntryText}
                        onChange={(e) => setNewEntryText(e.target.value)}
                        placeholder="What is on your heart today?"
                        className="w-full h-32 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-brand-500 resize-none mb-3"
                   />
                   <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => setIsAdding(false)}
                        className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium"
                       >
                           Cancel
                       </button>
                       <button 
                        onClick={addEntry}
                        className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-sm"
                       >
                           Save Entry
                       </button>
                   </div>
               </div>
           </div>
       )}

       {/* List */}
       <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
           {entries.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                   <Book size={48} className="mb-4 opacity-50" />
                   <p className="text-sm font-medium">No journal entries yet.</p>
                   <button onClick={() => setIsAdding(true)} className="text-brand-600 dark:text-brand-400 font-bold mt-2 text-sm hover:underline">Start writing</button>
               </div>
           ) : (
               entries.map(entry => (
                   <div key={entry.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:shadow-md transition-all">
                       <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-2">
                               <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(entry.category)}`}>
                                   {entry.category}
                               </span>
                               <span className="text-xs text-slate-400 flex items-center gap-1">
                                   <Calendar size={12} />
                                   {formatDate(entry.date)}
                               </span>
                           </div>
                           <button 
                            onClick={() => deleteEntry(entry.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                           >
                               <Trash2 size={16} />
                           </button>
                       </div>
                       <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-serif text-base">
                           {entry.text}
                       </p>
                   </div>
               ))
           )}
       </div>
    </div>
  );
};

export default JournalView;
