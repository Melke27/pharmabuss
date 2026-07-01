import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/design';

type TaskStatus = 'pending' | 'completed';
type Task = {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
};

const initialTasks: Task[] = [
  { id: 't1', title: 'Review blood pressure log', category: 'Health', priority: 'high', status: 'pending' },
  { id: 't2', title: 'Refill metformin', category: 'Medication', priority: 'medium', status: 'pending' },
  { id: 't3', title: 'Walk 30 minutes', category: 'Lifestyle', priority: 'low', status: 'completed' },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskStatus>('pending');
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status === filter && task.title.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [tasks, filter, search]
  );

  const completeTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status: 'completed' } : task)));
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Your Tasks</Text>
        <Text style={styles.subtitle}>Simple daily checklist to stay consistent.</Text>
      </View>

      <View style={styles.controls}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search tasks..."
          placeholderTextColor={Colors.textLight}
          style={styles.searchInput}
        />

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>Completed</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-done-circle-outline" size={30} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No tasks found</Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskMain}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.taskMeta}>{task.category}</Text>
                  <Text style={[styles.taskMeta, task.priority === 'high' && styles.priorityHigh]}>
                    {task.priority.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                {task.status === 'pending' && (
                  <TouchableOpacity style={styles.iconButton} onPress={() => completeTask(task.id)}>
                    <Ionicons name="checkmark" size={16} color={Colors.success} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.iconButton} onPress={() => removeTask(task.id)}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
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
    paddingHorizontal: Spacing.md,
  },
  headerCard: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
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
  controls: {
    marginBottom: Spacing.md,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.fontSize.md,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.fontSize.sm,
    ...Typography.fontWeight.semibold,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.textOnPrimary,
  },
  list: {
    paddingBottom: 110,
    gap: 8,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    ...Typography.fontSize.md,
    color: Colors.textSecondary,
  },
  taskCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskMain: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  taskTitle: {
    ...Typography.fontSize.md,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  taskMeta: {
    ...Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  priorityHigh: {
    color: Colors.error,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
