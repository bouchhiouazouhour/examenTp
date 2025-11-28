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
import { useTaskTypes } from '../../utils/TaskTypeContext'; // ✅ Chemin corrigé
import { Button } from '../../components'; // ✅ Chemin corrigé
import { COLORS } from '../../constants'; // ✅ Chemin corrigé

const TaskTypesScreen = () => {
  const router = useRouter();
  const { taskTypes, deleteTaskType, isLoading } = useTaskTypes();

  const handleDeleteTaskType = (taskType: any) => {
    Alert.alert(
      'Supprimer le type',
      `Êtes-vous sûr de vouloir supprimer "${taskType.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteTaskType(taskType.id);
          }
        }
      ]
    );
  };

  const handleEditTaskType = (taskTypeId: string) => {
    router.push({
      pathname: '/add-edit-task-type',
      params: { taskTypeId }
    });
  };

  const handleAddTaskType = () => {
    router.push('/add-edit-task-type');
  };

  const renderTaskTypeItem = ({ item }: { item: any }) => (
    <View style={styles.taskTypeCard}>
      <View style={styles.taskTypeInfo}>
        <Text style={styles.taskTypeTitle}>{item.title}</Text>
      </View>
      
      <View style={styles.taskTypeActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditTaskType(item.id)}
        >
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTaskType(item)}
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
        <Text style={styles.loadingText}>Chargement des types...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Types de tâches</Text>
        <Text style={styles.subtitle}>
          {taskTypes.length} type{taskTypes.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={taskTypes}
        renderItem={renderTaskTypeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun type de tâche</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button
          title="Ajouter un type"
          onPress={handleAddTaskType}
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
  taskTypeCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskTypeInfo: {
    flex: 1,
  },
  taskTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  taskTypeActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default TaskTypesScreen; // ✅ Export par défaut