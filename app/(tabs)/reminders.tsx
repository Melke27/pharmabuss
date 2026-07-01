import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/design';

const mockReminders = [
  { id: 'r1', title: 'Morning Medication', time: '08:00 AM', status: 'upcoming' },
  { id: 'r2', title: 'After Lunch Dose', time: '01:00 PM', status: 'upcoming' },
  { id: 'r3', title: 'Evening Medication', time: '08:30 PM', status: 'scheduled' },
];

export default function RemindersScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.title}>{t('reminders.title')}</Text>
          <Text style={styles.subtitle}>Stay on track. Never miss a dose.</Text>
        </View>
        <View style={styles.bellCircle}>
          <Ionicons name="notifications" size={22} color={Colors.primary} />
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryButton}>
          <Ionicons name="add-circle" size={18} color={Colors.textOnPrimary} />
          <Text style={styles.primaryButtonText}>Create Reminder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timelineSection}>
        {mockReminders.map((reminder, index) => (
          <View key={reminder.id} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, reminder.status === 'upcoming' && styles.timelineDotUpcoming]} />
              {index !== mockReminders.length - 1 && <View style={styles.timelineLine} />}
            </View>

            <View style={styles.reminderCard}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <View style={styles.reminderMeta}>
                <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.reminderTime}>{reminder.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footerTip}>
        <Ionicons name="bulb-outline" size={16} color={Colors.accentDark} />
        <Text style={styles.footerTipText}>Tip: Pair reminders with meals for better consistency.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
  },
  headerCard: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.sm,
  },
  title: {
    ...Typography.fontSize.xl,
    ...Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  bellCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.infoLight,
  },
  actionRow: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
  },
  primaryButtonText: {
    ...Typography.fontSize.sm,
    ...Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  timelineSection: {
    marginTop: Spacing.sm,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.textLight,
    marginTop: 18,
  },
  timelineDotUpcoming: {
    backgroundColor: Colors.success,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    backgroundColor: Colors.divider,
  },
  reminderCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  reminderTitle: {
    ...Typography.fontSize.md,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reminderTime: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  footerTip: {
    marginTop: 'auto',
    marginBottom: 94,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerTipText: {
    flex: 1,
    ...Typography.fontSize.sm,
    color: Colors.accentDark,
  },
});
