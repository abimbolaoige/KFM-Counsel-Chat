
import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';

interface SecurityLockProps {
  onUnlock: () => void;
  onBack: () => void;
}

const SecurityLock: React.FC<SecurityLockProps> = ({ onUnlock, onBack }) => {
  const { user, unlockFeatures } = useAuth();
  const [pin, setPin] = useState('');
  const [mode, setMode] = useState<'enter' | 'setup'>('enter');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [storedPin, setStoredPin] = useState<string | null>(null);

  const profileKey = user ? `kfm_profile_${user.id}` : '';

  useEffect(() => {
    if (profileKey) {
      const saved = localStorage.getItem(profileKey);
      if (saved) {
        try {
          const profile: UserProfile = JSON.parse(saved);
          if (profile.accessPin) {
            setStoredPin(profile.accessPin);
            setMode('enter');
          } else {
            setMode('setup');
          }
        } catch (e) {
          setMode('setup');
        }
      } else {
        setMode('setup');
      }
    }
  }, [profileKey]);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleSubmit = () => {
    if (pin.length !== 4) return;

    if (mode === 'enter') {
      if (pin === storedPin) {
        unlockFeatures();
        onUnlock();
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    } else if (mode === 'setup') {
      if (!confirmPin) {
        setConfirmPin(pin);
        setPin('');
      } else {
        if (pin === confirmPin) {
          // Save PIN
          const saved = localStorage.getItem(profileKey);
          const profile: UserProfile = saved ? JSON.parse(saved) : { name: '', spouseName: '', triageHistory: [] };
          profile.accessPin = pin;
          localStorage.setItem(profileKey, JSON.stringify(profile));
          unlockFeatures();
          onUnlock();
        } else {
          setError('PINs do not match. Try again.');
          setPin('');
          setConfirmPin('');
        }
      }
    }
  };

  useEffect(() => {
    if (pin.length === 4 && mode === 'enter') {
      handleSubmit();
    }
    // For setup, we wait for explicit step 2 or auto-advance if implemented, but simple submit for now
    if (pin.length === 4 && mode === 'setup' && confirmPin) {
        handleSubmit();
    }
  }, [pin]);

  const handleSetupNext = () => {
      if (pin.length === 4) {
          setConfirmPin(pin);
          setPin('');
      }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-surface-light dark:bg-surface-dark">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl p-8 border border-slate-100 dark:border-slate-700 text-center">
        
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto mb-6">
          {mode === 'setup' ? <ShieldCheck size={32} /> : <Lock size={32} />}
        </div>

        <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-2">
          {mode === 'setup' 
            ? (confirmPin ? "Confirm PIN" : "Set Access PIN") 
            : "Enter Access PIN"}
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          {mode === 'setup'
            ? "Secure your journal and prayer room."
            : "Enter your 4-digit security PIN."}
        </p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length 
                  ? 'bg-brand-600 dark:bg-brand-500 scale-110' 
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm font-bold mb-6 animate-bounce">{error}</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handlePinInput(num.toString())}
              className="h-14 rounded-xl bg-slate-50 dark:bg-slate-900 text-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
            >
              {num}
            </button>
          ))}
          <div className="h-14"></div>
          <button
            onClick={() => handlePinInput('0')}
            className="h-14 rounded-xl bg-slate-50 dark:bg-slate-900 text-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Delete
          </button>
        </div>

        {mode === 'setup' && !confirmPin && (
            <button 
                onClick={handleSetupNext}
                disabled={pin.length !== 4}
                className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-brand-700 disabled:opacity-50 transition-all mb-4"
            >
                Next
            </button>
        )}

        <button onClick={onBack} className="text-slate-400 text-sm font-medium hover:text-slate-600 dark:hover:text-slate-300">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default SecurityLock;
