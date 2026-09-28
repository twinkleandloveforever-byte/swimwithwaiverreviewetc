import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, LogIn, UserPlus, Mail, Lock, Key, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const SUPABASE_URL = 'https://rblifplwgfnwzattljed.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pVs6uTsUjiI2E1QynJMRnQ_EZ0t82X';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('menu');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && mode === 'login') {
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) {
      setMode('menu');
      setEmail('');
      setPassword('');
      setOtpCode('');
      setError('');
      setInfo('');
      setSignupEmail('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (signUpError) throw signUpError;
      setSignupEmail(email);
      setMode('otp');
      setInfo('A verification code has been sent to your email. Enter it below to confirm your account.');
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: signupEmail,
        token: otpCode,
        type: 'signup',
      });
      if (otpError) throw otpError;
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: signupEmail,
      });
      if (resendError) throw resendError;
      setInfo('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Unable to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ocean-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slide-up relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 hover:bg-ocean-50 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-ocean-600" />
        </button>

        {mode === 'menu' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-ocean-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ocean-900 mb-2">
              Account
            </h3>
            <p className="text-ocean-600 text-sm mb-8">
              Log in to your existing account or create a new one.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-600 hover:to-ocean-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Log In
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className="w-full py-3.5 bg-white border-2 border-ocean-200 hover:border-cyan-400 text-ocean-800 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
              </button>
            </div>
          </div>
        )}

        {mode === 'login' && (
          <div>
            <button
              onClick={() => { setMode('menu'); setError(''); }}
              className="flex items-center gap-1.5 text-sm text-ocean-500 hover:text-ocean-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-ocean-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ocean-900 mb-2 text-center">
              Welcome Back
            </h3>
            <p className="text-ocean-600 text-sm text-center mb-6">
              Enter your credentials to log in.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="w-5 h-5 text-ocean-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-ocean-200 bg-ocean-50/50 text-ocean-900 font-medium focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-ocean-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-ocean-200 bg-ocean-50/50 text-ocean-900 font-medium focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-600 hover:to-ocean-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Logging in...' : (<><LogIn className="w-5 h-5" /> Log In</>)}
              </button>
            </form>
            <p className="text-center text-sm text-ocean-500 mt-4">
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('signup'); setError(''); setEmail(''); setPassword(''); }}
                className="text-cyan-600 hover:text-cyan-700 font-semibold"
              >
                Create one
              </button>
            </p>
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <button
              onClick={() => { setMode('menu'); setError(''); }}
              className="flex items-center gap-1.5 text-sm text-ocean-500 hover:text-ocean-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-ocean-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ocean-900 mb-2 text-center">
              Create Account
            </h3>
            <p className="text-ocean-600 text-sm text-center mb-6">
              Sign up with your email. We'll send you a verification code.
            </p>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="relative">
                <Mail className="w-5 h-5 text-ocean-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-ocean-200 bg-ocean-50/50 text-ocean-900 font-medium focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-ocean-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 chars)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-ocean-200 bg-ocean-50/50 text-ocean-900 font-medium focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-600 hover:to-ocean-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating account...' : (<><UserPlus className="w-5 h-5" /> Sign Up</>)}
              </button>
            </form>
            <p className="text-center text-sm text-ocean-500 mt-4">
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); setError(''); setEmail(''); setPassword(''); }}
                className="text-cyan-600 hover:text-cyan-700 font-semibold"
              >
                Log in
              </button>
            </p>
          </div>
        )}

        {mode === 'otp' && (
          <div>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-ocean-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Key className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ocean-900 mb-2 text-center">
              Verify Your Email
            </h3>
            <p className="text-ocean-600 text-sm text-center mb-6">
              {info || `Enter the 6-digit verification code sent to ${signupEmail}.`}
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit code"
                autoFocus
                className="w-full px-4 py-3.5 rounded-xl border-2 border-ocean-200 bg-ocean-50/50 text-ocean-900 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-600 hover:to-ocean-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : (<><CheckCircle className="w-5 h-5" /> Verify & Continue</>)}
              </button>
            </form>
            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="w-full text-center text-sm text-cyan-600 hover:text-cyan-700 font-medium mt-4 disabled:opacity-60"
            >
              Didn't receive a code? Resend
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
