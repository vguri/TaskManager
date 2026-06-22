import { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { RootStackParamList, FilterType } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { useQuote } from '../hooks/useQuote';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { SearchBar } from '../components/SearchBar';
import { FilterTabs } from '../components/FilterTabs';
import { QuoteCard } from '../components/QuoteCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function HomeScreen({ navigation }: Props) {
  const { tasks, toggleTask, deleteTask } = useTaskContext();
  const { quote, loading: quoteLoading, index: quoteIndex, total: quoteTotal, advance: advanceQuote } = useQuote();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const counts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filter !== 'all') result = result.filter(t => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }
    return result;
  }, [tasks, filter, search]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Tasks</Text>
            <Text style={styles.dateLabel}>{getTodayLabel()}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statNumber}>{counts.active}</Text>
              <Text style={styles.statLabel}>active</Text>
            </View>
            <View style={[styles.statPill, styles.statPillDone]}>
              <Text style={[styles.statNumber, styles.statNumberDone]}>{counts.completed}</Text>
              <Text style={[styles.statLabel, styles.statLabelDone]}>done</Text>
            </View>
          </View>
        </View>

        <QuoteCard
          quote={quote}
          loading={quoteLoading}
          index={quoteIndex}
          total={quoteTotal}
          onAdvance={advanceQuote}
        />
        <SearchBar value={search} onChangeText={setSearch} />
        <FilterTabs active={filter} onChange={setFilter} counts={counts} />

        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onPress={id => navigation.navigate('TaskDetail', { taskId: id })}
            />
          )}
          ListEmptyComponent={
            <EmptyState filter={filter} hasSearch={search.length > 0} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredTasks.length === 0 ? styles.emptyContent : styles.listContent
          }
        />
      </View>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  dateLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 52,
  },
  statPillDone: {
    backgroundColor: Colors.successLight,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 22,
  },
  statNumberDone: {
    color: Colors.success,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statLabelDone: {
    color: Colors.success,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContent: {
    flex: 1,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
});
