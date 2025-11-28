import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../utils/AuthContext';
import { COLORS } from '../constants';

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleManageMembers = () => {
    router.push('/family-members');
  };

  const handleTaskTypes = () => {
    router.push('/task-types');
  };

  const handleTasks = () => {
    router.push('/tasks');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans FamilyDo !</Text>
      <Text style={styles.subtitle}>Connecté en tant que : {user?.email}</Text>
      
      <TouchableOpacity
        onPress={handleDashboard}
        style={[styles.menuButton, styles.primaryButton]}
      >
        <Text style={styles.menuButtonText}>📊 Tableau de bord</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleManageMembers}
        style={styles.menuButton}
      >
        <Text style={styles.menuButtonText}>👨‍👩‍👧‍👦 Gérer les membres</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleTaskTypes}
        style={styles.menuButton}
      >
        <Text style={styles.menuButtonText}>📝 Types de tâches</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleTasks}
        style={styles.menuButton}
      >
        <Text style={styles.menuButtonText}>✅ Gérer les tâches</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.menuButton, styles.logoutButton]}
      >
        <Text style={styles.menuButtonText}>🚪 Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333"
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666"
  },
  menuButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
    marginBottom: 16
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    marginTop: 20
  },
  menuButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  }
});