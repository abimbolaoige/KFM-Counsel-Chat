
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Copy, ArrowLeft, PenTool, List, BookOpen, Users, Heart, MessageCircle, Plus, Send, ThumbsUp, Lock, CheckCircle2, X, Save } from 'lucide-react';
import { ViewProps } from '../types';
import { PRAYER_TOPICS } from '../constants';
import { generatePrayer } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import SecurityLock from './SecurityLock';
import { 
    subscribeToPrayerRequests, 
    subscribeToTestimonies, 
    addPrayerRequest, 
    addTestimony, 
    incrementPrayerCount,
    deletePrayerRequest
} from '../services/dataService';

interface PrayerResult {
  prayer: string;
  scripture: string;
}

interface HubRequest {
  id: string;
  userId?: string;
  text: string;
  prayedCount: number;
  timestamp: any;
  isAnonymous: boolean;
  authorName?: string;
}

interface Testimony {
  id: string;
  userId?: string;
  text: string;
  timestamp: any;
  authorName: string;
}

const PrayerModule: React.FC<ViewProps> = ({ setView }) => {
  const [mode, setMode] = useState<'topic' | 'custom' | 'hub'>('topic');
  const [customTopic, setCustomTopic] = useState('');
  const [generatedPrayer, setGeneratedPrayer] = useState<PrayerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, isFeaturesUnlocked } = useAuth();

  // Hub State
  const [hubSection, setHubSection] = useState<'requests' | 'testimonies'>('requests');
  const [requests, setRequests] = useState<HubRequest[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [newHubText, setNewHubText] = useState('');
  const [isSubmittingHub, setIsSubmittingHub] = useState(false);
  const [prayedIds, setPrayedIds] = useState<string[]>([]);

  // Load Hub Data Real-time
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to requests
    const unsubReq = subscribeToPrayerRequests((data) => {
        setRequests(data as HubRequest[]);
    });

    // Subscribe to testimonies
    const unsubTest = subscribeToTestimonies((data) => {
        setTestimonies(data as Testimony[]);
    });

    return () => {
        unsubReq();
        unsubTest();
    };
  }, [user]);

  const handleGenerate = async (topic: string) => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
        const result = await generatePrayer(topic);
        setGeneratedPrayer(result);
    } catch (e) {
        // Fallback handled in service
    }
    setLoading(false);
  };

  const submitHubItem = async () => {
      if (!newHubText.trim() || !user) return;

      try {
        if (hubSection === 'requests') {
            await addPrayerRequest({
                userId: user.id,
                text: newHubText.trim(),
                prayedCount: 0,
                timestamp: new Date(),
                isAnonymous: true,
                authorName: user.name ? user.name.split(' ')[0] : 'Anonymous'
            });
        } else {
            await addTestimony({
                userId: user.id,
                text: newHubText.trim(),
                timestamp: new Date(),
                authorName: user.name ? user.name.split(' ')[0] : 'Anonymous'
            });
        }
        setNewHubText('');
        setIsSubmittingHub(false);
      } catch (e) {
          console.error(e);
          alert("Failed to post. Please try again.");
      }
  };

  const handlePrayClick = async (req: HubRequest) => {
      if (prayedIds.includes(req.id)) return;
      
      setPrayedIds([...prayedIds, req.id]);
      try {
          await incrementPrayerCount(req.id, req.prayedCount);
      } catch (e) {
          console.error(e);
      }
  };

  // --- Answered Functionality ---
  const markAsAnswered = async (req: HubRequest) => {
    if (window.confirm("Mark this prayer as answered? It will be moved to the Testimonies section.")) {
      try {
          // Delete request
          await deletePrayerRequest(req.id);
          
          // Add testimony
          await addTestimony({
            userId: req.userId,
            text: `Answered Prayer: ${req.text}`,
            timestamp: new Date(),
            authorName: req.authorName || 'Anonymous'
          });
          
          setHubSection('testimonies');
      } catch (e) {
          console.error(e);
      }
    }
  };

  const reset = () => {
    setGeneratedPrayer(null);
    setCustomTopic('');
  };

  const formatDate = (ts: any) => {
      if (!ts) return '';
      // Firestore timestamp handling
      const date = ts.toDate ? ts.toDate() : new Date(ts);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  // --- AUTH RESTRICTION ---
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
         <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 relative">
             <BookOpen size={32} className="text-amber-600 dark:text-amber-400" />
             <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-sm border border-slate-100 dark:border-slate-700">
                <Lock size={16} className="text-slate-400" />
             </div>
         </div>
         <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 font-serif">Prayer Room Access</h2>
         <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs text-sm leading-relaxed">
             To join our prayer community, share requests, and receive personalized prayer support, please sign in.
         </p>
         <button 
            onClick={() => setView('auth')}
            className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-amber-700 transition-colors"
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
    <div className="p-6 max-w-lg mx-auto flex flex-col h-full">
       <button 
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 text-sm transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Sparkles size={28} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Prayer Room</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">"For where two or three gather in my name, there am I with them."</p>
      </div>

      {/* Mode Toggle */}
      {!generatedPrayer && (
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 transition-colors">
          <button 
            onClick={() => setMode('topic')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-full transition-all ${mode === 'topic' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <List size={16} /> Topics
          </button>
          <button 
            onClick={() => setMode('custom')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-full transition-all ${mode === 'custom' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <PenTool size={16} /> Custom
          </button>
          <button 
            onClick={() => setMode('hub')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold rounded-full transition-all ${mode === 'hub' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-700 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Users size={16} /> Hub
          </button>
        </div>
      )}

      {/* MODE: TOPICS */}
      {!generatedPrayer && !loading && mode === 'topic' && (
        <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-bottom-2">
          {PRAYER_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => handleGenerate(topic)}
              className="text-left px-6 py-5 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all text-slate-800 dark:text-slate-200 font-medium text-base flex justify-between items-center group shadow-sm active:scale-[0.98]"
            >
              Prayer for {topic}
              <Sparkles size={18} className="opacity-0 group-hover:opacity-100 text-amber-500 transition-opacity" />
            </button>
          ))}
        </div>
      )}

      {/* MODE: CUSTOM */}
      {!generatedPrayer && !loading && mode === 'custom' && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-2">
          <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-900/30 text-sm text-amber-900/80 dark:text-amber-100/80 leading-relaxed">
            Type here what is on your heart. Let us bring it before the Lord together.
          </div>
          <textarea
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="e.g., My husband and I are fighting about finances..."
            className="w-full h-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 text-base text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-400 outline-none resize-none transition-colors shadow-inner"
          />
          <button 
            onClick={() => handleGenerate(customTopic)}
            disabled={!customTopic.trim()}
            className="bg-amber-600 text-white py-4 rounded-full font-bold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] mt-2"
          >
            <Sparkles size={18} /> Generate Personal Prayer
          </button>
        </div>
      )}

      {/* MODE: PRAYER HUB */}
      {!generatedPrayer && !loading && mode === 'hub' && (
          <div className="flex flex-col h-full animate-in slide-in-from-bottom-2">
              {/* Hub Sub-Nav */}
              <div className="flex items-center gap-6 mb-6 border-b border-slate-100 dark:border-slate-800 pb-1">
                  <button 
                    onClick={() => { setHubSection('requests'); setIsSubmittingHub(false); }}
                    className={`pb-2 text-sm font-bold border-b-2 transition-colors ${hubSection === 'requests' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
                  >
                      Requests
                  </button>
                  <button 
                    onClick={() => { setHubSection('testimonies'); setIsSubmittingHub(false); }}
                    className={`pb-2 text-sm font-bold border-b-2 transition-colors ${hubSection === 'testimonies' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
                  >
                      Testimonies
                  </button>
              </div>

              {/* Content List */}
              <div className="flex-1 overflow-y-auto space-y-4 pb-20">
                  {isSubmittingHub ? (
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-amber-100 dark:border-slate-700 shadow-lg animate-in zoom-in-95">
                          <h3 className="font-serif font-bold text-slate-800 dark:text-slate-100 mb-3">
                              {hubSection === 'requests' ? 'Share a Prayer Request' : 'Share a Testimony'}
                          </h3>
                          <textarea 
                             autoFocus
                             value={newHubText}
                             onChange={e => setNewHubText(e.target.value)}
                             placeholder={hubSection === 'requests' ? "Describe your need (Anonymous)..." : "Share what God has done..."}
                             className="w-full h-32 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-amber-500 resize-none mb-3"
                          />
                          <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setIsSubmittingHub(false)}
                                className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium"
                              >
                                  Cancel
                              </button>
                              <button 
                                onClick={submitHubItem}
                                className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 shadow-sm"
                              >
                                  Post
                              </button>
                          </div>
                      </div>
                  ) : (
                      <button 
                        onClick={() => setIsSubmittingHub(true)}
                        className="w-full py-3 border-2 border-dashed border-amber-200 dark:border-slate-700 rounded-2xl text-amber-600 dark:text-slate-400 font-bold text-sm hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                      >
                          <Plus size={18} />
                          {hubSection === 'requests' ? 'Add Prayer Request' : 'Add Testimony'}
                      </button>
                  )}

                  {hubSection === 'requests' && requests.map((req) => (
                      <div key={req.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                          
                          <p className="text-slate-700 dark:text-slate-300 font-serif mb-3 leading-relaxed">{req.text}</p>

                          <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <span className="font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">Anonymous</span>
                                  <span>• {formatDate(req.timestamp)}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                  {/* Owner Actions */}
                                  {user && req.userId === user.id && (
                                      <>
                                        <button 
                                            onClick={() => markAsAnswered(req)}
                                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                                            title="Mark as Answered"
                                        >
                                            <CheckCircle2 size={16} />
                                        </button>
                                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                      </>
                                  )}

                                  <button 
                                    onClick={() => handlePrayClick(req)}
                                    disabled={prayedIds.includes(req.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95
                                    ${prayedIds.includes(req.id) 
                                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 cursor-default' 
                                        : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-slate-700'}`}
                                  >
                                      <Heart size={14} className={prayedIds.includes(req.id) ? 'fill-current' : ''} />
                                      {req.prayedCount} Prayed
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}

                  {hubSection === 'testimonies' && testimonies.map((t) => (
                      <div key={t.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="flex gap-3">
                              <div className="flex-shrink-0 mt-1">
                                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center">
                                      <ThumbsUp size={14} />
                                  </div>
                              </div>
                              <div>
                                  <p className="text-slate-700 dark:text-slate-300 font-serif mb-2 leading-relaxed">"{t.text}"</p>
                                  <p className="text-xs text-slate-400 font-medium">— {t.authorName} • {formatDate(t.timestamp)}</p>
                              </div>
                          </div>
                      </div>
                  ))}
                  
                  {hubSection === 'requests' && requests.length === 0 && !isSubmittingHub && (
                      <div className="text-center py-10 text-slate-400 text-sm">No requests yet. Be the first to share.</div>
                  )}
                  {hubSection === 'testimonies' && testimonies.length === 0 && !isSubmittingHub && (
                      <div className="text-center py-10 text-slate-400 text-sm">No testimonies yet. Share your story!</div>
                  )}
              </div>
          </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-amber-600 dark:text-amber-400">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-md mb-4">
            <Loader2 className="animate-spin" size={32} />
          </div>
          <span className="text-base font-medium animate-pulse">Composing your prayer...</span>
        </div>
      )}

      {/* Result State (Generator) */}
      {generatedPrayer && !loading && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-[2rem] border border-amber-100 dark:border-amber-900/40 shadow-sm relative transition-colors">
            <h3 className="font-serif font-bold text-amber-900 dark:text-amber-100 mb-4 text-xl text-center">Your Prayer</h3>
            <p className="text-slate-800 dark:text-slate-200 leading-loose font-serif italic text-lg mb-8 text-center">
              "{generatedPrayer.prayer}"
            </p>
            
            <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <BookOpen size={16} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Scripture Anchor</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-base font-medium">
                    {generatedPrayer.scripture}
                </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={reset}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-4 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              New Prayer
            </button>
             <button 
              onClick={() => {
                navigator.clipboard.writeText(`${generatedPrayer.prayer}\n\n${generatedPrayer.scripture}`);
                alert("Prayer copied to clipboard");
              }}
              className="flex items-center justify-center gap-2 px-8 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full font-bold hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors shadow-sm"
            >
              <Copy size={20} />
              <span className="hidden sm:inline">Copy</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerModule;
