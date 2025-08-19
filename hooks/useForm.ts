import { useState } from 'react';

interface UseFormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isLoading: boolean;
  setValue: (field: keyof T, value: string) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export function useForm<T extends Record<string, string>>(
  initialValues: T
): UseFormState<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const setValue = (field: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      clearError(field);
    }
  };

  const setError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const clearError = (field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsLoading(false);
  };

  return {
    values,
    errors,
    isLoading,
    setValue,
    setError,
    clearError,
    clearAllErrors,
    setLoading,
    reset,
  };
}
