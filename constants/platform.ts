// Platform-specific constants

import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

export const PlatformConstants = {
  statusBarHeight: isIOS ? 44 : 24,
  tabBarHeight: 56,
  headerHeight: isIOS ? 88 : 56,
  bottomPadding: isIOS ? 34 : 0,
};

export const KeyboardBehavior = {
  ios: 'padding' as const,
  android: 'height' as const,
};
