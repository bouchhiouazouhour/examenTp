import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTasks } from '../../utils/TaskContext';
import { useTaskTypes } from '../../utils/TaskTypeContext';
import { useFamilyMembers } from '../../utils/FamilyMembersContext';
import { Button } from '../../components';
import { COLORS } from '../../constants';

const TasksScreen = () => {
  const router = useRouter();
  const { tasks, deleteTask, isLoading } = useTasks();
  const { taskTypes } = useTaskTypes();
  const { members } = useFamilyMembers();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return '#2196F3';
      case 'vue': return '#FF9800';
      case 'planifiée': return '#9C27B0';
      case 'en cours': return '#FFC107';
      case 'achevée': return '#4CAF50';
      case 'annulée': return '#F44336';
      default: return COLORS.textSecondary;
    }
  };

  const getTaskTypeTitle = (typeId: string) => {
    return taskTypes.find(tt => tt.id === typeId)?.title || 'Inconnu';
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Inconnu';
  };

  const handleDeleteTask = (task: any) => {
    Alert.alert(
      'Supprimer la tâche',
      `Êtes-vous sûr de vouloir supprimer "${task.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
          }
        }
      ]
    );
  };

  const handleEditTask = (taskId: string) => {
    router.push({
      pathname: '/add-edit-task',
      params: { taskId }
    });
  };

  const handleAddTask = () => {
    router.push('/add-edit-task');
  };

  const renderTaskItem = ({ item }: { item: any }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.taskMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.taskMetaText}>{getTaskTypeTitle(item.typeId)}</Text>
          <Text style={styles.taskMetaText}>•</Text>
          <Text style={styles.taskMetaText}>{getMemberName(item.assignedTo)}</Text>
        </View>
      </View>
      
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditTask(item.id)}
        >
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTask(item)}
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement des tâches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tâches</Text>
        <Text style={styles.subtitle}>
          {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune tâche</Text>
            <Text style={styles.emptySubtext}>
              Ajoutez la première tâche de votre famille
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button
          title="Ajouter une tâche"
          onPress={handleAddTask}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  listContent: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  taskMetaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.error,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default TasksScreen;