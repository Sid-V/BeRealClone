import { MOCK_AUTH, validatePhoneNumber } from '@/config/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  login: (phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
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
      // In a real app, we would call Twilio API here
      // For development, we'll just simulate the OTP being sent
      return true;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return false;
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      // For development, we're using mock authentication
      if (MOCK_AUTH.enabled) {
        if (otp === MOCK_AUTH.validOTP) {
          setIsAuthenticated(true);
          await AsyncStorage.setItem('isAuthenticated', 'true');
          await AsyncStorage.setItem('phoneNumber', phoneNumber || '');
          return true;
        }
        return false;
      }
      
      // In production, we would verify with Twilio here
      // const verified = await twilioClient.verify.v2...
      
      setIsAuthenticated(true);
      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('phoneNumber', phoneNumber || '');
      return true;
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
    <AuthContext.Provider value={{ isAuthenticated, phoneNumber, login, logout, verifyOtp }}>
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
