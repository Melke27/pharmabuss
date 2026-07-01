// Unified design tokens inspired by POLY CARE presentation style

export const Colors = {
  primary: '#1D4FA3',
  primaryDark: '#153C7F',
  primaryLight: '#2D6BCA',
  secondary: '#43B02A',
  secondaryDark: '#328720',
  secondaryLight: '#6DC95A',
  accent: '#F28B22',
  accentDark: '#D56E0A',
  accentSoft: '#FFE7CC',

  background: '#F3F6FB',
  backgroundSoft: '#EAF0FA',
  surface: '#FFFFFF',
  surfaceVariant: '#E8EEF8',

  text: '#102A4D',
  textSecondary: '#4E6483',
  textLight: '#8495AD',
  textOnPrimary: '#FFFFFF',

  error: '#D13A3A',
  errorLight: '#FCE9E9',
  warning: '#D9871A',
  warningLight: '#FFF1DE',
  success: '#2F9E44',
  successLight: '#E7F7EA',
  info: '#2B72E4',
  infoLight: '#E9F1FF',

  border: '#D4DEEE',
  divider: '#E2E9F5',

  interaction: {
    contraindicated: '#D13A3A',
    major: '#E26D2B',
    moderate: '#E9A133',
    minor: '#3DA05A',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  fontSize: {
    xs: { fontSize: 12 },
    sm: { fontSize: 14 },
    md: { fontSize: 16 },
    lg: { fontSize: 18 },
    xl: { fontSize: 22 },
    xxl: { fontSize: 28 },
    xxxl: { fontSize: 34 },
  },
  fontWeight: {
    normal: { fontWeight: '400' as const },
    medium: { fontWeight: '500' as const },
    semibold: { fontWeight: '600' as const },
    bold: { fontWeight: '700' as const },
  },
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#102A4D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#102A4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  lg: {
    shadowColor: '#102A4D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
};

export const Opacity = {
  disabled: 0.45,
  pressed: 0.82,
  hover: 0.9,
};

// Backward-compatible lowercase tokens used in some screens
export const colors = {
  primary: Colors.primary,
  primaryForeground: Colors.textOnPrimary,
  secondary: Colors.surface,
  secondaryForeground: Colors.text,
  accent: Colors.accent,
  accentForeground: Colors.textOnPrimary,
  background: Colors.background,
  surface: Colors.surface,
  border: Colors.border,
  text: Colors.text,
  textSecondary: Colors.textSecondary,
  textTertiary: Colors.textLight,
  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
};
