import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { FilterType } from '../types';

interface Props {
  active: FilterType;
  onChange: (filter: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

const TABS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'completed' },
];

export function FilterTabs({ active, onChange, counts }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = active === tab.value;
        return (
          <Pressable
            key={tab.value}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onChange(tab.value)}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
            <View style={[styles.countPill, isActive && styles.activeCountPill]}>
              <Text style={[styles.countText, isActive && styles.activeCountText]}>
                {counts[tab.value]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    padding: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 9,
    gap: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  countPill: {
    backgroundColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  activeCountPill: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  countText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  activeCountText: {
    color: '#FFFFFF',
  },
});
