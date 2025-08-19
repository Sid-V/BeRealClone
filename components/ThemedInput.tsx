import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

interface ThemedInputProps extends TextInputProps {
  hasError?: boolean;
  label?: string;
}

export function ThemedInput({ hasError, style, ...props }: ThemedInputProps) {
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor: hasError ? '#ff3b30' : '#ccc',
          backgroundColor: useThemeColor({}, 'background'),
          color: textColor,
        },
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
});
