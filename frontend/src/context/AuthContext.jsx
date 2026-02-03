import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate it
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Optionally validate token with server
      authAPI.getMe()
        .then((response) => {
          setUser(response.data.data);
          localStorage.setItem('user', JSON.stringify(response.data.data));
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, data } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Invalid credentials'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      await authAPI.verifyOTP(email, otp);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Invalid OTP'
      };
    }
  };

  const resetPassword = async (email, otp, password) => {
    try {
      await authAPI.resetPassword(email, otp, password);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to reset password'
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      forgotPassword,
      verifyOTP,
      resetPassword,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
