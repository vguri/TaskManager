import { useState, useEffect, useCallback } from 'react';
import { Quote } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const FALLBACKS: Quote[] = [
  { q: 'The secret of getting ahead is getting started.', a: 'Mark Twain' },
  { q: 'It always seems impossible until it is done.', a: 'Nelson Mandela' },
  { q: "Don't watch the clock; do what it does. Keep going.", a: 'Sam Levenson' },
  { q: 'You don\'t have to be great to start, but you have to start to be great.', a: 'Zig Ziglar' },
  { q: 'The way to get started is to quit talking and begin doing.', a: 'Walt Disney' },
];

const ROTATE_MS = 8000;

export function useQuote() {
  const [quotes, setQuotes] = useState<Quote[]>(shuffle(FALLBACKS));
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch('https://zenquotes.io/api/quotes', { signal: controller.signal })
      .then(res => res.json())
      .then((data: Array<{ q: string; a: string }>) => {
        const parsed = data
          .filter(item => item.q && item.a && !item.q.startsWith('Too many'))
          .slice(0, 25)
          .map(item => ({ q: item.q, a: item.a }));
        if (parsed.length > 0) {
          setQuotes(shuffle(parsed));
          setIndex(0);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (quotes.length <= 1) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % quotes.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [quotes.length, timerKey]);

  const advance = useCallback(() => {
    setIndex(prev => (prev + 1) % quotes.length);
    setTimerKey(k => k + 1);
  }, [quotes.length]);

  return {
    quote: quotes[index] ?? null,
    loading,
    index,
    total: quotes.length,
    advance,
  };
}
