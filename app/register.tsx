import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/design';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useUserStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert('Error', 'Name and password are required');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    try {
      await register({
        name: name.trim(),
        email: email.trim() || undefined,
        password: password.trim(),
        phone: phone.trim() || undefined,
      });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="medkit" size={36} color={Colors.textOnPrimary} />
          </View>
          <Text style={styles.appName}>Create Account</Text>
          <Text style={styles.tagline}>Join PPT Care to manage your medications</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            value={name} onChangeText={setName}
            placeholder="Your name" placeholderTextColor={Colors.textLight}
            style={styles.input}
          />

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            value={email} onChangeText={setEmail}
            placeholder="your@email.com" placeholderTextColor={Colors.textLight}
            style={styles.input} keyboardType="email-address" autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Phone</Text>
          <TextInput
            value={phone} onChangeText={setPhone}
            placeholder="+251..." placeholderTextColor={Colors.textLight}
            style={styles.input} keyboardType="phone-pad"
          />

          <Text style={styles.inputLabel}>Password *</Text>
          <TextInput
            value={password} onChangeText={setPassword}
            placeholder="At least 6 characters" placeholderTextColor={Colors.textLight}
            style={styles.input} secureTextEntry
          />

          <TouchableOpacity
            style={[styles.registerButton, (!name.trim() || !password.trim()) && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading || !name.trim() || !password.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textOnPrimary} />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/login">
              <Text style={styles.loginLinkText}>Sign In</Text>
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
  inputLabel: { ...Typography.fontSize.sm, ...Typography.fontWeight.medium, color: Colors.text, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: Spacing.md, ...Typography.fontSize.md, color: Colors.text,
  },
  registerButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingVertical: Spacing.md,
    alignItems: 'center', marginTop: Spacing.sm,
  },
  disabledButton: { opacity: 0.55 },
  registerButtonText: { ...Typography.fontSize.md, ...Typography.fontWeight.semibold, color: Colors.textOnPrimary },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  loginText: { ...Typography.fontSize.sm, color: Colors.textSecondary },
  loginLinkText: { ...Typography.fontSize.sm, ...Typography.fontWeight.semibold, color: Colors.primary },
});
