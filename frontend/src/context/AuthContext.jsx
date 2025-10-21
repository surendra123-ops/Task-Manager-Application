import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by verifying the httpOnly cookie
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        try {
          // Verify the cookie is still valid by fetching current user
          const response = await authAPI.getMe();
          setUser(response.data);
        } catch (error) {
          // Cookie is invalid or expired
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const userData = response.data;
    
    // Only store user data (not token - it's in httpOnly cookie)
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return response.data;
  };

  const signup = async (name, email, password) => {
    const response = await authAPI.signup({ name, email, password });
    const userData = response.data;
    
    // Only store user data (not token - it's in httpOnly cookie)
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return response.data;
  };

  const logout = async () => {
    try {
      // Call backend to clear the httpOnly cookie
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

