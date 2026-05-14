import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, workerAPI } from '../services/api';

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
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getProfile()
        .then((response) => {
          dispatch({ type: 'SET_USER', payload: response.data });
        })
        .catch(() => {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      dispatch({ type: 'LOGIN', payload: response.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      dispatch({ type: 'LOGIN', payload: response.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const verifyOTP = async (userId, otp) => {
    try {
      await authAPI.verifyOTP({ userId, otp });
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
      const response = await authAPI.updateProfile(updates);
      dispatch({ type: 'UPDATE_PROFILE', payload: response.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  const updateWorkerProfile = async (updates) => {
    try {
      const response = await workerAPI.updateWorkerProfile(updates);
      dispatch({ type: 'UPDATE_PROFILE', payload: { worker: response.data } });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Worker update failed' };
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      dispatch,
      login,
      register,
      verifyOTP,
      logout,
      updateProfile,
      updateWorkerProfile
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