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
import { useFamilyMembers } from '../../utils/FamilyMembersContext';
import { useAuth } from '../../utils/AuthContext';
import { Button } from '../../components';
import { COLORS } from '../../constants';

const FamilyMembersScreen = () => {
  const router = useRouter();
  const { members, deleteMember, isLoading } = useFamilyMembers();
  const { user } = useAuth();

  const handleDeleteMember = (member: any) => {
    Alert.alert(
      'Supprimer le membre',
      `Êtes-vous sûr de vouloir supprimer ${member.firstName} ${member.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteMember(member.id);
          }
        }
      ]
    );
  };

  const handleEditMember = (memberId: string) => {
    router.push({
      pathname: '/add-edit-member',
      params: { memberId }
    });
  };

  const handleAddMember = () => {
    router.push('/add-edit-member');
  };

  const renderMemberItem = ({ item }: { item: any }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
        <Text style={styles.memberPhone}>{item.phone}</Text>
      </View>
      
      <View style={styles.memberActions}>
        {item.email !== user?.email && (
          <>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditMember(item.id)}
            >
              <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteMember(item)}
            >
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </>
        )}
        
        {item.email === user?.email && (
          <Text style={styles.currentUserText}>Vous</Text>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement des membres...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Membres de la famille</Text>
        <Text style={styles.subtitle}>
          {members.length} membre{members.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun membre ajouté</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button
          title="Ajouter un membre"
          onPress={handleAddMember}
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
  memberCard: {
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
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  memberPhone: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  memberActions: {
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
  currentUserText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
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

export default FamilyMembersScreen;