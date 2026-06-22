import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskStatus, DeletedTask } from '../types';

const STORAGE_KEY = '@tasks_v1';
const TRASH_KEY = '@tasks_trash_v1';
const TRASH_TTL_DAYS = 30;

interface TaskContextValue {
  tasks: Task[];
  deletedTasks: DeletedTask[];
  loading: boolean;
  addTask: (title: string, description: string) => Promise<void>;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
  permanentlyDeleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | null;
}

const TaskContext = createContext<TaskContextValue | null>(null);

function purgeStaleTrashed(items: DeletedTask[]): DeletedTask[] {
  const cutoff = Date.now() - TRASH_TTL_DAYS * 24 * 60 * 60 * 1000;
  return items.filter(t => new Date(t.deletedAt).getTime() > cutoff);
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<DeletedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(TRASH_KEY),
    ]).then(([taskData, trashData]) => {
      if (taskData) setTasks(JSON.parse(taskData));
      if (trashData) {
        const purged = purgeStaleTrashed(JSON.parse(trashData));
        setDeletedTasks(purged);
        AsyncStorage.setItem(TRASH_KEY, JSON.stringify(purged));
      }
    }).finally(() => setLoading(false));
  }, []);

  const saveTasks = (next: Task[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveTrash = (next: DeletedTask[]) => {
    AsyncStorage.setItem(TRASH_KEY, JSON.stringify(next));
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
      saveTasks(next);
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
      saveTasks(next);
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      if (task) {
        const deletedTask: DeletedTask = { ...task, deletedAt: new Date().toISOString() };
        setDeletedTasks(trash => {
          const next = [deletedTask, ...trash];
          saveTrash(next);
          return next;
        });
      }
      const next = prev.filter(t => t.id !== id);
      saveTasks(next);
      return next;
    });
  }, []);

  const restoreTask = useCallback((id: string) => {
    setDeletedTasks(trash => {
      const task = trash.find(t => t.id === id);
      if (task) {
        const { deletedAt, ...restored } = task;
        const restoredTask: Task = { ...restored, status: 'active' };
        setTasks(prev => {
          const next = [restoredTask, ...prev];
          saveTasks(next);
          return next;
        });
      }
      const next = trash.filter(t => t.id !== id);
      saveTrash(next);
      return next;
    });
  }, []);

  const permanentlyDeleteTask = useCallback((id: string) => {
    setDeletedTasks(prev => {
      const next = prev.filter(t => t.id !== id);
      saveTrash(next);
      return next;
    });
  }, []);

  const getTaskById = useCallback((id: string): Task | null => {
    return tasks.find(t => t.id === id) ?? null;
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      deletedTasks,
      loading,
      addTask,
      toggleTask,
      deleteTask,
      restoreTask,
      permanentlyDeleteTask,
      getTaskById,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used inside TaskProvider');
  return ctx;
}
