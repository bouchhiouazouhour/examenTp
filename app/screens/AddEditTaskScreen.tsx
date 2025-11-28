import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity // ✅ IMPORT MANQUANT
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTasks } from '../../utils/TaskContext';
import { useTaskTypes } from '../../utils/TaskTypeContext';
import { useFamilyMembers } from '../../utils/FamilyMembersContext';
import { Input, Button } from '../../components';
import { COLORS } from '../../constants';
import { TaskStatus } from '../types';

const AddEditTaskScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  
  const { addTask, updateTask, getTask } = useTasks();
  const { taskTypes } = useTaskTypes();
  const { members } = useFamilyMembers();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('nouveau');
  const [typeId, setTypeId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!taskId;
  const statusOptions: TaskStatus[] = ['nouveau', 'vue', 'planifiée', 'en cours', 'achevée', 'annulée'];

  useEffect(() => {
    if (isEdit) {
      const task = getTask(taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setTypeId(task.typeId);
        setAssignedTo(task.assignedTo);
      }
    }
  }, [isEdit, taskId, getTask]);

  const validateForm = (): boolean => {
    if (!title.trim() || !description.trim() || !typeId || !assignedTo) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        status,
        typeId,
        assignedTo
      };

      let success: boolean;

      if (isEdit) {
        success = await updateTask(taskId, taskData);
      } else {
        success = await addTask(taskData);
      }

      if (success) {
        Alert.alert(
          'Succès',
          isEdit ? 'Tâche modifiée avec succès' : 'Tâche ajoutée avec succès',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Erreur', 'Impossible de sauvegarder la tâche');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEdit ? 'Modifier la tâche' : 'Ajouter une tâche'}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Titre *"
            placeholder="Titre de la tâche"
            value={title}
            onChangeText={setTitle}
          />

          <Input
            label="Description *"
            placeholder="Description détaillée de la tâche"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Statut *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.statusContainer}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.statusOption,
                      status === option && styles.statusOptionSelected
                    ]}
                    onPress={() => setStatus(option)}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      status === option && styles.statusOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Type de tâche *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {taskTypes.map((taskType) => (
                  <TouchableOpacity
                    key={taskType.id}
                    style={[
                      styles.option,
                      typeId === taskType.id && styles.optionSelected
                    ]}
                    onPress={() => setTypeId(taskType.id)}
                  >
                    <Text style={[
                      styles.optionText,
                      typeId === taskType.id && styles.optionTextSelected
                    ]}>
                      {taskType.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Assigné à *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {members.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.option,
                      assignedTo === member.id && styles.optionSelected
                    ]}
                    onPress={() => setAssignedTo(member.id)}
                  >
                    <Text style={[
                      styles.optionText,
                      assignedTo === member.id && styles.optionTextSelected
                    ]}>
                      {member.firstName} {member.lastName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <Button
            title={isEdit ? 'Modifier la tâche' : 'Ajouter la tâche'}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          />

          <Button
            title="Annuler"
            onPress={handleCancel}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
  },
  statusContainer: {
    flexDirection: 'row', // ✅ CORRIGÉ
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusOptionText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  statusOptionTextSelected: {
    color: 'white',
  },
  optionsContainer: {
    flexDirection: 'row', // ✅ CORRIGÉ
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: 'white',
  },
});

export default AddEditTaskScreen; // ✅ Export par défaut