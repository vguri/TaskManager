import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Quote } from '../types';

interface Props {
  quote: Quote | null;
  loading: boolean;
  index: number;
  total: number;
  onAdvance: () => void;
}

export function QuoteCard({ quote, loading, index, total, onAdvance }: Props) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [displayed, setDisplayed] = useState<Quote | null>(null);

  useEffect(() => {
    if (!quote) return;
    if (!displayed) {
      setDisplayed(quote);
      return;
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setDisplayed(quote);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    });
  }, [quote]);

  const dotCount = Math.min(total, 8);

  return (
    <Pressable style={styles.card} onPress={onAdvance}>
      <View style={styles.cardHeader}>
        <View style={styles.labelRow}>
          <Ionicons name="sparkles" size={13} color="rgba(255,255,255,0.7)" />
          <Text style={styles.headerLabel}>Daily Quote</Text>
        </View>
        {!loading && total > 1 && (
          <Pressable onPress={onAdvance} hitSlop={10} style={styles.nextBtn}>
            <Ionicons name="arrow-forward-circle-outline" size={20} color="rgba(255,255,255,0.6)" />
          </Pressable>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color="rgba(255,255,255,0.8)" size="small" style={styles.loader} />
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.quoteText}>{displayed?.q}</Text>
          <Text style={styles.author}>— {displayed?.a}</Text>
        </Animated.View>
      )}

      {!loading && total > 1 && (
        <View style={styles.dotsRow}>
          {Array.from({ length: dotCount }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index % dotCount && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    marginBottom: 20,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextBtn: {
    padding: 2,
  },
  loader: {
    marginVertical: 16,
  },
  quoteText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    fontStyle: 'italic',
    lineHeight: 23,
    marginBottom: 12,
  },
  author: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    textAlign: 'right',
    letterSpacing: 0.2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 14,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 14,
    borderRadius: 3,
  },
});
