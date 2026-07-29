// Supabase Client Helper with Local Fallback Engine
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Simulated Supabase Edge Function for Zoho / Google Workspace Worker Email Provisioning
export async function provisionWorkerEmailApi(handle: string, name: string, role: 'admin' | 'staff') {
  const fullWorkEmail = `${handle.toLowerCase().replace(/[^a-z0-9]/g, '')}@kprproduction.com`;
  
  // Simulate network latency for API call to Zoho / Workspace Edge Function
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

// Simulated OTP Sender (Email or SMS)
export async function sendOtpCodeApi(target: string, type: 'email' | 'phone') {
  await new Promise((res) => setTimeout(res, 800));
  // Default demo OTP is 123456
  return {
    success: true,
    demoOtp: '123456',
    message: `6-digit OTP code sent via ${type} to ${target}. (Demo Code: 123456)`
  };
}
