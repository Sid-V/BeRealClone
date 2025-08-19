export const COLORS = {
  primary: '#0a7ea4',
  danger: '#ff3b30',
  border: '#ccc',
  placeholder: '#666',
  white: '#ffffff',
  black: '#000000',
} as const;

export const SPACING = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

export const FONT_SIZE = {
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
} as const;

export const OTP_CONFIG = {
  length: 4,
  validationRegex: /^\d{4}$/,
} as const;

export const PHONE_CONFIG = {
  minLength: 10,
  maxLength: 15,
  defaultCountryCode: '+1',
} as const;
