import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { useTaskContext } from '../context/TaskContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TaskDetailScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  const { getTaskById, toggleTask, deleteTask } = useTaskContext();
  const task = getTaskById(taskId);

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={52} color={Colors.textMuted} />
        <Text style={styles.notFoundText}>Task not found</Text>
      </View>
    );
  }

  const isCompleted = task.status === 'completed';

  const handleDelete = () => {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.statusChip, isCompleted ? styles.chipDone : styles.chipActive]}>
        <View style={[styles.chipDot, isCompleted ? styles.dotDone : styles.dotActive]} />
        <Text style={[styles.chipText, isCompleted ? styles.chipTextDone : styles.chipTextActive]}>
          {isCompleted ? 'Completed' : 'Active'}
        </Text>
      </View>

      <Text style={[styles.title, isCompleted && styles.titleDone]}>
        {task.title}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Description</Text>
        <Text style={styles.cardBody}>
          {task.description || 'No description provided.'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Created on</Text>
        <Text style={styles.cardBody}>{formatDate(task.createdAt)}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.toggleBtn, pressed && styles.btnPressed]}
          onPress={() => toggleTask(task.id)}
        >
          <Ionicons
            name={isCompleted ? 'arrow-undo-outline' : 'checkmark-circle-outline'}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.btnText}>
            {isCompleted ? 'Mark as Active' : 'Mark as Complete'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.btn, styles.deleteBtn, pressed && styles.btnPressed]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          <Text style={[styles.btnText, styles.deleteBtnText]}>Delete Task</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 52,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
  },
  chipDone: {
    backgroundColor: Colors.successLight,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotDone: {
    backgroundColor: Colors.success,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.primary,
  },
  chipTextDone: {
    color: Colors.success,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 34,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
  },
  toggleBtn: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteBtn: {
    backgroundColor: Colors.dangerLight,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  btnPressed: {
    opacity: 0.8,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteBtnText: {
    color: Colors.danger,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.background,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
