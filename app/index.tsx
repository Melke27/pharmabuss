import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/design';
import { useUserStore } from '../store';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="medkit" size={48} color={Colors.textOnPrimary} />
          </View>
          <Text style={styles.appName}>PPT Care</Text>
          <Text style={styles.tagline}>Smart care for NCD patients</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Ionicons name="medkit-outline" size={22} color={Colors.primary} />
            <Text style={styles.featureText}>Track medications & reminders</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="chatbubble-ellipses" size={22} color={Colors.primary} />
            <Text style={styles.featureText}>Consult with pharmacists</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="walk" size={22} color={Colors.primary} />
            <Text style={styles.featureText}>Personalized exercise & diet</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="language" size={22} color={Colors.primary} />
            <Text style={styles.featureText}>5 languages supported</Text>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.lg },
  logoSection: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  appName: { ...Typography.fontSize.xxxl, ...Typography.fontWeight.bold, color: Colors.text },
  tagline: { ...Typography.fontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs },
  features: { marginBottom: Spacing.xxl, paddingHorizontal: Spacing.md },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.md,
  },
  featureText: { ...Typography.fontSize.md, color: Colors.text, flex: 1 },
  buttonSection: { gap: Spacing.sm },
  primaryButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: { ...Typography.fontSize.lg, ...Typography.fontWeight.semibold, color: Colors.textOnPrimary },
  secondaryButton: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingVertical: Spacing.md,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.primary,
  },
  secondaryButtonText: { ...Typography.fontSize.lg, ...Typography.fontWeight.semibold, color: Colors.primary },
});
