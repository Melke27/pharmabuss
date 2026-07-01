import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMedicationStore } from '../../store';
import { useTranslation } from '../../hooks';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/design';
import { Medication } from '../../types';
import AddMedicationModal from '../../components/AddMedicationModal';
import { DDIService } from '../../services/ddiService';
import InteractionCard from '../../components/InteractionCard';

export default function MedicationsScreen() {
  const { t } = useTranslation();
  const { medications, deleteMedication } = useMedicationStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editMed, setEditMed] = useState<Medication | undefined>(undefined);
  const [showInteractions, setShowInteractions] = useState(false);

  const activeMedications = medications.filter((m) => m.status === 'active');
  const interactions = showInteractions && activeMedications.length >= 2
    ? DDIService.checkDDI(activeMedications).interactions
    : [];

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Medication', `Remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMedication(id) },
    ]);
  };

  const handleEdit = (med: Medication) => {
    setEditMed(med);
    setModalVisible(true);
  };

  const renderMedication = ({ item }: { item: Medication }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => handleEdit(item)}>
      <View style={styles.medicationCard}>
        <View style={styles.cardTopRow}>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{item.name}</Text>
            {!!item.genericName && <Text style={styles.medicationGeneric}>{item.genericName}</Text>}
          </View>
          <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.deleteButton}>
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
            <Text style={styles.metaChipText}>{item.frequency.replace(/_/g, ' ')}</Text>
          </View>
        </View>
        {!!item.instructions && (
          <View style={styles.instructionsRow}>
            <Ionicons name="information-circle-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.instructionsText}>{item.instructions}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.9} onPress={() => { setEditMed(undefined); setModalVisible(true); }}>
          <Ionicons name="add-circle" size={18} color={Colors.textOnPrimary} />
          <Text style={styles.actionButtonText}>{t('medications.addMedication')}</Text>
        </TouchableOpacity>
      </View>

      {activeMedications.length >= 2 && (
        <TouchableOpacity style={styles.interactionToggle} onPress={() => setShowInteractions(!showInteractions)}>
          <Ionicons name="pulse-outline" size={16} color={interactions.length > 0 ? Colors.error : Colors.success} />
          <Text style={[styles.interactionToggleText, { color: interactions.length > 0 ? Colors.error : Colors.success }]}>
            {showInteractions ? 'Hide' : 'Check'} Drug Interactions ({activeMedications.length} meds)
          </Text>
        </TouchableOpacity>
      )}

      {showInteractions && interactions.length > 0 && (
        <View style={styles.interactionsSection}>
          <Text style={styles.interactionsTitle}>Drug Interactions Found</Text>
          {interactions.map((interaction, i) => (
            <InteractionCard key={i} interaction={{
              medications: `${medications.find(m => m.name.toLowerCase().includes(interaction.medication1Id.toLowerCase()))?.name || interaction.medication1Id} & ${medications.find(m => m.name.toLowerCase().includes(interaction.medication2Id.toLowerCase()))?.name || interaction.medication2Id}`,
              severity: interaction.severity,
              description: interaction.description,
              recommendation: interaction.recommendation,
            }} />
          ))}
        </View>
      )}

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
          ListHeaderComponent={null}
        />
      )}

      <AddMedicationModal visible={modalVisible} onClose={() => { setModalVisible(false); setEditMed(undefined); }} editMedication={editMed} />
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
  interactionToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: Spacing.sm, marginBottom: Spacing.xs,
  },
  interactionToggleText: { ...Typography.fontSize.sm, ...Typography.fontWeight.medium },
  interactionsSection: { marginBottom: Spacing.md },
  interactionsTitle: { ...Typography.fontSize.sm, ...Typography.fontWeight.semibold, color: Colors.textSecondary, marginBottom: Spacing.sm },
});
