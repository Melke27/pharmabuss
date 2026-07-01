import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMedicationStore } from '../../store';
import { useTranslation } from '../../hooks';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/design';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { medications } = useMedicationStore();

  const safeMedications = Array.isArray(medications) ? medications : [];
  const activeMedications = safeMedications.filter((m) => m?.status === 'active');
  const highPriorityCount = safeMedications.filter((m) =>
    String(m?.frequency ?? '').toLowerCase().includes('day')
  ).length;

  const quickCards = [
    {
      id: 'exercise',
      title: 'Exercise & Diet',
      subtitle: 'Personalized habits',
      icon: 'walk',
      color: Colors.secondary,
      onPress: () => router.push('/(tabs)/habits'),
    },
    {
      id: 'consult',
      title: 'Clinical Consult',
      subtitle: 'Talk to a pharmacist',
      icon: 'chatbubble-ellipses',
      color: '#7C5FE6',
      onPress: () => router.push('/(tabs)/consultation'),
    },
    {
      id: 'drug-locator',
      title: 'Drug Locator',
      subtitle: 'Find nearby medicine',
      icon: 'location',
      color: Colors.info,
      onPress: () => router.push('/(tabs)/consultation'),
    },
    {
      id: 'education',
      title: 'Smart Education',
      subtitle: 'Voice-friendly guidance',
      icon: 'megaphone',
      color: Colors.accent,
      onPress: () => router.push('/(tabs)/profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.brandPill}>
              <Ionicons name="star" size={14} color={Colors.primary} />
              <Text style={styles.brandPillText}>POLY CARE</Text>
            </View>
            <TouchableOpacity style={styles.notifyButton}>
              <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
          <Text style={styles.subtitleText}>Smart. Personal. Complete care for NCD patients.</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeMedications.length}</Text>
              <Text style={styles.statLabel}>Active Meds</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{highPriorityCount}</Text>
              <Text style={styles.statLabel}>Daily Doses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Adherence Goal</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          <Text style={styles.sectionHint}>Personalized tools</Text>
        </View>

        <View style={styles.actionsGrid}>
          {quickCards.map((card) => (
            <TouchableOpacity key={card.id} style={styles.actionCard} onPress={card.onPress} activeOpacity={0.9}>
              <View style={[styles.actionIconWrap, { backgroundColor: card.color }]}>
                <Ionicons name={card.icon as any} size={20} color={Colors.textOnPrimary} />
              </View>
              <Text style={styles.actionTitle}>{card.title}</Text>
              <Text style={styles.actionSubtitle}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Focus</Text>
        </View>

        <View style={styles.focusCard}>
          <View style={styles.focusRow}>
            <View style={[styles.focusIconWrap, { backgroundColor: Colors.warningLight }]}>
              <Ionicons name="alarm" size={18} color={Colors.accentDark} />
            </View>
            <View style={styles.focusTextWrap}>
              <Text style={styles.focusTitle}>{t('home.todayReminders')}</Text>
              <Text style={styles.focusSubtitle}>Keep your medication timing consistent for better control.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.focusButton} onPress={() => router.push('/(tabs)/reminders')}>
            <Text style={styles.focusButtonText}>Open Reminders</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/medications')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {activeMedications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="medkit-outline" size={26} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No medications yet</Text>
            <Text style={styles.emptySubtext}>Add your first medication to start reminders and tracking.</Text>
          </View>
        ) : (
          activeMedications.slice(0, 3).map((medication) => (
            <View key={medication.id} style={styles.medicationCard}>
              <View style={styles.medicationBadge}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                <Text style={styles.medicationBadgeText}>Active</Text>
              </View>
              <Text style={styles.medicationName}>{medication.name}</Text>
              <Text style={styles.medicationDetails}>
                {medication.dosage ?? '-'} {medication.unit ?? ''} • {medication.frequency ?? '-'}
              </Text>
            </View>
          ))
        )}
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
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#DCE8FD',
  },
  brandPillText: {
    ...Typography.fontSize.xs,
    ...Typography.fontWeight.bold,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  notifyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  welcomeText: {
    ...Typography.fontSize.xxl,
    ...Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    ...Typography.fontSize.md,
    color: '#DCE8FD',
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#255CB9',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.fontSize.lg,
    ...Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
  },
  statLabel: {
    ...Typography.fontSize.xs,
    color: '#D7E4FB',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#4E7FCE',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.fontSize.xl,
    ...Typography.fontWeight.bold,
    color: Colors.text,
  },
  sectionHint: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    ...Typography.fontSize.md,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 3,
  },
  actionSubtitle: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  focusCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  focusIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  focusTextWrap: {
    flex: 1,
  },
  focusTitle: {
    ...Typography.fontSize.md,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  focusSubtitle: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  focusButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  focusButtonText: {
    ...Typography.fontSize.sm,
    ...Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  viewAllText: {
    ...Typography.fontSize.sm,
    ...Typography.fontWeight.semibold,
    color: Colors.primary,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.fontSize.lg,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  medicationCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  medicationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.successLight,
    marginBottom: Spacing.sm,
  },
  medicationBadgeText: {
    ...Typography.fontSize.xs,
    ...Typography.fontWeight.semibold,
    color: Colors.success,
  },
  medicationName: {
    ...Typography.fontSize.md,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  medicationDetails: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});
