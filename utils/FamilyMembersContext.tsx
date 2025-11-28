import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { api, isApiAvailable } from './api';
import { storage } from './storage';
import { FamilyMember, FamilyMembersContextType } from '../app/types';

const FamilyMembersContext = createContext<FamilyMembersContextType | undefined>(undefined);

interface FamilyMembersProviderProps {
  children: ReactNode;
}

export const FamilyMembersProvider: React.FC<FamilyMembersProviderProps> = ({ children }) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const online = await isApiAvailable();
      setIsOnline(online);

      if (online) {
        // Charger depuis l'API
        const response = await api.get('/members');
        setMembers(response.data);
        // Synchroniser avec le stockage local
        await storage.save('familyMembers', response.data);
      } else {
        // Charger depuis le stockage local
        const savedMembers = await storage.get<FamilyMember[]>('familyMembers');
        if (savedMembers) {
          setMembers(savedMembers);
        }
      }
    } catch (error) {
      console.error('Error loading members:', error);
      // Fallback au stockage local
      const savedMembers = await storage.get<FamilyMember[]>('familyMembers');
      if (savedMembers) {
        setMembers(savedMembers);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (memberData: Omit<FamilyMember, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // Vérifier si l'email existe déjà
      const emailExists = members.some(m => m.email === memberData.email);
      if (emailExists) {
        return false;
      }

      const newMember: FamilyMember = {
        ...memberData,
        id: Date.now().toString(),
        createdAt: new Date()
      };

      if (isOnline) {
        // Sauvegarder dans l'API
        const response = await api.post('/members', newMember);
        const updatedMembers = [...members, response.data];
        setMembers(updatedMembers);
        await storage.save('familyMembers', updatedMembers);
      } else {
        // Sauvegarder localement
        const updatedMembers = [...members, newMember];
        setMembers(updatedMembers);
        await storage.save('familyMembers', updatedMembers);
      }

      return true;
    } catch (error) {
      console.error('Error adding member:', error);
      // Fallback local en cas d'erreur
      const newMember: FamilyMember = {
        ...memberData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      const updatedMembers = [...members, newMember];
      setMembers(updatedMembers);
      await storage.save('familyMembers', updatedMembers);
      return true;
    }
  };

  const updateMember = async (id: string, memberData: Omit<FamilyMember, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const emailExists = members.some(m => m.email === memberData.email && m.id !== id);
      if (emailExists) {
        return false;
      }

      const memberToUpdate: FamilyMember = {
        ...memberData,
        id,
        createdAt: members.find(m => m.id === id)?.createdAt || new Date()
      };

      if (isOnline) {
        await api.put(`/members/${id}`, memberToUpdate);
      }

      const updatedMembers = members.map(member =>
        member.id === id ? memberToUpdate : member
      );

      setMembers(updatedMembers);
      await storage.save('familyMembers', updatedMembers);
      return true;
    } catch (error) {
      console.error('Error updating member:', error);
      return false;
    }
  };

  const deleteMember = async (id: string): Promise<boolean> => {
    try {
      if (isOnline) {
        await api.delete(`/members/${id}`);
      }

      const updatedMembers = members.filter(member => member.id !== id);
      setMembers(updatedMembers);
      await storage.save('familyMembers', updatedMembers);
      return true;
    } catch (error) {
      console.error('Error deleting member:', error);
      return false;
    }
  };

  const getMember = (id: string): FamilyMember | undefined => {
    return members.find(member => member.id === id);
  };

  return (
    <FamilyMembersContext.Provider value={{
      members,
      addMember,
      updateMember,
      deleteMember,
      getMember,
      isLoading
    }}>
      {children}
    </FamilyMembersContext.Provider>
  );
};

export const useFamilyMembers = (): FamilyMembersContextType => {
  const context = useContext(FamilyMembersContext);
  if (context === undefined) {
    throw new Error('useFamilyMembers must be used within a FamilyMembersProvider');
  }
  return context;
};