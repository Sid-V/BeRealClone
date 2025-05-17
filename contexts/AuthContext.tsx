import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import base64 from 'react-native-base64';
import { MOCK_AUTH, TWILIO_CONFIG, validatePhoneNumber } from '../config/auth';

type AuthContextType = {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  login: (phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  clearAuthState?: () => Promise<void>; // Development only
};

const AuthContext = createContext<AuthContextType | null>(null);

// Helper function for Twilio API calls
const twilioFetch = async (endpoint: string, body: Record<string, string>) => {
  const auth = base64.encode(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`);
  // Using the v2 Verify API endpoints
  const baseUrl = `https://verify.twilio.com/v2/Services/${TWILIO_CONFIG.serviceSid}`;
  const url = `${baseUrl}/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Object.entries(body)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&'),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || `Twilio API error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('Twilio API error:', error);
    throw error;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  // Clear auth state (development only)
  const clearAuthState = async () => {
    setIsAuthenticated(false);
    setPhoneNumber(null);
    await AsyncStorage.multiRemove(['isAuthenticated', 'phoneNumber']);
  };

  useEffect(() => {
    // Development: Check for CLEAR_AUTH query parameter
    if (typeof window !== 'undefined' && window.location?.search?.includes('clear_auth')) {
      clearAuthState();
    }
    
    const initializeAuth = async () => {
      const storedAuth = await AsyncStorage.getItem('isAuthenticated');
      const storedPhone = await AsyncStorage.getItem('phoneNumber');
      if (storedAuth === 'true' && storedPhone) {
        setIsAuthenticated(true);
        setPhoneNumber(storedPhone);
      }
    };
    initializeAuth();
  }, []);

  const login = async (phone: string) => {
    try {
      const formattedPhone = validatePhoneNumber(phone);
      if (!formattedPhone) {
        return false;
      }
      
      setPhoneNumber(formattedPhone);

      if (MOCK_AUTH.enabled) {
        return true;
      }      // Start verification process
      const result = await twilioFetch('Verifications', {
        To: formattedPhone,
        Channel: 'sms'
      });

      return result.status === 'pending';
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return false;
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      if (!phoneNumber) {
        console.error('No phone number to verify');
        return false;
      }

      if (MOCK_AUTH.enabled) {
        if (otp === MOCK_AUTH.validOTP) {
          setIsAuthenticated(true);
          await AsyncStorage.setItem('isAuthenticated', 'true');
          await AsyncStorage.setItem('phoneNumber', phoneNumber);
          return true;
        }
        return false;
      }      
        // Check verification code
      const result = await twilioFetch('VerificationCheck', {
        To: phoneNumber,
        Code: otp
      });

      const isApproved = result.status === 'approved';
      if (isApproved) {
        setIsAuthenticated(true);
        await AsyncStorage.setItem('isAuthenticated', 'true');
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
      }
      
      return isApproved;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return false;
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setPhoneNumber(null);
    await AsyncStorage.multiRemove(['isAuthenticated', 'phoneNumber']);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      phoneNumber, 
      login, 
      logout, 
      verifyOtp,
      clearAuthState // Only available in development
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
