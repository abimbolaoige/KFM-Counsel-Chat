
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{success: boolean, message: string}>;
  signup: (email: string, pass: string, name: string) => Promise<{success: boolean, message: string}>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for simulated DB
const USERS_DB_KEY = 'kfm_users_db';
const SESSION_KEY = 'kfm_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

    const db = getUsersDB();
    const found = db.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

    if (found) {
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

    const newUser = {
        id: 'user_' + Date.now(),
        email,
        password: pass,
        name
    };
    
    db.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));

    // Auto login
    const userObj: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userObj);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userObj));
    
    setIsLoading(false);
    return { success: true, message: 'Account created successfully' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
