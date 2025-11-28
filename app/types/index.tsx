import { NavigatorScreenParams } from '@react-navigation/native';

export interface User {
  email: string;
  name?: string;
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface FamilyMembersContextType {
  members: FamilyMember[];
  addMember: (member: Omit<FamilyMember, 'id' | 'createdAt'>) => Promise<boolean>;
  updateMember: (id: string, member: Omit<FamilyMember, 'id' | 'createdAt'>) => Promise<boolean>;
  deleteMember: (id: string) => Promise<boolean>;
  getMember: (id: string) => FamilyMember | undefined;
  isLoading: boolean;
}


export interface TaskType {
  id: string;
  title: string;
  createdAt: Date;
}

export type TaskStatus = 'nouveau' | 'vue' | 'planifiée' | 'en cours' | 'achevée' | 'annulée';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  typeId: string;
  assignedTo: string; // memberId
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateTask: (id: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  getTask: (id: string) => Task | undefined;
  getTasksByMember: (memberId: string) => Task[];
  isLoading: boolean;
}

export interface TaskTypeContextType {
  taskTypes: TaskType[];
  addTaskType: (taskType: Omit<TaskType, 'id' | 'createdAt'>) => Promise<boolean>;
  updateTaskType: (id: string, taskType: Omit<TaskType, 'id' | 'createdAt'>) => Promise<boolean>;
  deleteTaskType: (id: string) => Promise<boolean>;
  getTaskType: (id: string) => TaskType | undefined;
  isLoading: boolean;
}
export interface DashboardStats {
  tasksByStatus: { status: TaskStatus; count: number }[];
  tasksByMember: { memberId: string; memberName: string; count: number }[];
  totalActiveTasks: number;
  totalTasks: number;
}

const Types = {};


export default Types;