
import React, { useState } from 'react';
import { Send, ArrowLeft, CheckCircle, ShieldAlert, Lock } from 'lucide-react';
import { ViewProps } from '../types';
import { useAuth } from '../contexts/AuthContext';

const EscalationForm: React.FC<ViewProps> = ({ setView }) => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    urgency: 'low',
    description: ''
  });

  if (!user) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
             <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 relative">
                 <ShieldAlert size={32} className="text-red-600 dark:text-red-400" />
                 <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Lock size={16} className="text-slate-400" />
                 </div>
             </div>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 font-serif">Counselor Access Restricted</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs text-sm leading-relaxed">
                 To connect with our human counseling team for personalized support and safety follow-up, please sign in.
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in zoom-in-95">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-material-md">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-3">Request Received</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg max-w-xs mx-auto">
          A counselor will review your request and contact you at <strong>{formData.contact}</strong> shortly.
        </p>
        <button 
          onClick={() => setView('home')}
          className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-brand-700 transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <button 
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 text-sm transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">Speak to a Counselor</h2>
      <p className="text-base text-slate-600 dark:text-slate-400 mb-8 transition-colors">Confidential support for your marital journey.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
            <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 ml-1">Your Name</label>
            <input 
                required
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-base text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="John & Jane Doe"
            />
            </div>

            <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 ml-1">Phone or Email</label>
            <input 
                required
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-base text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                value={formData.contact}
                onChange={e => setFormData({...formData, contact: e.target.value})}
                placeholder="email@example.com"
            />
            </div>

            <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 ml-1">Urgency Level</label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setFormData({...formData, urgency: 'low'})}
                    className={`p-4 rounded-xl text-sm font-bold border transition-all active:scale-95
                    ${formData.urgency === 'low' 
                        ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 dark:border-brand-400 text-brand-700 dark:text-brand-300 shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    Standard
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({...formData, urgency: 'high'})}
                    className={`p-4 rounded-xl text-sm font-bold border transition-all active:scale-95
                    ${formData.urgency === 'high' 
                        ? 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    Urgent
                </button>
            </div>
            </div>

            <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 ml-1">Brief Description</label>
            <textarea 
                required
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-base text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none resize-none transition-colors"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly share what you are struggling with..."
            />
            </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-brand-600 dark:bg-brand-600 text-white font-bold py-4 rounded-full shadow-material-md hover:bg-brand-700 dark:hover:bg-brand-500 transition-transform active:scale-[0.99] flex items-center justify-center gap-2 text-lg"
        >
          <Send size={20} /> Submit Request
        </button>
      </form>
    </div>
  );
};

export default EscalationForm;
