
import React from 'react';
import { Heart, Menu, Home, Phone, FileText, BookOpen, UserCircle, Sun, Moon, PenTool, LogIn, LogOut } from 'lucide-react';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  triggerSafety: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, triggerSafety, isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();

  // List for Mobile Menu
  const navItems: { view: ViewState; label: string; icon: React.ElementType }[] = [
    { view: 'home', label: 'Home', icon: Home },
    { view: 'chat', label: 'Counsel Chat', icon: Heart },
    { view: 'triage', label: 'Check-In', icon: FileText },
    { view: 'singles', label: 'Singles', icon: UserCircle },
    { view: 'prayer', label: 'Prayer', icon: BookOpen },
    { view: 'journal', label: 'My Journal', icon: PenTool },
    { view: 'profile', label: 'My Profile', icon: UserCircle },
    { view: 'counselor', label: 'Human Help', icon: Phone },
  ];

  // Explicit list for Desktop Header
  const desktopNavItems: { view: ViewState; label: string; icon: React.ElementType }[] = [
    { view: 'home', label: 'Home', icon: Home },
    { view: 'chat', label: 'Counsel Chat', icon: Heart },
    { view: 'journal', label: 'Journal', icon: PenTool },
  ];

  const handleLogout = () => {
      logout();
      setView('home');
      setIsOpen(false);
  };

  return (
    <nav className="bg-surface-light dark:bg-surface-dark sticky top-0 z-50 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('home')}
          >
            {/* Replaced CSS Icon with Logo Image */}
            <div className="relative w-12 h-12 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="KFM Logo" 
                  className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="bg-brand-600 rounded-xl w-10 h-10 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.28 3.6-2.34 4.63-2.26 1.03.08 1.93.92 2.18 1.93.83 3.39-3.46 8.28-11.81 12.28L12 28.05l-2-2.1C1.54 21.92-2.75 17.03-1.92 13.64c.25-1.01 1.15-1.85 2.18-1.93 1.03-.08 3.14.98 4.63 2.26l1.11 1.13 1.11-1.13z"/></svg></div>';
                  }}
                />
            </div>
            <div className="flex flex-col justify-center">
                <h1 className="font-serif font-extrabold text-2xl text-slate-800 dark:text-slate-100 leading-none tracking-tight">
                    KFM
                </h1>
                <span className="font-sans text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] leading-tight">
                    Counsel
                </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
             {/* User Welcome (Desktop) */}
             {user && (
                 <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                     <UserCircle size={16} className="text-slate-500" />
                     <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Hi, {user.name.split(' ')[0]}</span>
                 </div>
             )}

            <button 
               onClick={triggerSafety}
               className="hidden sm:block mr-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors shadow-sm active:scale-95"
            >
              SOS
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
            </button>
            
            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-2 ml-2">
                {desktopNavItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => setView(item.view)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
                        ${currentView === item.view 
                            ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
                
                {/* Login/Logout Desktop */}
                {user ? (
                    <button 
                        onClick={handleLogout}
                        className="ml-2 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                ) : (
                    <button
                        onClick={() => setView('auth')}
                        className="ml-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-colors"
                    >
                        Login
                    </button>
                )}
            </div>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full focus:outline-none md:hidden active:bg-slate-200 dark:active:bg-slate-700"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-surface-light dark:bg-surface-dark shadow-material-lg border-b border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200 md:hidden rounded-b-3xl overflow-hidden z-50">
          <div className="flex flex-col p-4 gap-1">
            {user && (
                <div className="px-5 py-2 mb-2 flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600">
                        <UserCircle size={16} />
                    </div>
                    <span className="font-medium">Signed in as <strong>{user.name}</strong></span>
                </div>
            )}

             {/* SOS Mobile Only in menu */}
             <button 
               onClick={() => { triggerSafety(); setIsOpen(false); }}
               className="w-full flex items-center gap-4 px-5 py-4 text-left text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-full sm:hidden mb-2"
             >
               <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded">SOS</span>
               Emergency Help
             </button>

            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setView(item.view);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left text-sm font-medium transition-colors rounded-full
                  ${currentView === item.view 
                    ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
            
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

            {user ? (
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            ) : (
                <button
                    onClick={() => { setView('auth'); setIsOpen(false); }}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left text-sm font-bold text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-full transition-colors"
                >
                    <LogIn size={20} />
                    Login / Sign Up
                </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
