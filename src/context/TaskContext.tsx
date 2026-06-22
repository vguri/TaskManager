import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskStatus } from '../types';

const STORAGE_KEY = '@tasks_v1';

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  addTask: (title: string, description: string) => Promise<void>;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | null;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(data => { if (data) setTasks(JSON.parse(data)); })
      .finally(() => setLoading(false));
  }, []);

  const save = (next: Task[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addTask = useCallback(async (title: string, description: string) => {
    const task: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => {
      const next = [task, ...prev];
      save(next);
      return next;
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => {
      const next = prev.map(t =>
        t.id === id
          ? { ...t, status: (t.status === 'active' ? 'completed' : 'active') as TaskStatus }
          : t
      );
      save(next);
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const next = prev.filter(t => t.id !== id);
      save(next);
      return next;
    });
  }, []);

  const getTaskById = useCallback((id: string): Task | null => {
    return tasks.find(t => t.id === id) ?? null;
  }, [tasks]);

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, toggleTask, deleteTask, getTaskById }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used inside TaskProvider');
  return ctx;
}
