
import React, { useState, useEffect } from 'react';
import { Shield, FileText, X } from 'lucide-react';

interface LegalConsentProps {
  initialTab: 'terms' | 'privacy';
  onClose: () => void;
}

const LegalConsent: React.FC<LegalConsentProps> = ({ initialTab, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center shadow-sm">
               <Shield size={20} />
             </div>
             <div>
               <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">Legal Information</h2>
               <p className="text-xs text-slate-500 dark:text-slate-400">Review our policies and terms</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border-b-2
              ${activeTab === 'terms' 
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-800' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <FileText size={14} /> Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border-b-2
              ${activeTab === 'privacy' 
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-800' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Shield size={14} /> Privacy Policy
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed scrollbar-thin">
          {activeTab === 'terms' ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">KFM Counsel — Terms of Service</h3>
              <p className="text-xs text-slate-500">Last Updated: November, 2025</p>
              
              <p>Welcome to KFM Counsel. By using our platform, you agree to these Terms of Service. Please read them carefully.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">1. About KFM Counsel</h4>
              <p>KFM Counsel is a Christian AI-powered marriage counseling and relationship guidance platform providing AI-assisted biblical guidance, emotional support, relationship assessments, and spiritual encouragement. <strong>KFM Counsel is not a substitute for licensed medical, legal, or psychological care.</strong></p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">2. Acceptance of Terms</h4>
              <p>By accessing or using KFM Counsel, you acknowledge that you are at least 18 years old, have read and understood these terms, and consent to our use of your data as explained in the Privacy Policy. If you disagree, do not use the service.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">3. Use of the Platform</h4>
              <p>You agree to use the service respectfully and provide truthful information. You may not use the platform for illegal activity, harassment, or to impersonate others.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">4. Nature of Guidance</h4>
              <p>KFM Counsel provides scripture-based support and emotionally safe recommendations. We do NOT provide professional therapy, medical diagnosis, or legal services. All guidance is for informational and spiritual purposes only.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">5. Safety and Crisis Situations</h4>
              <p>If the system detects signs of abuse, violence, self-harm, or imminent danger, the AI may pause the conversation and provide safety instructions. <strong>KFM Counsel is not an emergency service.</strong> If you are in immediate danger, contact local authorities or emergency services.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">6. Accounts & Access</h4>
              <p>You agree to keep your login details confidential and take responsibility for activity under your account.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">7. Counselor Escalation</h4>
              <p>If you request human assistance, your information may be shared with approved Christian counselors solely for your safety and support.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">8. Limitation of Liability</h4>
              <p>KFM Counsel is provided “as is.” We are not liable for decisions made based on AI guidance or technical issues.</p>
              
              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">9. Contact</h4>
              <p>Email: kfparkroyals@gmail.com | Website: www.kfpark.com</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">KFM Counsel — Privacy Policy</h3>
              <p className="text-xs text-slate-500">Last Updated: November, 2025</p>
              
              <p>KFM Counsel (“we,” “us,” or “our”) is committed to protecting the privacy, confidentiality, and dignity of every user who seeks support on our platform.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">1. Information We Collect</h4>
              <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Provided:</strong> Name (optional), email/phone (if creating account), chat messages, assessment responses, prayer requests.</li>
                  <li><strong>Automatic:</strong> Device info, log data, usage patterns.</li>
              </ul>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">2. How We Use Your Information</h4>
              <p>We use your data to provide AI counseling, improve conversation quality, ensure safety, and connect you to human counselors when requested. We never sell your data.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">3. How We Protect Your Information</h4>
              <p>We implement encrypted data transmission (SSL/HTTPS), secure storage, and access controls. However, no system is 100% secure.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">4. Data Sharing</h4>
              <p>We may share info with Christian counselors (upon request/danger), service providers (hosting), or for legal compliance. We do NOT share data for advertising.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">5. Data Retention</h4>
              <p>We retain chat logs for improvement/safety and account info until deletion. You can request deletion at any time.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">6. Children’s Privacy</h4>
              <p>KFM Counsel is intended for users 18 and older.</p>

              <h4 className="font-bold text-slate-900 dark:text-slate-200 mt-4">7. Contact Us</h4>
              <p>Email: kfparkroyals@gmail.com | Website: www.kfpark.com</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
            <button 
                onClick={onClose}
                className="bg-brand-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-brand-700 transition-all active:scale-[0.98]"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default LegalConsent;
