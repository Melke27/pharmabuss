import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/design';
import { useUserStore, useMedicationStore, useReminderStore } from '../store';
import { loadToken } from '../lib/api';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const loadStoredAuth = useUserStore((s) => s.loadStoredAuth);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const fetchMedications = useMedicationStore((s) => s.fetchMedications);
  const fetchReminders = useReminderStore((s) => s.fetchReminders);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadToken();
      await Promise.race([
        loadStoredAuth(),
        new Promise(resolve => setTimeout(resolve, 3000)),
      ]);
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMedications();
      fetchReminders();
    }
  }, [isAuthenticated]);

  const theme = {
    ...MD3LightTheme,
    roundness: 16,
    colors: {
      ...MD3LightTheme.colors,
      primary: Colors.primary,
      background: Colors.background,
      surface: Colors.surface,
      onSurface: Colors.text,
      onBackground: Colors.text,
    },
  };

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="+not-found"
          options={{ title: 'Not Found' }}
        />
      </Stack>
    </PaperProvider>
  );
}
