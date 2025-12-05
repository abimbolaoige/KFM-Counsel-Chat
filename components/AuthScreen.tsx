
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ViewProps } from '../types';
import { Mail, Lock, User, ArrowRight, Loader2, Heart, CheckCircle2 } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';

const AuthScreen: React.FC<ViewProps> = ({ setView, showLegal }) => {
  const { login, signup, requestPasswordReset } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Terms Checkbox State for Signup
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
        const result = await login(email, password);
        if (result.success) {
            setView('home');
        } else {
            setError(result.message);
        }
    } catch (e) { 
        console.error(e);
        setError("Login failed. Check console for details."); 
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
        setError("Please accept the Terms and Privacy Policy.");
        return;
    }
    setLoading(true); setError('');
    if (!name.trim()) { setError("Name is required"); setLoading(false); return; }
    try {
        const result = await signup(email, password, name);
        if (result.success) {
            setView('home');
        } else {
            setError(result.message);
        }
    } catch (e) { 
        console.error(e);
        setError("Signup failed. Check console for details."); 
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true); setError('');
      try {
          const result = await requestPasswordReset(email);
          if (result.success) {
              setSuccessMsg(`Reset link sent to ${email}. Check your inbox (and spam).`);
              setMode('login');
          } else {
              setError(result.message);
          }
      } catch (e) { 
          console.error(e);
          setError("Request failed."); 
      }
      setLoading(false);
  };

  const renderForm = () => {
      switch (mode) {
          case 'login':
              return (
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div className="relative">
                          <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                          <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors" />
                      </div>
                      <div className="relative">
                          <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors" />
                      </div>
                      <div className="flex justify-end">
                          <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }} className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">Forgot Password?</button>
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-brand-600 text-white font-bold py-4 rounded-full shadow-md hover:bg-brand-700 transition-all mt-2 flex items-center justify-center gap-2">
                          {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
                      </button>
                  </form>
              );
          case 'signup':
              return (
                  <form onSubmit={handleSignup} className="space-y-4">
                      <div className="relative">
                          <User className="absolute left-4 top-4 text-slate-400" size={20} />
                          <input type="text" required placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors" />
                      </div>
                      <div className="relative">
                          <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                          <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors" />
                      </div>
                      <div className="relative">
                          <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors" />
                      </div>

                      {/* Terms Acceptance Checkbox */}
                      <div className="flex items-start gap-2.5 my-2">
                          <input 
                              type="checkbox" 
                              required
                              id="signup-terms"
                              checked={termsAccepted}
                              onChange={e => setTermsAccepted(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                          <label htmlFor="signup-terms" className="text-xs text-slate-500 dark:text-slate-400 leading-tight cursor-pointer">
                              By continuing, you agree to our{' '}
                              <button type="button" onClick={() => showLegal('terms')} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">Terms</button>
                              {' '}and{' '}
                              <button type="button" onClick={() => showLegal('privacy')} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">Privacy Policy</button>.
                          </label>
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading || !termsAccepted} 
                        className="w-full bg-brand-600 text-white font-bold py-4 rounded-full shadow-md hover:bg-brand-700 transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
                      </button>
                  </form>
              );
          case 'forgot':
              return (
                  <form onSubmit={handleForgot} className="space-y-4">
                      <p className="text-center text-sm text-slate-600 dark:text-slate-300 mb-2">Enter your email to receive a password reset link.</p>
                      <div className="relative">
                          <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                          <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors" />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-brand-600 text-white font-bold py-4 rounded-full shadow-md hover:bg-brand-700 transition-all mt-2 flex items-center justify-center gap-2">
                          {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send Reset Link <ArrowRight size={18} /></>}
                      </button>
                      <button type="button" onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }} className="w-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium py-2">Back to Login</button>
                  </form>
              );
      }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2rem] shadow-material-lg p-8 border border-slate-100 dark:border-slate-700">
            <div className="flex justify-center mb-6">
                 <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center shadow-sm">
                    <Heart size={32} />
                 </div>
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-center text-slate-900 dark:text-slate-100 mb-2 capitalize">
                {mode === 'login' ? 'Welcome Back' : mode}
            </h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6 text-sm">
                {mode === 'login' && 'Sign in to access your personal journey.'}
                {mode === 'signup' && 'Create an account for continuity and support.'}
                {mode === 'forgot' && 'Recover access to your account.'}
            </p>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center mb-6 font-medium animate-pulse">
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-xl text-sm text-center mb-6 font-medium animate-in fade-in">
                    {successMsg}
                </div>
            )}

            {renderForm()}

            {(mode === 'login' || mode === 'signup') && (
                <div className="mt-4 text-center pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button 
                        onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login');
                            setError('');
                            setSuccessMsg('');
                            setTermsAccepted(false); // Reset terms on toggle
                        }}
                        className="text-brand-600 dark:text-brand-400 font-semibold text-sm hover:underline block w-full mb-2"
                    >
                        {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                    
                     <button onClick={() => setView('home')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs">
                        Continue as Guest (Progress will not be saved)
                     </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default AuthScreen;
