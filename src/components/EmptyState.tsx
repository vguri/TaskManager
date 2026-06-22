import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { FilterType } from '../types';

interface Props {
  filter: FilterType;
  hasSearch: boolean;
}

function getContent(filter: FilterType, hasSearch: boolean): {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
} {
  if (hasSearch) {
    return {
      icon: 'search-outline',
      title: 'No results found',
      subtitle: 'Try searching for something else.',
    };
  }
  if (filter === 'completed') {
    return {
      icon: 'checkmark-done-outline',
      title: 'Nothing completed yet',
      subtitle: 'Finish a task and it will show up here.',
    };
  }
  if (filter === 'active') {
    return {
      icon: 'rocket-outline',
      title: "You're all caught up",
      subtitle: 'Add a new task to get started.',
    };
  }
  return {
    icon: 'clipboard-outline',
    title: 'No tasks yet',
    subtitle: 'Tap the + button to add your first task.',
  };
}

export function EmptyState({ filter, hasSearch }: Props) {
  const { icon, title, subtitle } = getContent(filter, hasSearch);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={36} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
