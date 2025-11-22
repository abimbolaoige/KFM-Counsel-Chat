
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFeaturesUnlocked: boolean;
  unlockFeatures: () => void;
  lockFeatures: () => void;
  login: (email: string, pass: string) => Promise<{success: boolean, message: string, requiresVerification?: boolean}>;
  signup: (email: string, pass: string, name: string) => Promise<{success: boolean, message: string}>;
  verifyAccount: (email: string, code: string) => Promise<{success: boolean, message: string}>;
  requestPasswordReset: (email: string) => Promise<{success: boolean, message: string}>;
  confirmPasswordReset: (email: string, code: string, newPass: string) => Promise<{success: boolean, message: string}>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for simulated DB
const USERS_DB_KEY = 'kfm_users_db';
const SESSION_KEY = 'kfm_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeaturesUnlocked, setIsFeaturesUnlocked] = useState(false);

  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        setUser(JSON.parse(storedSession));
      } catch (e) {
        console.error("Session parse error");
      }
    }
    setIsLoading(false);
  }, []);

  const getUsersDB = () => {
    const dbStr = localStorage.getItem(USERS_DB_KEY);
    return dbStr ? JSON.parse(dbStr) : [];
  };

  const saveUsersDB = (db: any[]) => {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  };

  const unlockFeatures = () => setIsFeaturesUnlocked(true);
  const lockFeatures = () => setIsFeaturesUnlocked(false);

  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

    const db = getUsersDB();
    const found = db.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

    if (found) {
        // Removed verification check to allow immediate login
        const userObj: User = { id: found.id, name: found.name, email: found.email };
        setUser(userObj);
        localStorage.setItem(SESSION_KEY, JSON.stringify(userObj));
        setIsLoading(false);
        return { success: true, message: 'Login successful' };
    } else {
        setIsLoading(false);
        return { success: false, message: 'Invalid email or password' };
    }
  };

  const signup = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const db = getUsersDB();
    if (db.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        setIsLoading(false);
        return { success: false, message: 'Email already registered' };
    }

    // Removed verification code generation
    const newUser = {
        id: 'user_' + Date.now(),
        email,
        password: pass,
        name,
        isVerified: true // Auto-verify
    };
    
    db.push(newUser);
    saveUsersDB(db);

    // Auto Login after Signup
    const userObj: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userObj);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userObj));
    
    setIsLoading(false);
    return { success: true, message: 'Account created successfully.' };
  };

  const verifyAccount = async (email: string, code: string) => {
      // Deprecated function kept for interface compatibility
      return { success: true, message: 'Account verified.' };
  };

  const requestPasswordReset = async (email: string) => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      const db = getUsersDB();
      const index = db.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (index !== -1) {
          const resetCode = generateCode();
          db[index].resetCode = resetCode;
          saveUsersDB(db);
          
          // SIMULATION EMAIL for Reset Password Only
          alert(`[SIMULATION] Password Reset Code for ${email}: ${resetCode}`);
          
          setIsLoading(false);
          return { success: true, message: 'Reset code sent to email.' };
      }
      
      setIsLoading(false);
      return { success: false, message: 'Email not found.' };
  };

  const confirmPasswordReset = async (email: string, code: string, newPass: string) => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      const db = getUsersDB();
      const index = db.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (index !== -1) {
          if (db[index].resetCode === code) {
              db[index].password = newPass;
              delete db[index].resetCode;
              saveUsersDB(db);
              setIsLoading(false);
              return { success: true, message: 'Password updated successfully. Please login.' };
          } else {
              setIsLoading(false);
              return { success: false, message: 'Invalid reset code.' };
          }
      }
      setIsLoading(false);
      return { success: false, message: 'User not found.' };
  };

  const logout = () => {
    setUser(null);
    setIsFeaturesUnlocked(false);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        isLoading, 
        isFeaturesUnlocked, 
        unlockFeatures, 
        lockFeatures, 
        login, 
        signup, 
        verifyAccount, 
        requestPasswordReset, 
        confirmPasswordReset, 
        logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
