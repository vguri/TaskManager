export type TaskStatus = 'active' | 'completed';
export type FilterType = 'all' | 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Quote {
  q: string;
  a: string;
}

export interface DeletedTask extends Task {
  deletedAt: string;
}

export type RootStackParamList = {
  Home: undefined;
  TaskDetail: { taskId: string };
  AddTask: undefined;
  RecentlyDeleted: undefined;
};
