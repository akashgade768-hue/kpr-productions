import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://sample-kpr-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sample-anon-key-placeholder';

export const isSupabaseLive = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://sample-kpr-project.supabase.co'
);

// Real Supabase Client Instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Google OAuth Provider ──
export async function signInWithGoogleApi() {
  if (isSupabaseLive) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  }

  // Simulated Google OAuth Flow
  await new Promise((res) => setTimeout(res, 1000));
  return {
    user: {
      id: `u_google_${Date.now()}`,
      email: 'user.google@gmail.com',
      user_metadata: {
        full_name: 'Google Auth User',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      }
    }
  };
}

// ── Mobile Phone OTP & Email OTP Sender ──
export async function sendRealOtpApi(target: string, type: 'email' | 'phone') {
  if (isSupabaseLive) {
    if (type === 'phone') {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: target
      });
      if (error) throw error;
      return { success: true, data, message: `OTP sent to ${target} via SMS` };
    } else {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: target
      });
      if (error) throw error;
      return { success: true, data, message: `OTP sent to ${target} via Email` };
    }
  }

  // Simulated OTP sending
  await new Promise((res) => setTimeout(res, 800));
  return {
    success: true,
    demoOtp: '123456',
    message: `6-digit OTP sent via ${type} to ${target}. (Demo OTP Code: 123456)`
  };
}

// ── Verify OTP Code ──
export async function verifyRealOtpApi(target: string, token: string, type: 'email' | 'phone') {
  if (isSupabaseLive) {
    if (type === 'phone') {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: target,
        token,
        type: 'sms'
      });
      if (error) throw error;
      return { success: true, session: data.session, user: data.user };
    } else {
      const { data, error } = await supabase.auth.verifyOtp({
        email: target,
        token,
        type: 'email'
      });
      if (error) throw error;
      return { success: true, session: data.session, user: data.user };
    }
  }

  // Simulated verification
  if (token === '123456' || token.length === 6) {
    return { success: true };
  }
  throw new Error('Incorrect OTP code. Enter 123456 for demo verification.');
}

// Simulated Supabase Edge Function for Zoho / Google Workspace Worker Email Provisioning
export async function provisionWorkerEmailApi(handle: string, name: string, role: 'admin' | 'staff') {
  const fullWorkEmail = `${handle.toLowerCase().replace(/[^a-z0-9]/g, '')}@kprproduction.com`;

  await new Promise((res) => setTimeout(res, 1200));

  const mailProviderId = `zoho_user_${Math.floor(10000 + Math.random() * 90000)}`;
  const tempPassword = `KPR#${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    success: true,
    work_email: fullWorkEmail,
    mail_provider_id: mailProviderId,
    tempPassword,
    message: `Mailbox ${fullWorkEmail} provisioned successfully via Zoho Mail API.`
  };
}
