import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/design';
import { useReminderStore, useMedicationStore } from '../../store';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RemindersScreen() {
  const { t } = useTranslation();
  const { medications } = useMedicationStore();
  const { reminders, toggleReminder, deleteReminder, markAsTaken } = useReminderStore();

  const sortedReminders = useMemo(
    () =>
      [...reminders].sort((a, b) => {
        if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
        return a.time.localeCompare(b.time);
      }),
    [reminders]
  );

  const medName = (medicationId: string) =>
    medications.find((m) => m.id === medicationId)?.name || medicationId;

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

      <View style={styles.statsRow}>
        <View style={styles.statBadge}>
          <Text style={styles.statValue}>{reminders.filter((r) => r.enabled).length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statValue}>{reminders.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {sortedReminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alarm-outline" size={36} color={Colors.textLight} />
          <Text style={styles.emptyText}>No reminders yet</Text>
          <Text style={styles.emptySubtext}>Add a medication first, then set reminders.</Text>
        </View>
      ) : (
        <FlatList
          data={sortedReminders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.reminderCard, !item.enabled && styles.reminderCardDisabled]}>
              <View style={styles.reminderLeft}>
                <TouchableOpacity onPress={() => toggleReminder(item.id)}>
                  <Ionicons
                    name={item.enabled ? 'notifications' : 'notifications-off-outline'}
                    size={20}
                    color={item.enabled ? Colors.primary : Colors.textLight}
                  />
                </TouchableOpacity>
                <View style={[styles.dot, { backgroundColor: item.enabled ? Colors.success : Colors.textLight }]} />
                <View style={styles.reminderInfo}>
                  <Text style={[styles.reminderTitle, !item.enabled && styles.textMuted]}>
                    {item.title || medName(item.medicationId)}
                  </Text>
                  <Text style={styles.reminderTime}>
                    <Ionicons name="time-outline" size={12} color={Colors.textSecondary} /> {item.time}
                  </Text>
                  {item.days.length > 0 && (
                    <Text style={styles.reminderDays}>
                      {item.days.sort().map((d) => DAY_NAMES[d]).join(', ')}
                    </Text>
                  )}
                  {item.lastTaken && (
                    <Text style={styles.lastTaken}>
                      Last taken: {new Date(item.lastTaken).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.reminderActions}>
                {item.enabled && (
                  <TouchableOpacity style={styles.takenButton} onPress={() => markAsTaken(item.id)}>
                    <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => {
                  Alert.alert('Delete Reminder', `Remove reminder for ${item.title || medName(item.medicationId)}?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteReminder(item.id) },
                  ]);
                }}>
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.footerTip}>
        <Ionicons name="bulb-outline" size={16} color={Colors.accentDark} />
        <Text style={styles.footerTipText}>Tip: Pair reminders with meals for better consistency.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.md },
  headerCard: {
    marginTop: Spacing.sm, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Shadows.sm,
  },
  title: { ...Typography.fontSize.xl, ...Typography.fontWeight.bold, color: Colors.text, marginBottom: 4 },
  subtitle: { ...Typography.fontSize.sm, color: Colors.textSecondary },
  bellCircle: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.infoLight },
  statsRow: { flexDirection: 'row', gap: 8, marginVertical: Spacing.md },
  statBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  statValue: { ...Typography.fontSize.lg, ...Typography.fontWeight.bold, color: Colors.text },
  statLabel: { ...Typography.fontSize.xs, color: Colors.textSecondary },
  list: { paddingBottom: 110 },
  reminderCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, borderWidth: 1,
    borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.sm,
  },
  reminderCardDisabled: { opacity: 0.6 },
  reminderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  reminderInfo: { flex: 1 },
  reminderTitle: { ...Typography.fontSize.md, ...Typography.fontWeight.semibold, color: Colors.text, marginBottom: 2 },
  reminderTime: { ...Typography.fontSize.xs, color: Colors.textSecondary },
  reminderDays: { ...Typography.fontSize.xs, color: Colors.primary, marginTop: 2 },
  lastTaken: { ...Typography.fontSize.xs, color: Colors.success, marginTop: 2 },
  textMuted: { color: Colors.textLight },
  reminderActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  takenButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyText: { ...Typography.fontSize.lg, ...Typography.fontWeight.semibold, color: Colors.text },
  emptySubtext: { ...Typography.fontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
  footerTip: {
    marginTop: 'auto', marginBottom: 94, backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.lg, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  footerTipText: { flex: 1, ...Typography.fontSize.sm, color: Colors.accentDark },
});
