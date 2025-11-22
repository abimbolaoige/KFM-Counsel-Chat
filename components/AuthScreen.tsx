
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ViewProps } from '../types';
import { Mail, Lock, User, ArrowRight, Loader2, Heart } from 'lucide-react';

const AuthScreen: React.FC<ViewProps> = ({ setView, showLegal }) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            if (!name.trim()) {
                setError("Name is required");
                setLoading(false);
                return;
            }
            result = await signup(email, password, name);
        }

        if (result.success) {
            setView('home');
        } else {
            setError(result.message);
        }
    } catch (e) {
        setError("An unexpected error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2rem] shadow-material-lg p-8 border border-slate-100 dark:border-slate-700">
            <div className="flex justify-center mb-6">
                 <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center shadow-sm">
                    <Heart size={32} />
                 </div>
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-center text-slate-900 dark:text-slate-100 mb-2">
                {isLogin ? 'Welcome Back' : 'Join KFM Counsel'}
            </h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm">
                {isLogin ? 'Sign in to access your personal journey.' : 'Create an account for continuity and support.'}
            </p>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center mb-6 font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                     <div className="relative">
                        <User className="absolute left-4 top-4 text-slate-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                        />
                    </div>
                )}
                
                <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input 
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input 
                        type="password"
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-600 text-white font-bold py-4 rounded-full shadow-md hover:bg-brand-700 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} /></>}
                </button>
            </form>

             <div className="mt-4 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Before using this app, you can review our{' '}
                    <button onClick={() => showLegal('privacy')} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">Privacy Policy</button>
                    {' '}and{' '}
                    <button onClick={() => showLegal('terms')} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">Terms of Service</button>.
                </p>
            </div>

            <div className="mt-6 text-center pt-4 border-t border-slate-100 dark:border-slate-700">
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-brand-600 dark:text-brand-400 font-semibold text-sm hover:underline block w-full mb-2"
                >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
                
                 <button onClick={() => setView('home')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs">
                    Continue as Guest (Progress will not be saved)
                 </button>
            </div>
        </div>
    </div>
  );
};

export default AuthScreen;
