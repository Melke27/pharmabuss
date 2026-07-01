import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/design';
import { ConsultationService } from '../../services';

export default function ConsultationScreen() {
  const { t } = useTranslation();
  const pharmacists = ConsultationService.getAvailablePharmacists();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>{t('consultation.title')}</Text>
          <Text style={styles.subtitle}>Connect with licensed pharmacists anytime.</Text>

          <View style={styles.ctaRow}>
            <TouchableOpacity style={[styles.ctaButton, styles.chatButton]}>
              <Ionicons name="chatbubbles" size={18} color={Colors.textOnPrimary} />
              <Text style={styles.ctaButtonText}>{t('consultation.startChat')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.ctaButton, styles.videoButton]}>
              <Ionicons name="videocam" size={18} color={Colors.textOnPrimary} />
              <Text style={styles.ctaButtonText}>{t('consultation.scheduleVideo')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Pharmacists</Text>
          <Text style={styles.sectionSubtext}>{pharmacists.filter((p) => p.available).length} online</Text>
        </View>

        {pharmacists.map((pharmacist) => (
          <View key={pharmacist.id} style={styles.pharmacistCard}>
            <View style={styles.avatarWrap}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>

            <View style={styles.pharmacistInfo}>
              <Text style={styles.pharmacistName}>{pharmacist.name}</Text>
              <Text style={styles.pharmacistDetails}>
                {pharmacist.specialization} • Rating {pharmacist.rating}/5
              </Text>
              <Text style={styles.licenseText}>{pharmacist.licenseNumber}</Text>
            </View>

            <View style={[styles.statusBadge, pharmacist.available ? styles.available : styles.unavailable]}>
              <Text style={[styles.statusText, pharmacist.available ? styles.availableText : styles.unavailableText]}>
                {pharmacist.available ? 'Available' : 'Busy'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 110,
  },
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  title: {
    ...Typography.fontSize.xl,
    ...Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ctaButton: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  chatButton: {
    backgroundColor: Colors.primary,
  },
  videoButton: {
    backgroundColor: Colors.secondary,
  },
  ctaButtonText: {
    ...Typography.fontSize.sm,
    ...Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.fontSize.lg,
    ...Typography.fontWeight.bold,
    color: Colors.text,
  },
  sectionSubtext: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  pharmacistCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  pharmacistInfo: {
    flex: 1,
  },
  pharmacistName: {
    ...Typography.fontSize.md,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  pharmacistDetails: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  licenseText: {
    ...Typography.fontSize.xs,
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  available: {
    backgroundColor: Colors.successLight,
  },
  unavailable: {
    backgroundColor: Colors.warningLight,
  },
  statusText: {
    ...Typography.fontSize.xs,
    ...Typography.fontWeight.semibold,
  },
  availableText: {
    color: Colors.success,
  },
  unavailableText: {
    color: Colors.warning,
  },
});
