import Constants from 'expo-constants';

const {
  TWILIO_ACCOUNT_SID = '',
  TWILIO_AUTH_TOKEN = '',
  TWILIO_SERVICE_SID = '',
} = Constants.expoConfig?.extra ?? {};

export const TWILIO_CONFIG = {
  accountSid: TWILIO_ACCOUNT_SID,
  authToken: TWILIO_AUTH_TOKEN,
  serviceSid: TWILIO_SERVICE_SID,
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
    if (cleaned.length < 10 || cleaned.length > 15) {
      return null;
    }

    // Assuming US numbers for simplicity
    // In production, use a proper phone library like libphonenumber-js
    if (cleaned.length === 10) {
      // Add US country code for 10-digit numbers
      return `+1${cleaned}`;
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
  if (!otp || otp.length !== 4) {
    return { isValid: false, error: 'Please enter a valid 4-digit code' };
  }
  if (!/^\d{4}$/.test(otp)) {
    return { isValid: false, error: 'Code must contain only numbers' };
  }
  return { isValid: true, error: null };
};
