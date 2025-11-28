import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTaskTypes } from '../../utils/TaskTypeContext';
import { Input, Button } from '../../components';
import { COLORS } from '../../constants';

const AddEditTaskTypeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskTypeId = params.taskTypeId as string;
  
  const { addTaskType, updateTaskType, getTaskType } = useTaskTypes();
  
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!taskTypeId;

  useEffect(() => {
    if (isEdit) {
      const taskType = getTaskType(taskTypeId);
      if (taskType) {
        setTitle(taskType.title);
      }
    }
  }, [isEdit, taskTypeId, getTaskType]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un titre');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const taskTypeData = {
        title: title.trim()
      };

      let success: boolean;

      if (isEdit) {
        success = await updateTaskType(taskTypeId, taskTypeData);
      } else {
        success = await addTaskType(taskTypeData);
      }

      if (success) {
        Alert.alert(
          'Succès',
          isEdit ? 'Type modifié avec succès' : 'Type ajouté avec succès',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'Erreur',
          'Impossible de sauvegarder. Ce type existe peut-être déjà.'
        );
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
            {isEdit ? 'Modifier le type' : 'Ajouter un type'}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Titre *"
            placeholder="Ex: Ménage, Cuisine, Courses..."
            value={title}
            onChangeText={setTitle}
            autoCapitalize="words"
          />

          <Button
            title={isEdit ? 'Modifier le type' : 'Ajouter le type'}
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
});

export default AddEditTaskTypeScreen;