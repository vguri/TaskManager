import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useTaskContext } from '../context/TaskContext';
import { DeletedTask } from '../types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

function DeletedTaskRow({ item, onRestore, onDelete }: {
  item: DeletedTask;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const handleDelete = () => {
    Alert.alert(
      'Delete permanently?',
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
      ]
    );
  };

  return (
    <View style={styles.row}>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.rowMeta}>Deleted {timeAgo(item.deletedAt)}</Text>
      </View>
      <View style={styles.rowActions}>
        <Pressable
          style={styles.restoreBtn}
          onPress={() => onRestore(item.id)}
          hitSlop={6}
        >
          <Ionicons name="arrow-undo" size={16} color={Colors.primary} />
          <Text style={styles.restoreText}>Restore</Text>
        </Pressable>
        <Pressable onPress={handleDelete} hitSlop={6} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

export function RecentlyDeletedScreen() {
  const { deletedTasks, restoreTask, permanentlyDeleteTask } = useTaskContext();

  const handleClearAll = () => {
    Alert.alert(
      'Clear all?',
      'All deleted tasks will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear all',
          style: 'destructive',
          onPress: () => deletedTasks.forEach(t => permanentlyDeleteTask(t.id)),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {deletedTasks.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="trash-outline" size={36} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Trash is empty</Text>
          <Text style={styles.emptySubtitle}>Deleted tasks stay here for 30 days</Text>
        </View>
      ) : (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {deletedTasks.length} deleted task{deletedTasks.length !== 1 ? 's' : ''}
            </Text>
            <Pressable onPress={handleClearAll}>
              <Text style={styles.clearAll}>Clear all</Text>
            </Pressable>
          </View>
          <FlatList
            data={deletedTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <DeletedTaskRow
                item={item}
                onRestore={restoreTask}
                onDelete={permanentlyDeleteTask}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listHeaderText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  clearAll: {
    fontSize: 13,
    color: Colors.danger,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },
  row: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  rowMeta: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  restoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  deleteBtn: {
    padding: 4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
