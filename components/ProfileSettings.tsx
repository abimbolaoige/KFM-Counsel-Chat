
import React, { useState, useEffect } from 'react';
import { Save, UserCircle, ArrowLeft, Heart, Activity, Lock, KeyRound } from 'lucide-react';
import { ViewProps, UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, saveUserProfile } from '../services/dataService';

const ProfileSettings: React.FC<ViewProps> = ({ setView }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    spouseName: '',
    anniversary: '',
    triageHistory: [],
    accessPin: ''
  });
  const [saved, setSaved] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserProfile(user.id);
            if (data) {
                setProfile(data);
            }
        } catch (e) {
            console.error("Profile Load Error", e);
        }
        setLoading(false);
    };
    loadData();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const updatedProfile = { ...profile };
    
    if (newPin.length === 4) {
        updatedProfile.accessPin = newPin;
    }

    try {
        await saveUserProfile(user.id, updatedProfile);
        setProfile(updatedProfile);
        setNewPin('');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    } catch (e) {
        alert("Failed to save profile. Check connection.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 h-full flex flex-col overflow-y-auto">
      <button 
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 text-sm transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm relative">
          <UserCircle size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
            Your Profile
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            {user ? `Logged in as ${user.email}` : 'Guest Mode'}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-5">
            <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 ml-1">Your Name (First Name)</label>
            <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-base text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                placeholder="e.g. Michael"
            />
            </div>

            <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 ml-1">Spouse's Name</label>
            <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-base text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                value={profile.spouseName}
                onChange={e => setProfile({...profile, spouseName: e.target.value})}
                placeholder="e.g. Sarah"
            />
            </div>

            <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 ml-1">Anniversary (Optional)</label>
            <input 
                type="date" 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-base text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-brand-500 outline-none transition-colors"
                value={profile.anniversary}
                onChange={e => setProfile({...profile, anniversary: e.target.value})}
            />
            </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-6">
            <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100 font-bold">
                <Lock size={20} className="text-slate-600 dark:text-slate-400" />
                <h3>Security & Privacy</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">Set a 4-digit PIN to secure your Journal and Prayer Room.</p>
            
            <div className="relative">
                <KeyRound className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                    type="password" 
                    maxLength={4}
                    pattern="\d*"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-colors tracking-widest"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={profile.accessPin ? "Change Existing PIN" : "Create New PIN"}
                />
            </div>
        </div>

        {/* Case Tracking / History */}
        {profile.triageHistory && profile.triageHistory.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-6">
                <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100 font-bold">
                    <Activity size={20} className="text-brand-600" />
                    <h3>Progress Tracking</h3>
                </div>
                <div className="space-y-3">
                    {profile.triageHistory.slice(-3).reverse().map((record, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-700 pb-2 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium text-slate-700 dark:text-slate-300">{record.summary}</p>
                                <p className="text-xs text-slate-400">{new Date(record.date).toLocaleDateString()}</p>
                            </div>
                            <div className={`px-2 py-1 rounded font-bold ${record.score >= 80 ? 'bg-green-100 text-green-700' : record.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                {record.score}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="bg-brand-50 dark:bg-brand-900/20 p-5 rounded-2xl border border-brand-100 dark:border-brand-900/30 flex items-start gap-4">
            <Heart size={24} className="text-brand-500 dark:text-brand-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-brand-900 dark:text-brand-200 leading-relaxed">
                <strong>Note:</strong> Your profile data is synced securely to the cloud.
            </p>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-full shadow-md font-bold transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]
            ${saved ? 'bg-green-600 text-white' : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600'}`}
        >
          {saved ? 'Saved Successfully!' : loading ? 'Saving...' : <><Save size={20} /> Save Profile</>}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
