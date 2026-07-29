import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { sendOtpCodeApi } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOtpPending: boolean;
  otpTargetEmail: string;
  loginStep1: (email: string, pass: string) => Promise<{ success: boolean; requiresOtp: boolean; message?: string }>;
  verifyOtp: (code: string, rememberDevice: boolean) => Promise<{ success: boolean; message?: string }>;
  cancelOtp: () => void;
  logout: () => void;
  switchRoleDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo Default Users
const DEMO_USERS: Record<string, User> = {
  'admin@kprproduction.com': {
    id: 'u_admin',
    name: 'Vikramaditya KPR',
    email: 'admin@kprproduction.com',
    role: 'superadmin',
    work_email: 'admin@kprproduction.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  'alex@kprproduction.com': {
    id: 'u_staff',
    name: 'Alex Vance',
    email: 'alex@kprproduction.com',
    role: 'staff',
    work_email: 'alex@kprproduction.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  'client@kprproduction.com': {
    id: 'u_client',
    name: 'Priya & Rahul Kapoor',
    email: 'client@kprproduction.com',
    role: 'client',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kpr_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isOtpPending, setIsOtpPending] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [otpTargetEmail, setOtpTargetEmail] = useState('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('kpr_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kpr_auth_user');
    }
  }, [user]);

  const loginStep1 = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if demo user or matches patterns
    let foundUser = DEMO_USERS[cleanEmail];
    
    if (!foundUser) {
      // Dynamic fallback for newly invited clients/staff
      if (cleanEmail.includes('kprproduction.com')) {
        foundUser = {
          id: `u_${Date.now()}`,
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          work_email: cleanEmail,
          role: 'staff'
        };
      } else {
        foundUser = {
          id: `u_${Date.now()}`,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'client'
        };
      }
    }

    if (pass.length < 3) {
      return { success: false, requiresOtp: false, message: 'Invalid password. Minimum 3 characters.' };
    }

    // Check trusted device token
    const trustedToken = localStorage.getItem(`kpr_trusted_${cleanEmail}`);
    if (trustedToken) {
      const expiry = new Date(trustedToken);
      if (expiry > new Date()) {
        // Skip OTP for trusted device
        setUser(foundUser);
        return { success: true, requiresOtp: false };
      }
    }

    // Require OTP Verification
    setPendingUser(foundUser);
    setOtpTargetEmail(cleanEmail);
    setIsOtpPending(true);

    await sendOtpCodeApi(cleanEmail, 'email');
    return { success: true, requiresOtp: true };
  };

  const verifyOtp = async (code: string, rememberDevice: boolean) => {
    if (code !== '123456' && code.length !== 6) {
      return { success: false, message: 'Incorrect OTP code. Enter 123456 for demo verification.' };
    }

    if (!pendingUser) {
      return { success: false, message: 'Session expired. Please sign in again.' };
    }

    if (rememberDevice) {
      const thirtyDays = new Date();
      thirtyDays.setDate(thirtyDays.getDate() + 30);
      localStorage.setItem(`kpr_trusted_${pendingUser.email}`, thirtyDays.toISOString());
    }

    setUser(pendingUser);
    setIsOtpPending(false);
    setPendingUser(null);
    return { success: true };
  };

  const cancelOtp = () => {
    setIsOtpPending(false);
    setPendingUser(null);
  };

  const logout = () => {
    setUser(null);
    setIsOtpPending(false);
  };

  const switchRoleDemo = (role: UserRole) => {
    if (role === 'superadmin') {
      setUser(DEMO_USERS['admin@kprproduction.com']);
    } else if (role === 'staff') {
      setUser(DEMO_USERS['alex@kprproduction.com']);
    } else {
      setUser(DEMO_USERS['client@kprproduction.com']);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOtpPending,
        otpTargetEmail,
        loginStep1,
        verifyOtp,
        cancelOtp,
        logout,
        switchRoleDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
