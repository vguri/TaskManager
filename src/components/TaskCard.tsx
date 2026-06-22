import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Task } from '../types';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TaskCard({ task, onToggle, onDelete, onPress }: Props) {
  const isCompleted = task.status === 'completed';

  const confirmDelete = () => {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
    ]);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(task.id)}
    >
      <View style={[styles.accent, isCompleted && styles.accentDone]} />

      <Pressable onPress={() => onToggle(task.id)} hitSlop={6} style={styles.checkboxArea}>
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={23}
          color={isCompleted ? Colors.success : Colors.border}
        />
      </Pressable>

      <View style={styles.body}>
        <Text style={[styles.title, isCompleted && styles.titleDone]} numberOfLines={1}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        <Text style={styles.date}>{formatDate(task.createdAt)}</Text>
      </View>

      <Pressable onPress={confirmDelete} hitSlop={8} style={styles.trashBtn}>
        <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  accent: {
    width: 4,
    backgroundColor: Colors.primary,
  },
  accentDone: {
    backgroundColor: Colors.success,
  },
  checkboxArea: {
    paddingLeft: 14,
    paddingRight: 10,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  body: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 8,
  },
  date: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  trashBtn: {
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
});
