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
import { useFamilyMembers } from '../../utils/FamilyMembersContext'; // ✅ Chemin corrigé
import { Input, Button } from '../../components'; // ✅ Chemin corrigé
import { COLORS } from '../../constants'; // ✅ Chemin corrigé

const AddEditMemberScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const memberId = params.memberId as string;
  
  const { addMember, updateMember, getMember } = useFamilyMembers();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!memberId;

  useEffect(() => {
    if (isEdit) {
      const member = getMember(memberId);
      if (member) {
        setFirstName(member.firstName);
        setLastName(member.lastName);
        setPhone(member.phone);
        setEmail(member.email);
        setPassword(member.password);
        setConfirmPassword(member.password);
      }
    }
  }, [isEdit, memberId, getMember]);

  const validateForm = (): boolean => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim() || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    if (password.length < 3) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 3 caractères');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const memberData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password: password
      };

      let success: boolean;

      if (isEdit) {
        success = await updateMember(memberId, memberData);
      } else {
        success = await addMember(memberData);
      }

      if (success) {
        Alert.alert(
          'Succès',
          isEdit ? 'Membre modifié avec succès' : 'Membre ajouté avec succès',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'Erreur',
          'Impossible de sauvegarder. L\'email est peut-être déjà utilisé.'
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
            {isEdit ? 'Modifier le membre' : 'Ajouter un membre'}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Prénom *"
            placeholder="Entrez le prénom"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <Input
            label="Nom *"
            placeholder="Entrez le nom"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <Input
            label="Téléphone *"
            placeholder="Entrez le numéro de téléphone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label="Email *"
            placeholder="Entrez l'email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isEdit}
          />

          <Input
            label="Mot de passe *"
            placeholder="Entrez le mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Confirmer le mot de passe *"
            placeholder="Confirmez le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title={isEdit ? 'Modifier le membre' : 'Ajouter le membre'}
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

export default AddEditMemberScreen;