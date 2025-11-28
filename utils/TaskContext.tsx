import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { api, isApiAvailable } from './api';
import { storage } from './storage';
import { Task, TaskContextType } from '../app/types';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const online = await isApiAvailable();
      setIsOnline(online);

      if (online) {
        const response = await api.get('/tasks');
        setTasks(response.data);
        await storage.save('tasks', response.data);
      } else {
        const savedTasks = await storage.get<Task[]>('tasks');
        if (savedTasks) {
          setTasks(savedTasks);
        }
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      const savedTasks = await storage.get<Task[]>('tasks');
      if (savedTasks) {
        setTasks(savedTasks);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (isOnline) {
        const response = await api.post('/tasks', newTask);
        const updatedTasks = [...tasks, response.data];
        setTasks(updatedTasks);
        await storage.save('tasks', updatedTasks);
      } else {
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        await storage.save('tasks', updatedTasks);
      }

      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      return false;
    }
  };

  const updateTask = async (id: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const taskToUpdate: Task = {
        ...taskData,
        id,
        createdAt: tasks.find(t => t.id === id)?.createdAt || new Date(),
        updatedAt: new Date()
      };

      if (isOnline) {
        await api.put(`/tasks/${id}`, taskToUpdate);
      }

      const updatedTasks = tasks.map(task =>
        task.id === id ? taskToUpdate : task
      );

      setTasks(updatedTasks);
      await storage.save('tasks', updatedTasks);
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      if (isOnline) {
        await api.delete(`/tasks/${id}`);
      }

      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      await storage.save('tasks', updatedTasks);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const getTask = (id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByMember = (memberId: string): Task[] => {
    return tasks.filter(task => task.assignedTo === memberId);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      getTask,
      getTasksByMember,
      isLoading
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};