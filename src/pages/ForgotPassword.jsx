import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Label } from '@/components/ui';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    setStep('otp');
    setResendTimer(60);
    setIsLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    const lastIndex = Math.min(pastedData.length, 5);
    otpRefs.current[lastIndex]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setIsLoading(false);
      return;
    }
    setStep('password');
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtp(['', '', '', '', '', '']);
    setResendTimer(60);
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('success');
    setIsLoading(false);
  };

  const steps = [
    { key: 'email', label: 'Email' },
    { key: 'otp', label: 'Verify' },
    { key: 'password', label: 'Reset' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Left visual panel */}
      <motion.div
        className="relative hidden lg:flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute h-[600px] w-[600px] rounded-full animate-pulse"
          style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.03) 49%, rgba(255,255,255,0.03) 51%, transparent 51%),
              linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.03) 49%, rgba(255,255,255,0.03) 51%, transparent 51%)`,
            backgroundSize: '60px 60px'
          }}
        />
        <div className="relative z-10 text-center">
          <motion.h1
            className="font-display text-7xl font-light tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--color-text-primary)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            FitBees
          </motion.h1>
          <motion.span
            className="block text-sm tracking-[0.4em] uppercase"
            style={{ color: 'var(--color-accent)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Fitness Dashboard
          </motion.span>
        </div>
      </motion.div>

      {/* Right form panel */}
      <motion.div
        className="flex items-center justify-center p-8 lg:p-16"
        style={{ background: 'var(--color-bg-secondary)' }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md">
          {step !== 'success' && (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-80"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>

              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {steps.map((s, index) => (
                  <div key={s.key} className="flex items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                      style={{
                        background: index <= currentStepIndex ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                        color: index <= currentStepIndex ? 'var(--color-bg-primary)' : 'var(--color-text-muted)'
                      }}
                    >
                      {index < currentStepIndex ? <CheckCircle size={16} /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className="w-10 h-0.5 mx-1 transition-all"
                        style={{ background: index < currentStepIndex ? 'var(--color-accent)' : 'var(--color-bg-tertiary)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="font-display text-3xl font-normal mb-2">Forgot password?</h2>
                <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                  No worries! Enter your email and we'll send you a verification code.
                </p>

                {error && (
                  <motion.div
                    className="mb-6 rounded-lg px-4 py-3 text-sm"
                    style={{ background: 'rgba(255, 69, 58, 0.1)', border: '1px solid rgba(255, 69, 58, 0.3)', color: 'var(--color-error)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-6">
                    <Label htmlFor="email" className="mb-2 block">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-bg-tertiary border-t-bg-primary" />
                    ) : (
                      <>
                        <Mail size={16} />
                        Send Verification Code
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP */}
            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'var(--color-accent-glow)', color: 'var(--color-accent)' }}
                >
                  <KeyRound size={28} />
                </div>

                <h2 className="font-display text-3xl font-normal mb-2 text-center">Enter verification code</h2>
                <p className="mb-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                  We've sent a 6-digit code to<br />
                  <strong style={{ color: 'var(--color-accent)' }}>{email}</strong>
                </p>

                {error && (
                  <motion.div
                    className="mb-6 rounded-lg px-4 py-3 text-sm"
                    style={{ background: 'rgba(255, 69, 58, 0.1)', border: '1px solid rgba(255, 69, 58, 0.3)', color: 'var(--color-error)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleOtpSubmit}>
                  <div className="flex justify-center gap-2 mb-8">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className="w-12 h-14 text-center text-2xl font-semibold rounded-lg transition-all focus:outline-none"
                        style={{
                          background: 'var(--color-bg-tertiary)',
                          border: digit ? '2px solid var(--color-accent)' : '1px solid var(--color-border-default)',
                          color: 'var(--color-text-primary)'
                        }}
                      />
                    ))}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-bg-tertiary border-t-bg-primary" />
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                    Didn't receive the code?
                  </p>
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className="text-sm font-semibold bg-transparent border-none cursor-pointer"
                    style={{ color: resendTimer > 0 ? 'var(--color-text-muted)' : 'var(--color-accent)' }}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'var(--color-accent-glow)', color: 'var(--color-accent)' }}
                >
                  <Lock size={28} />
                </div>

                <h2 className="font-display text-3xl font-normal mb-2 text-center">Create new password</h2>
                <p className="mb-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                  Your new password must be at least 8 characters long.
                </p>

                {error && (
                  <motion.div
                    className="mb-6 rounded-lg px-4 py-3 text-sm"
                    style={{ background: 'rgba(255, 69, 58, 0.1)', border: '1px solid rgba(255, 69, 58, 0.3)', color: 'var(--color-error)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-6">
                    <Label htmlFor="newPassword" className="mb-2 block">New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="confirmPassword" className="mb-2 block">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  {newPassword && (
                    <div className="mb-6">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className="flex-1 h-1 rounded transition-all"
                            style={{
                              background: newPassword.length >= level * 3
                                ? level <= 1 ? 'var(--color-error)'
                                  : level <= 2 ? 'var(--color-warning)'
                                  : 'var(--color-success)'
                                : 'var(--color-bg-tertiary)'
                            }}
                          />
                        ))}
                      </div>
                      <p
                        className="text-xs"
                        style={{
                          color: newPassword.length < 6 ? 'var(--color-error)'
                            : newPassword.length < 8 ? 'var(--color-warning)'
                            : 'var(--color-success)'
                        }}
                      >
                        {newPassword.length < 6 ? 'Weak password'
                          : newPassword.length < 8 ? 'Fair password'
                          : newPassword.length < 12 ? 'Good password'
                          : 'Strong password'}
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-bg-tertiary border-t-bg-primary" />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
                  style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--color-success)' }}
                >
                  <CheckCircle size={40} />
                </motion.div>

                <h2 className="font-display text-3xl font-normal mb-4">Password reset successful!</h2>
                <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                  Your password has been changed successfully.<br />
                  You can now log in with your new password.
                </p>

                <Button onClick={() => navigate('/login')} className="w-full" size="lg">
                  Continue to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
