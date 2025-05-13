import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const { phoneNumber, logout } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome to BeReal Clone</ThemedText>
      <ThemedText style={styles.phoneNumber}>
        Logged in as: {phoneNumber}
      </ThemedText>
      <ThemedText style={styles.description}>
        Your daily photo reminder will appear here!
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneNumber: {
    marginTop: 10,
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
  },
});
