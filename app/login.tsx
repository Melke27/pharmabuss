import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/design';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await login(email.trim(), password.trim());
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="medkit" size={36} color={Colors.textOnPrimary} />
          </View>
          <Text style={styles.appName}>PPT Care</Text>
          <Text style={styles.tagline}>Sign in to manage your health</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Login</Text>

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
            secureTextEntry
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.loginButton, (!email.trim() || !password.trim()) && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading || !email.trim() || !password.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textOnPrimary} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link href="/register">
              <Text style={styles.signupLinkText}>Sign Up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  headerSection: { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  appName: { ...Typography.fontSize.xxl, ...Typography.fontWeight.bold, color: Colors.text },
  tagline: { ...Typography.fontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs },
  formCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, borderWidth: 1,
    borderColor: Colors.border, padding: Spacing.lg, ...Shadows.md,
  },
  formTitle: { ...Typography.fontSize.xl, ...Typography.fontWeight.bold, color: Colors.text, marginBottom: Spacing.lg },
  inputLabel: { ...Typography.fontSize.sm, ...Typography.fontWeight.medium, color: Colors.text, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: Spacing.md, ...Typography.fontSize.md, color: Colors.text,
  },
  errorText: { color: Colors.error, ...Typography.fontSize.sm, marginBottom: Spacing.sm },
  loginButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingVertical: Spacing.md,
    alignItems: 'center', marginTop: Spacing.sm,
  },
  disabledButton: { opacity: 0.55 },
  loginButtonText: { ...Typography.fontSize.md, ...Typography.fontWeight.semibold, color: Colors.textOnPrimary },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  signupText: { ...Typography.fontSize.sm, color: Colors.textSecondary },
  signupLinkText: { ...Typography.fontSize.sm, ...Typography.fontWeight.semibold, color: Colors.primary },
});
