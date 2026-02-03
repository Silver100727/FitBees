import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Label, Checkbox } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left visual panel */}
      <motion.div
        className="relative hidden lg:flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated glow */}
        <div
          className="absolute h-[600px] w-[600px] rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)'
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.03) 49%, rgba(255,255,255,0.03) 51%, transparent 51%),
              linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.03) 49%, rgba(255,255,255,0.03) 51%, transparent 51%)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 text-center">
          <motion.h1
            className="font-display text-7xl font-light tracking-[0.2em] uppercase text-text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            FitBees
          </motion.h1>
          <motion.span
            className="block text-sm tracking-[0.4em] uppercase text-accent"
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
        className="flex items-center justify-center p-8 lg:p-16 bg-card"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <motion.h2
            className="font-display text-3xl font-normal mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome back
          </motion.h2>
          <motion.p
            className="text-text-secondary mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Enter your credentials to access your account
          </motion.p>

          {error && (
            <motion.div
              className="mb-6 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="email" className="mb-2 block">Email Address</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </motion.div>

          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="password" className="mb-2 block">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </motion.div>

          <motion.div
            className="mb-8 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked)}
              />
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-accent transition-colors hover:text-accent-light"
            >
              Forgot password?
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-bg-tertiary border-t-bg-primary" />
              ) : (
                'Sign In'
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
