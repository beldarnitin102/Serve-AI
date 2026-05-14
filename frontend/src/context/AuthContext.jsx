import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  // TEMPORARY: Mocked state for hackathon/testing
  const [state, dispatch] = useReducer(authReducer, {
    user: { 
      _id: 'mock-id',
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'user' 
    },
    token: 'mock-token',
    isAuthenticated: true,
    loading: false
  });

  /* Commented out real auth logic for temporary bypass
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true
  });
  */

  // Set axios default header
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Check if user is logged in on app start
  useEffect(() => {
    // TEMPORARY: Skip auth check
    console.log("Auth check skipped - temporary bypass active");
    
    /*
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/api/auth/profile');
          dispatch({
            type: 'LOGIN',
            payload: { user: response.data, token }
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
    */
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      dispatch({ type: 'LOGIN', payload: response.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      dispatch({ type: 'LOGIN', payload: response.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const verifyOTP = async (userId, otp) => {
    try {
      await axios.post('/api/auth/verify-otp', { userId, otp });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Verification failed' };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put('/api/auth/profile', updates);
      dispatch({ type: 'UPDATE_PROFILE', payload: response.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      verifyOTP,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};