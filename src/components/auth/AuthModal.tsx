import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, RefreshCw, Smartphone, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = 'google' | 'phone' | 'email';

const COUNTRY_CODES = [
  { code: '+91', country: 'India 🇮🇳' },
  { code: '+1', country: 'USA / Canada 🇺🇸' },
  { code: '+44', country: 'UK 🇬🇧' },
  { code: '+971', country: 'UAE 🇦🇪' },
  { code: '+65', country: 'Singapore 🇸🇬' },
];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginStep1, loginWithPhone, loginWithGoogle, verifyOtp, cancelOtp, isOtpPending, otpTarget, otpType } = useAuth();
  const { showToast } = useToast();

  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep(isOtpPending ? 'otp' : 'login');
      setError('');
      setOtp(['', '', '', '', '', '']);
    }
  }, [isOpen, isOtpPending]);

  useEffect(() => {
    if (step !== 'otp') return;
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer(prev => (prev <= 1 ? (clearInterval(interval), 0) : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      showToast('Google Authentication Successful', 'Signed in with Google', 'success');
      onClose();
    } else {
      setError(res.message || 'Google Auth Failed');
      showToast('Google Auth Failed', res.message, 'error');
    }
  };

  // Handle Phone OTP
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fullPhone = `${countryCode} ${phoneNumber}`;
    const res = await loginWithPhone(fullPhone);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Phone OTP initiation failed');
      showToast('Phone OTP Failed', res.message, 'error');
      return;
    }
    showToast('SMS OTP Sent!', `6-digit OTP code sent to ${fullPhone}`, 'info');
    setStep('otp');
  };

  // Handle Email + Pass Login
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await loginStep1(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Login failed');
      showToast('Authentication Error', res.message, 'error');
      return;
    }

    if (res.requiresOtp) {
      showToast('OTP Required', `Verification code sent to ${email}`, 'info');
      setStep('otp');
    } else {
      showToast('Welcome Back!', 'Signed in successfully', 'success');
      onClose();
    }
  };

  // OTP inputs
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Enter all 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    const res = await verifyOtp(code, remember);
    setLoading(false);
    if (res.success) {
      showToast('Verification Successful!', 'Your identity is confirmed', 'success');
      onClose();
    } else {
      setError(res.message || 'Verification failed');
      showToast('OTP Verification Failed', res.message, 'error');
    }
  };

  const handleClose = () => {
    if (isOtpPending) cancelOtp();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="w-full max-w-md glass-panel rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl shadow-black/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-dark-border text-center">
              <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
              <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center mx-auto mb-3 shadow-lg shadow-gold-500/20">
                {step === 'otp' ? <ShieldCheck size={28} className="text-black" /> : <Lock size={28} className="text-black" />}
              </div>
              <h2 className="text-xl font-cinematic font-bold text-white">
                {step === 'otp' ? 'OTP Verification' : 'Portal Access'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {step === 'otp'
                  ? `Enter 6-digit OTP sent via ${otpType.toUpperCase()} to ${otpTarget}`
                  : 'Select your preferred authentication method'}
              </p>
            </div>

            <div className="p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {step === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* Google OAuth Button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.6)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-dark-elevated border border-dark-border text-white text-sm font-medium hover:bg-white/5 transition-all shadow-md"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.32 7.33 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.68 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                      </svg>
                      Continue with Google
                    </motion.button>

                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-dark-border" />
                      <span className="text-xs text-gray-500 uppercase tracking-widest">Or authenticate with</span>
                      <div className="flex-1 h-px bg-dark-border" />
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="flex gap-2 p-1 rounded-xl bg-dark-card border border-dark-border">
                      <button
                        type="button"
                        onClick={() => setAuthMethod('email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
                          authMethod === 'email' ? 'bg-gold-gradient text-black font-semibold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Mail size={14} /> Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMethod('phone')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
                          authMethod === 'phone' ? 'bg-gold-gradient text-black font-semibold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Smartphone size={14} /> Mobile Phone OTP
                      </button>
                    </div>

                    {/* Phone OTP Form */}
                    {authMethod === 'phone' && (
                      <form onSubmit={handlePhoneSubmit} className="space-y-4 pt-1">
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="px-3 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white text-xs focus:border-gold-500/50 focus:outline-none"
                          >
                            {COUNTRY_CODES.map(c => (
                              <option key={c.code} value={c.code}>{c.code} {c.country}</option>
                            ))}
                          </select>
                          <div className="relative flex-1">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Smartphone size={16} /></div>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                              placeholder="98765 43210"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm"
                            />
                          </div>
                        </div>

                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold-gradient rounded-xl text-black font-semibold text-sm disabled:opacity-50"
                        >
                          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Smartphone size={16} />}
                          {loading ? 'Sending OTP...' : 'Send Mobile OTP'}
                        </motion.button>
                      </form>
                    )}

                    {/* Email Form */}
                    {authMethod === 'email' && (
                      <form onSubmit={handleEmailSubmit} className="space-y-4 pt-1">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Mail size={16} /></div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@kprproduction.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm"
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Lock size={16} /></div>
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Your password"
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm"
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-dark-border bg-dark-elevated accent-gold-500" />
                            <span className="text-xs text-gray-400">Remember device (30 days)</span>
                          </label>
                        </div>

                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold-gradient rounded-xl text-black font-semibold text-sm disabled:opacity-50"
                        >
                          {loading ? <RefreshCw size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                          {loading ? 'Signing In...' : 'Sign In'}
                        </motion.button>
                      </form>
                    )}

                    {/* Quick Demo Login */}
                    <div className="pt-4 border-t border-dark-border">
                      <p className="text-[11px] text-gray-500 text-center mb-2.5 uppercase tracking-wider">Quick Demo Accounts</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {[
                          { label: 'Super Admin', email: 'admin@kprproduction.com' },
                          { label: 'Staff Member', email: 'alex@kprproduction.com' },
                          { label: 'Client Portal', email: 'client@kprproduction.com' },
                        ].map(demo => (
                          <button
                            key={demo.email}
                            type="button"
                            onClick={() => { setAuthMethod('email'); setEmail(demo.email); setPassword('demo123'); }}
                            className="px-3 py-1.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-gray-400 hover:text-gold-400 hover:border-gold-500/30 transition-all"
                          >
                            {demo.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-dark-elevated focus:outline-none transition-all ${
                            digit
                              ? 'border-gold-500 text-gold-400 shadow-lg shadow-gold-500/10'
                              : 'border-dark-border text-white focus:border-gold-500/50'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-center text-xs text-gray-400">
                      Demo OTP Verification Code: <span className="text-gold-400 font-mono font-bold">123456</span>
                    </p>

                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-gold-500" />
                      <span className="text-xs text-gray-400">Remember this device for 30 days</span>
                    </label>

                    <motion.button
                      onClick={handleVerify}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold-gradient rounded-xl text-black font-semibold text-sm disabled:opacity-50"
                    >
                      {loading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                      {loading ? 'Verifying...' : 'Verify & Enter Dashboard'}
                    </motion.button>

                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <span className="text-xs text-gray-500">Resend code in {otpTimer}s</span>
                      ) : (
                        <button onClick={() => setOtpTimer(60)} className="text-xs text-gold-400 hover:text-gold-300">
                          Resend OTP Code
                        </button>
                      )}
                    </div>

                    <button onClick={() => { setStep('login'); cancelOtp(); }} className="w-full text-center text-xs text-gray-500 hover:text-white">
                      ← Back to Auth Methods
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
