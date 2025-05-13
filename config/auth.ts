// Note: In a production environment, these values should be stored in environment variables
export const TWILIO_CONFIG = {
  accountSid: 'YOUR_ACCOUNT_SID',
  authToken: 'YOUR_AUTH_TOKEN',
  serviceSid: 'YOUR_SERVICE_SID', // Verify Service SID
};

// For development purposes only
export const MOCK_AUTH = {
  enabled: true, // Set to false in production
  validOTP: '123456', // Only used when MOCK_AUTH.enabled is true
};

/**
 * Validates and formats a phone number.
 * @param phoneNumber The phone number to validate
 * @returns Formatted phone number or null if invalid
 */
export function validatePhoneNumber(phoneNumber: string): string | null {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid length (most countries are between 10-15 digits)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return null;
  }
  
  // For this example, we'll format US numbers
  // In a real app, you'd want to use a proper phone number library like libphonenumber-js
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  // For other lengths, just add a + prefix if it doesn't exist
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}
