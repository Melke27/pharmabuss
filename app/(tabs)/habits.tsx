import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/design';

type Habit = {
  id: string;
  name: string;
  description: string;
  streak: number;
  doneToday: boolean;
};

type Goal = {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
};

const initialHabits: Habit[] = [
  {
    id: 'h1',
    name: 'Morning Walk',
    description: '30 minutes after breakfast',
    streak: 6,
    doneToday: false,
  },
  {
    id: 'h2',
    name: 'Low-salt Meal',
    description: 'Choose low sodium food options',
    streak: 4,
    doneToday: true,
  },
];

const initialGoals: Goal[] = [
  { id: 'g1', title: 'Weekly Exercise', current: 95, target: 150, unit: 'min' },
  { id: 'g2', title: 'Water Intake', current: 1.5, target: 2.5, unit: 'L' },
];

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  const markDone = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id && !habit.doneToday
          ? { ...habit, doneToday: true, streak: habit.streak + 1 }
          : habit
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>Habits & Goals</Text>
          <Text style={styles.subtitle}>Small actions every day build long-term health.</Text>
        </View>

        <Text style={styles.sectionTitle}>Daily Habits</Text>
        <View style={styles.sectionList}>
          {habits.map((habit) => (
            <View key={habit.id} style={styles.habitCard}>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitDescription}>{habit.description}</Text>
                <View style={styles.streakRow}>
                  <Ionicons name="flame" size={14} color={Colors.accentDark} />
                  <Text style={styles.streakText}>{habit.streak} day streak</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.doneButton, habit.doneToday && styles.doneButtonCompleted]}
                onPress={() => markDone(habit.id)}
                disabled={habit.doneToday}
              >
                <Ionicons
                  name={habit.doneToday ? 'checkmark-circle' : 'checkmark'}
                  size={20}
                  color={Colors.textOnPrimary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Long-term Goals</Text>
        <View style={styles.sectionList}>
          {initialGoals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalPercent}>{Math.round(progress)}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <View style={styles.goalMetaRow}>
                  <Text style={styles.goalMeta}>{goal.current} {goal.unit}</Text>
                  <Text style={styles.goalMeta}>{goal.target} {goal.unit}</Text>
                </View>
              </View>
            );
          })}
        </View>
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
  sectionTitle: {
    ...Typography.fontSize.lg,
    ...Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionList: {
    marginBottom: Spacing.lg,
    gap: 8,
  },
  habitCard: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  habitInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  habitName: {
    ...Typography.fontSize.md,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 3,
  },
  habitDescription: {
    ...Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    ...Typography.fontSize.xs,
    ...Typography.fontWeight.medium,
    color: Colors.accentDark,
  },
  doneButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonCompleted: {
    backgroundColor: Colors.success,
  },
  goalCard: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  goalTitle: {
    ...Typography.fontSize.md,
    ...Typography.fontWeight.semibold,
    color: Colors.text,
  },
  goalPercent: {
    ...Typography.fontSize.sm,
    ...Typography.fontWeight.bold,
    color: Colors.primary,
  },
  progressTrack: {
    height: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceVariant,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  goalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalMeta: {
    ...Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});
