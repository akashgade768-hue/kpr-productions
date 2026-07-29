import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, RefreshCw, CheckCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginStep1, verifyOtp, cancelOtp, isOtpPending, otpTargetEmail } = useAuth();
  const [step, setStep] = useState<'login' | 'otp' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep(isOtpPending ? 'otp' : 'login');
      setError('');
      setOtp(['', '', '', '', '', '']);
    }
  }, [isOpen, isOtpPending]);

  // OTP timer
  useEffect(() => {
    if (step !== 'otp') return;
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await loginStep1(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Login failed');
      return;
    }
    if (res.requiresOtp) {
      setStep('otp');
    } else {
      onClose();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter all 6 digits'); return; }
    setLoading(true);
    setError('');
    const res = await verifyOtp(code, remember);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Verification failed');
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
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-md glass-panel rounded-3xl overflow-hidden"
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
                {step === 'otp' ? 'Verify Your Identity' : step === 'forgot' ? 'Reset Password' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {step === 'otp'
                  ? `Enter the 6-digit code sent to ${otpTargetEmail}`
                  : step === 'forgot'
                  ? 'Enter your email to receive a reset link'
                  : 'Sign in to your Admin or Client portal'}
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
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Mail size={16} /></div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@kprproduction.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
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
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-dark-border bg-dark-elevated accent-gold-500" />
                        <span className="text-xs text-gray-500">Trust this device (30 days)</span>
                      </label>
                      <button type="button" onClick={() => setStep('forgot')} className="text-xs text-gold-400 hover:text-gold-300">
                        Forgot password?
                      </button>
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

                    {/* Demo logins */}
                    <div className="pt-4 border-t border-dark-border">
                      <p className="text-xs text-gray-600 text-center mb-3">Quick Demo Accounts (password: any 3+ chars)</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {[
                          { label: 'Admin', email: 'admin@kprproduction.com' },
                          { label: 'Staff', email: 'alex@kprproduction.com' },
                          { label: 'Client', email: 'client@kprproduction.com' },
                        ].map(demo => (
                          <button
                            key={demo.email}
                            type="button"
                            onClick={() => { setEmail(demo.email); setPassword('demo123'); }}
                            className="px-3 py-1.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-gray-400 hover:text-gold-400 hover:border-gold-500/30 transition-all"
                          >
                            {demo.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.form>
                )}

                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
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

                    <p className="text-center text-xs text-gray-500">
                      Demo OTP Code: <span className="text-gold-400 font-mono font-bold">123456</span>
                    </p>

                    {/* Remember device */}
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-gold-500" />
                      <span className="text-xs text-gray-500">Remember this device for 30 days</span>
                    </label>

                    <motion.button
                      onClick={handleVerify}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold-gradient rounded-xl text-black font-semibold text-sm disabled:opacity-50"
                    >
                      {loading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                      {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </motion.button>

                    {/* Resend */}
                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <span className="text-xs text-gray-500">Resend code in {otpTimer}s</span>
                      ) : (
                        <button onClick={() => setOtpTimer(60)} className="text-xs text-gold-400 hover:text-gold-300">
                          Resend Code
                        </button>
                      )}
                    </div>

                    <button onClick={() => { setStep('login'); cancelOtp(); }} className="w-full text-center text-xs text-gray-500 hover:text-white">
                      ← Back to Sign In
                    </button>
                  </motion.div>
                )}

                {step === 'forgot' && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Mail size={16} /></div>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold-gradient rounded-xl text-black font-semibold text-sm"
                    >
                      <Send size={16} /> Send Reset Link
                    </motion.button>
                    <button onClick={() => setStep('login')} className="w-full text-center text-xs text-gray-500 hover:text-white mt-2">
                      ← Back to Sign In
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
