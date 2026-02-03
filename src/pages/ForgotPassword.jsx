import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Basic email validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    setIsSubmitted(true);
    setIsLoading(false);
  };

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
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
              marginBottom: 'var(--space-xl)',
              transition: 'color var(--transition-fast)'
            }}
            className="back-link"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ marginBottom: 'var(--space-sm)' }}
                >
                  Forgot password?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--space-xl)',
                    lineHeight: 1.6
                  }}
                >
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </motion.p>

                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>
                      {isLoading ? (
                        <span className="loading-spinner" style={{ display: 'inline-block' }} />
                      ) : (
                        <>
                          <Mail size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                          Send Reset Link
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              </motion.div>
            ) : (
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

                <h2 style={{ marginBottom: 'var(--space-md)' }}>Check your email</h2>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-xl)',
                  lineHeight: 1.6
                }}>
                  We've sent a password reset link to<br />
                  <strong style={{ color: 'var(--color-accent)' }}>{email}</strong>
                </p>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-tertiary)',
                  marginBottom: 'var(--space-lg)'
                }}>
                  Didn't receive the email? Check your spam folder or
                </p>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: 'var(--space-md)' }}
                >
                  Try another email
                </button>

                <Link
                  to="/login"
                  className="btn btn-ghost"
                  style={{
                    width: '100%',
                    padding: 'var(--space-md)',
                    marginTop: 'var(--space-md)',
                    display: 'block',
                    textAlign: 'center'
                  }}
                >
                  Return to login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
