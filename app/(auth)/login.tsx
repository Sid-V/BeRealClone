import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      const success = await login(phone);
      if (success) {
        router.push('/(auth)/verify');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to BeReal Clone
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Enter your phone number to continue
      </ThemedText>
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined]}
        placeholder="Phone Number"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setError('');
        }}
        keyboardType="phone-pad"
        autoComplete="tel"
        editable={!isLoading}
      />
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : null}
      <TouchableOpacity
        style={[
          styles.button,
          (!phone || isLoading) && styles.buttonDisabled
        ]}
        onPress={handleLogin}
        disabled={!phone || isLoading}
      >
        <ThemedText style={styles.buttonText}>
          {isLoading ? 'Sending code...' : 'Continue'}
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
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
