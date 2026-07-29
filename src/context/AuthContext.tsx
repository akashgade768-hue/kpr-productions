import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase, isSupabaseLive, signInWithGoogleApi, sendRealOtpApi, verifyRealOtpApi } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOtpPending: boolean;
  otpTarget: string;
  otpType: 'email' | 'phone';
  loginStep1: (email: string, pass: string) => Promise<{ success: boolean; requiresOtp: boolean; message?: string }>;
  loginWithPhone: (phone: string) => Promise<{ success: boolean; requiresOtp: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (code: string, rememberDevice: boolean) => Promise<{ success: boolean; message?: string }>;
  cancelOtp: () => void;
  logout: () => void;
  switchRoleDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [otpTarget, setOtpTarget] = useState('');
  const [otpType, setOtpType] = useState<'email' | 'phone'>('email');

  useEffect(() => {
    if (user) {
      localStorage.setItem('kpr_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kpr_auth_user');
    }
  }, [user]);

  // Real Supabase Auth state listener
  useEffect(() => {
    if (!isSupabaseLive) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const name = session.user.user_metadata?.full_name || email.split('@')[0] || 'Authenticated User';
        const avatar = session.user.user_metadata?.avatar_url;

        setUser({
          id: session.user.id,
          name,
          email,
          phone: session.user.phone,
          role: email.includes('kprproduction.com') ? 'admin' : 'client',
          avatar
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email + Password login flow
  const loginStep1 = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    let foundUser = DEMO_USERS[cleanEmail];

    if (!foundUser) {
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
    if (trustedToken && new Date(trustedToken) > new Date()) {
      setUser(foundUser);
      return { success: true, requiresOtp: false };
    }

    setPendingUser(foundUser);
    setOtpTarget(cleanEmail);
    setOtpType('email');
    setIsOtpPending(true);

    await sendRealOtpApi(cleanEmail, 'email');
    return { success: true, requiresOtp: true };
  };

  // Mobile Phone OTP login flow
  const loginWithPhone = async (phone: string) => {
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 8) {
      return { success: false, requiresOtp: false, message: 'Please enter a valid mobile phone number with country code.' };
    }

    const phoneUser: User = {
      id: `u_phone_${Date.now()}`,
      name: `User ${cleanPhone.slice(-4)}`,
      email: `${cleanPhone.replace(/\D/g, '')}@mobile.kpr`,
      phone: cleanPhone,
      role: 'client'
    };

    setPendingUser(phoneUser);
    setOtpTarget(cleanPhone);
    setOtpType('phone');
    setIsOtpPending(true);

    await sendRealOtpApi(cleanPhone, 'phone');
    return { success: true, requiresOtp: true };
  };

  // Google OAuth Login
  const loginWithGoogle = async () => {
    try {
      const res: any = await signInWithGoogleApi();
      if (res && 'user' in res && res.user) {
        const gUser: User = {
          id: res.user.id,
          name: res.user.user_metadata?.full_name || 'Google User',
          email: res.user.email || 'google@user.com',
          role: 'client',
          avatar: res.user.user_metadata?.avatar_url
        };
        setUser(gUser);
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Google Authentication failed' };
    }
  };

  const verifyOtp = async (code: string, rememberDevice: boolean) => {
    try {
      const res = await verifyRealOtpApi(otpTarget, code, otpType);
      if (res.success && pendingUser) {
        if (rememberDevice) {
          const thirtyDays = new Date();
          thirtyDays.setDate(thirtyDays.getDate() + 30);
          localStorage.setItem(`kpr_trusted_${pendingUser.email}`, thirtyDays.toISOString());
        }
        setUser(pendingUser);
        setIsOtpPending(false);
        setPendingUser(null);
        return { success: true };
      }
      return { success: false, message: 'Verification failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Incorrect OTP code.' };
    }
  };

  const cancelOtp = () => {
    setIsOtpPending(false);
    setPendingUser(null);
  };

  const logout = async () => {
    if (isSupabaseLive) {
      await supabase.auth.signOut();
    }
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
        otpTarget,
        otpType,
        loginStep1,
        loginWithPhone,
        loginWithGoogle,
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
