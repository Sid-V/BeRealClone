import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  loadingText?: string;
}

export function ThemedButton({ 
  title, 
  variant = 'primary', 
  loading = false, 
  loadingText,
  style,
  disabled,
  ...props 
}: ThemedButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'danger':
        return styles.dangerButton;
      case 'secondary':
        return styles.secondaryButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      default:
        return styles.primaryText;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      <ThemedText style={getTextStyle()}>
        {loading ? (loadingText || 'Loading...') : title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  dangerButton: {
    backgroundColor: '#ff3b30',
  },
  disabled: {
    opacity: 0.6,
  },
  primaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
