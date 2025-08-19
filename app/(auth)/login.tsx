import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/useForm';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const { values, errors, isLoading, setValue, setError, setLoading } = useForm({
    phone: '',
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      const success = await login(values.phone);
      if (success) {
        router.push('/(auth)/verify');
      } else {
        setError('phone', 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('phone', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
      
      <ThemedInput
        hasError={!!errors.phone}
        placeholder="Phone Number"
        value={values.phone}
        onChangeText={(text) => setValue('phone', text)}
        keyboardType="phone-pad"
        autoComplete="tel"
        editable={!isLoading}
      />
      
      {errors.phone && (
        <ThemedText style={styles.errorText}>{errors.phone}</ThemedText>
      )}
      
      <ThemedButton
        title="Continue"
        onPress={handleLogin}
        disabled={!values.phone || isLoading}
        loading={isLoading}
        loadingText="Sending code..."
      />
    </ThemedView>
  );
}

import { COLORS, SPACING } from '@/constants/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  errorText: {
    color: COLORS.danger,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
});
