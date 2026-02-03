import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'password' | 'success'
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

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle email submission
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

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the last filled input or the next empty one
    const lastIndex = Math.min(pastedData.length, 5);
    otpRefs.current[lastIndex]?.focus();
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
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

    // Simulate OTP verification (accept any 6-digit code for demo)
    setStep('password');
    setIsLoading(false);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtp(['', '', '', '', '', '']);
    setResendTimer(60);
    setIsLoading(false);
  };

  // Handle password submission
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

  // Step indicators
  const steps = [
    { key: 'email', label: 'Email' },
    { key: 'otp', label: 'Verify' },
    { key: 'password', label: 'Reset' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="login-page">
      <motion.div
        className="login-visual"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="login-brand">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            FitBees
          </motion.h1>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Fitness Dashboard
          </motion.span>
        </div>
      </motion.div>

      <motion.div
        className="login-form-container"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="login-form">
          {step !== 'success' && (
            <>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--space-lg)',
                  transition: 'color var(--transition-fast)'
                }}
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>

              {/* Step Indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-xl)'
              }}>
                {steps.map((s, index) => (
                  <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      background: index <= currentStepIndex ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                      color: index <= currentStepIndex ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
                      transition: 'all var(--transition-base)'
                    }}>
                      {index < currentStepIndex ? <CheckCircle size={16} /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div style={{
                        width: '40px',
                        height: '2px',
                        background: index < currentStepIndex ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                        margin: '0 var(--space-xs)',
                        transition: 'background var(--transition-base)'
                      }} />
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
                <h2 style={{ marginBottom: 'var(--space-sm)' }}>Forgot password?</h2>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-xl)',
                  lineHeight: 1.6
                }}>
                  No worries! Enter your email and we'll send you a verification code.
                </p>

                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleEmailSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>
                      {isLoading ? (
                        <span className="loading-spinner" style={{ display: 'inline-block' }} />
                      ) : (
                        <>
                          <Mail size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                          Send Verification Code
                        </>
                      )}
                    </span>
                  </motion.button>
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
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--color-accent-glow)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-lg)',
                  color: 'var(--color-accent)'
                }}>
                  <KeyRound size={28} />
                </div>

                <h2 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>
                  Enter verification code
                </h2>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-xl)',
                  lineHeight: 1.6,
                  textAlign: 'center'
                }}>
                  We've sent a 6-digit code to<br />
                  <strong style={{ color: 'var(--color-accent)' }}>{email}</strong>
                </p>

                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleOtpSubmit}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-xl)'
                  }}>
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
                        style={{
                          width: '48px',
                          height: '56px',
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          background: 'var(--color-bg-tertiary)',
                          border: digit ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--color-text-primary)',
                          transition: 'all var(--transition-fast)'
                        }}
                      />
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>
                      {isLoading ? (
                        <span className="loading-spinner" style={{ display: 'inline-block' }} />
                      ) : (
                        'Verify Code'
                      )}
                    </span>
                  </motion.button>
                </form>

                <div style={{
                  textAlign: 'center',
                  marginTop: 'var(--space-lg)'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    Didn't receive the code?
                  </p>
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendTimer > 0 ? 'var(--color-text-muted)' : 'var(--color-accent)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: resendTimer > 0 ? 'default' : 'pointer'
                    }}
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
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--color-accent-glow)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-lg)',
                  color: 'var(--color-accent)'
                }}>
                  <Lock size={28} />
                </div>

                <h2 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>
                  Create new password
                </h2>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-xl)',
                  lineHeight: 1.6,
                  textAlign: 'center'
                }}>
                  Your new password must be at least 8 characters long.
                </p>

                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        style={{ paddingRight: '48px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-muted)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        style={{ paddingRight: '48px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-muted)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  {newPassword && (
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        marginBottom: '8px'
                      }}>
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            style={{
                              flex: 1,
                              height: '4px',
                              borderRadius: '2px',
                              background: newPassword.length >= level * 3
                                ? level <= 1 ? 'var(--color-error)'
                                  : level <= 2 ? 'var(--color-warning)'
                                  : 'var(--color-success)'
                                : 'var(--color-bg-tertiary)',
                              transition: 'background var(--transition-fast)'
                            }}
                          />
                        ))}
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: newPassword.length < 6 ? 'var(--color-error)'
                          : newPassword.length < 8 ? 'var(--color-warning)'
                          : 'var(--color-success)'
                      }}>
                        {newPassword.length < 6 ? 'Weak password'
                          : newPassword.length < 8 ? 'Fair password'
                          : newPassword.length < 12 ? 'Good password'
                          : 'Strong password'}
                      </p>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>
                      {isLoading ? (
                        <span className="loading-spinner" style={{ display: 'inline-block' }} />
                      ) : (
                        'Reset Password'
                      )}
                    </span>
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(52, 199, 89, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-xl)',
                    color: 'var(--color-success)'
                  }}
                >
                  <CheckCircle size={40} />
                </motion.div>

                <h2 style={{ marginBottom: 'var(--space-md)' }}>Password reset successful!</h2>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-xl)',
                  lineHeight: 1.6
                }}>
                  Your password has been changed successfully.<br />
                  You can now log in with your new password.
                </p>

                <motion.button
                  onClick={() => navigate('/login')}
                  className="login-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Continue to Login</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
