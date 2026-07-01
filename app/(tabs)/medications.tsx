import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMedicationStore } from '../../store';
import { useTranslation } from '../../hooks';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/design';
import { Medication } from '../../types';

export default function MedicationsScreen() {
  const { t } = useTranslation();
  const { medications, deleteMedication } = useMedicationStore();

  const activeMedications = medications.filter((m) => m.status === 'active');

  const renderMedication = ({ item }: { item: Medication }) => (
    <View style={styles.medicationCard}>
      <View style={styles.cardTopRow}>
        <View style={styles.medicationInfo}>
          <Text style={styles.medicationName}>{item.name}</Text>
          {!!item.genericName && <Text style={styles.medicationGeneric}>{item.genericName}</Text>}
        </View>
        <TouchableOpacity
          onPress={() => deleteMedication(item.id)}
          style={styles.deleteButton}
          accessibilityLabel={`Delete ${item.name}`}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Ionicons name="flask" size={13} color={Colors.primary} />
          <Text style={styles.metaChipText}>{item.dosage} {item.unit}</Text>
        </View>
        <View style={[styles.metaChip, styles.metaChipBlue]}>
          <Ionicons name="time-outline" size={13} color={Colors.primary} />
          <Text style={styles.metaChipText}>{item.frequency}</Text>
        </View>
      </View>

      {!!item.instructions && (
        <View style={styles.instructionsRow}>
          <Ionicons name="information-circle-outline" size={15} color={Colors.textSecondary} />
          <Text style={styles.instructionsText}>{item.instructions}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.title}>{t('medications.title')}</Text>
          <Text style={styles.subtitle}>Track dose, frequency, and instruction clarity.</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeValue}>{activeMedications.length}</Text>
          <Text style={styles.countBadgeLabel}>Active</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.9}>
          <Ionicons name="add-circle" size={18} color={Colors.textOnPrimary} />
          <Text style={styles.actionButtonText}>{t('medications.addMedication')}</Text>
        </TouchableOpacity>
      </View>

      {activeMedications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="medkit-outline" size={36} color={Colors.primary} />
          </View>
          <Text style={styles.emptyText}>No medications added yet</Text>
          <Text style={styles.emptySubtext}>Tap add medication to build your treatment plan.</Text>
        </View>
      ) : (
        <FlatList
          data={activeMedications}
          renderItem={renderMedication}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.md,
  },
  title: {
    ...Typography.fontSize.xl,
    ...Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.fontSize.sm,
    color: '#DDE8FD',
    maxWidth: 220,
  },
  countBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#255CB9',
  },
  countBadgeValue: {
    ...Typography.fontSize.xxl,
    ...Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
    lineHeight: 30,
  },
  countBadgeLabel: {
    ...Typography.fontSize.xs,
    color: '#D7E4FB',
  },
  actionRow: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  actionButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    ...Typography.fontSize.sm,
    ...Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  list: {
    paddingTop: Spacing.sm,
    paddingBottom: 120,
  },
  medicationCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  medicationInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  medicationName: {
    ...Typography.fontSize.lg,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  medicationGeneric: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.errorLight,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#E9F1FF',
  },
  metaChipBlue: {
    backgroundColor: '#ECF6FF',
  },
  metaChipText: {
    ...Typography.fontSize.xs,
    ...Typography.fontWeight.medium,
    color: Colors.primary,
  },
  instructionsRow: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  instructionsText: {
    flex: 1,
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.infoLight,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.fontSize.lg,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
