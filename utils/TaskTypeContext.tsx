import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { api, isApiAvailable } from './api';
import { storage } from './storage';
import { TaskType, TaskTypeContextType } from '../app/types';

const TaskTypeContext = createContext<TaskTypeContextType | undefined>(undefined);

interface TaskTypeProviderProps {
  children: ReactNode;
}

export const TaskTypeProvider: React.FC<TaskTypeProviderProps> = ({ children }) => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    loadTaskTypes();
  }, []);

  const loadTaskTypes = async () => {
    try {
      const online = await isApiAvailable();
      setIsOnline(online);

      if (online) {
        const response = await api.get('/taskTypes');
        setTaskTypes(response.data);
        await storage.save('taskTypes', response.data);
      } else {
        const savedTaskTypes = await storage.get<TaskType[]>('taskTypes');
        if (savedTaskTypes) {
          setTaskTypes(savedTaskTypes);
        } else {
          // Types par défaut
          const defaultTypes: TaskType[] = [
            { id: '1', title: 'Ménage', createdAt: new Date() },
            { id: '2', title: 'Cuisine', createdAt: new Date() },
            { id: '3', title: 'Courses', createdAt: new Date() },
          ];
          setTaskTypes(defaultTypes);
          await storage.save('taskTypes', defaultTypes);
        }
      }
    } catch (error) {
      console.error('Error loading task types:', error);
      const savedTaskTypes = await storage.get<TaskType[]>('taskTypes');
      if (savedTaskTypes) {
        setTaskTypes(savedTaskTypes);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addTaskType = async (taskTypeData: Omit<TaskType, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const titleExists = taskTypes.some(tt => tt.title.toLowerCase() === taskTypeData.title.toLowerCase());
      if (titleExists) {
        return false;
      }

      const newTaskType: TaskType = {
        ...taskTypeData,
        id: Date.now().toString(),
        createdAt: new Date()
      };

      if (isOnline) {
        const response = await api.post('/taskTypes', newTaskType);
        const updatedTaskTypes = [...taskTypes, response.data];
        setTaskTypes(updatedTaskTypes);
        await storage.save('taskTypes', updatedTaskTypes);
      } else {
        const updatedTaskTypes = [...taskTypes, newTaskType];
        setTaskTypes(updatedTaskTypes);
        await storage.save('taskTypes', updatedTaskTypes);
      }

      return true;
    } catch (error) {
      console.error('Error adding task type:', error);
      return false;
    }
  };

  const updateTaskType = async (id: string, taskTypeData: Omit<TaskType, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const titleExists = taskTypes.some(tt => 
        tt.title.toLowerCase() === taskTypeData.title.toLowerCase() && tt.id !== id
      );
      if (titleExists) {
        return false;
      }

      const taskTypeToUpdate: TaskType = {
        ...taskTypeData,
        id,
        createdAt: taskTypes.find(tt => tt.id === id)?.createdAt || new Date()
      };

      if (isOnline) {
        await api.put(`/taskTypes/${id}`, taskTypeToUpdate);
      }

      const updatedTaskTypes = taskTypes.map(taskType =>
        taskType.id === id ? taskTypeToUpdate : taskType
      );

      setTaskTypes(updatedTaskTypes);
      await storage.save('taskTypes', updatedTaskTypes);
      return true;
    } catch (error) {
      console.error('Error updating task type:', error);
      return false;
    }
  };

  const deleteTaskType = async (id: string): Promise<boolean> => {
    try {
      if (isOnline) {
        await api.delete(`/taskTypes/${id}`);
      }

      const updatedTaskTypes = taskTypes.filter(taskType => taskType.id !== id);
      setTaskTypes(updatedTaskTypes);
      await storage.save('taskTypes', updatedTaskTypes);
      return true;
    } catch (error) {
      console.error('Error deleting task type:', error);
      return false;
    }
  };

  const getTaskType = (id: string): TaskType | undefined => {
    return taskTypes.find(taskType => taskType.id === id);
  };

  return (
    <TaskTypeContext.Provider value={{
      taskTypes,
      addTaskType,
      updateTaskType,
      deleteTaskType,
      getTaskType,
      isLoading
    }}>
      {children}
    </TaskTypeContext.Provider>
  );
};

export const useTaskTypes = (): TaskTypeContextType => {
  const context = useContext(TaskTypeContext);
  if (context === undefined) {
    throw new Error('useTaskTypes must be used within a TaskTypeProvider');
  }
  return context;
};