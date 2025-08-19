import base64 from 'react-native-base64';
import { TWILIO_CONFIG } from '../config/auth';

export class TwilioService {
  private static async twilioFetch(endpoint: string, body: Record<string, string>) {
    const auth = base64.encode(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`);
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
  }

  static async sendVerification(phoneNumber: string): Promise<boolean> {
    try {
      const result = await this.twilioFetch('Verifications', {
        To: phoneNumber,
        Channel: 'sms'
      });
      return result.status === 'pending';
    } catch (error) {
      console.error('Failed to send verification:', error);
      return false;
    }
  }

  static async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const result = await this.twilioFetch('VerificationCheck', {
        To: phoneNumber,
        Code: code
      });
      return result.status === 'approved';
    } catch (error) {
      console.error('Failed to verify code:', error);
      return false;
    }
  }
}
