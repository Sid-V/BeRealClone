import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function VerifyScreen() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOtp, phoneNumber } = useAuth();
  const router = useRouter();
  const handleVerify = async () => {
    if (otp.length !== 4) return;
    
    try {
      setError('');
      setIsLoading(true);
      const success = await verifyOtp(otp);
      if (success) {
        router.replace('/(tabs)');
      } else {
        setError('Incorrect verification code. Please try again.');
        setOtp('');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Verify your number
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Enter the 4-digit code sent to {phoneNumber}
      </ThemedText>
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined]}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={(text) => {
          setOtp(text.replace(/[^0-9]/g, '').slice(0, 4));
          setError('');
        }}
        keyboardType="number-pad"
        maxLength={4}
        editable={!isLoading}
      />
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : null}
      <TouchableOpacity
        style={[
          styles.button,
          (otp.length !== 4 || isLoading) && styles.buttonDisabled
        ]}
        onPress={handleVerify}
        disabled={otp.length !== 4 || isLoading}
      >
        <ThemedText style={styles.buttonText}>
          {isLoading ? 'Verifying...' : 'Verify'}
        </ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.resendButton}
        onPress={() => router.replace('/(auth)/login')}
        disabled={isLoading}
      >
        <ThemedText style={styles.resendText}>
          Didn't receive the code?
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#0a7ea4',
    fontSize: 16,
  },
});
