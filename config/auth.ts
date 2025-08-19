import Constants from 'expo-constants';
import { OTP_CONFIG, PHONE_CONFIG } from '../constants/Theme';

const {
  TWILIO_ACCOUNT_SID = '',
  TWILIO_AUTH_TOKEN = '',
  TWILIO_SERVICE_SID = '',
} = Constants.expoConfig?.extra ?? {};

// Fallback to direct environment access if Expo config doesn't work
const accountSid = TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID || '';
const authToken = TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN || '';
const serviceSid = TWILIO_SERVICE_SID || process.env.TWILIO_SERVICE_SID || '';

// Debug logging for development
console.log('Environment config loaded:', {
  hasAccountSid: !!accountSid,
  hasAuthToken: !!authToken,
  hasServiceSid: !!serviceSid,
  accountSidPreview: accountSid ? `${accountSid.substring(0, 6)}...` : 'missing',
  source: TWILIO_ACCOUNT_SID ? 'expo-config' : 'fallback'
});

export const TWILIO_CONFIG = {
  accountSid,
  authToken,
  serviceSid,
};

// Validate that all required environment variables are present
export const validateTwilioConfig = () => {
  const requiredVars = [
    { key: 'accountSid', value: TWILIO_CONFIG.accountSid },
    { key: 'authToken', value: TWILIO_CONFIG.authToken },
    { key: 'serviceSid', value: TWILIO_CONFIG.serviceSid },
  ];

  for (const { key, value } of requiredVars) {
    if (!value) {
      throw new Error(`Missing required Twilio configuration: ${key}. Please check your environment variables.`);
    }
  }
};

// For development purposes only
export const MOCK_AUTH = {
  enabled: false, // Set to false in production
  validOTP: '1111', // Only used when MOCK_AUTH.enabled is true
};

/**
 * Validates and formats a phone number to E.164 format
 * @param phoneNumber The phone number to validate
 * @returns Formatted phone number or null if invalid
 */
export function validatePhoneNumber(phoneNumber: string): string | null {
  try {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Basic length validation
    if (cleaned.length < PHONE_CONFIG.minLength || cleaned.length > PHONE_CONFIG.maxLength) {
      return null;
    }

    // Assuming US numbers for simplicity
    // In production, use a proper phone library like libphonenumber-js
    if (cleaned.length === 10) {
      // Add US country code for 10-digit numbers
      return `${PHONE_CONFIG.defaultCountryCode}${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      // Handle numbers that already have US country code
      return `+${cleaned}`;
    }
    
    // For other numbers, just add + if not present
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  } catch (error) {
    console.error('Phone validation error:', error);
    return null;
  }
}

/**
 * Validates an OTP code
 * @param otp The OTP code to validate
 * @returns Validation result with isValid and error message
 */
export const validateOTP = (otp: string) => {
  if (!otp || otp.length !== OTP_CONFIG.length) {
    return { isValid: false, error: `Please enter a valid ${OTP_CONFIG.length}-digit code` };
  }
  if (!OTP_CONFIG.validationRegex.test(otp)) {
    return { isValid: false, error: 'Code must contain only numbers' };
  }
  return { isValid: true, error: null };
};
