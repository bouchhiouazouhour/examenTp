import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useTasks } from '../../utils/TaskContext';
import { useFamilyMembers } from '../../utils/FamilyMembersContext';
import { Card } from '../../components';
import { COLORS, SIZES, SPACING } from '../../constants';
import { TaskStatus } from '../types';
import SafeBarChart from '../../components/SafeBarChart';
import SafePieChart from '../../components/SafePieChart';

const DashboardScreen = () => {
  const { tasks, isLoading } = useTasks();
  const { members } = useFamilyMembers();
  const [selectedChart, setSelectedChart] = useState<'bar' | 'pie'>('bar');

  // Calcul des statistiques
  const getStatusColor = (status: TaskStatus): string => {
    const colors: Record<TaskStatus, string> = {
      'nouveau': '#2196F3',
      'vue': '#FF9800',
      'planifiée': '#9C27B0',
      'en cours': '#FFC107',
      'achevée': '#4CAF50',
      'annulée': '#F44336'
    };
    return colors[status];
  };

  const getStatusLabel = (status: TaskStatus): string => {
    const labels: Record<TaskStatus, string> = {
      'nouveau': 'Nouveau',
      'vue': 'Vue',
      'planifiée': 'Planifiée',
      'en cours': 'En cours',
      'achevée': 'Achevée',
      'annulée': 'Annulée'
    };
    return labels[status];
  };

  const calculateStats = () => {
    // Tâches par statut
    const statusCounts: Record<TaskStatus, number> = {
      'nouveau': 0,
      'vue': 0,
      'planifiée': 0,
      'en cours': 0,
      'achevée': 0,
      'annulée': 0
    };

    tasks.forEach(task => {
      statusCounts[task.status]++;
    });

    const tasksByStatus = Object.entries(statusCounts)
      .map(([status, count]) => ({
        status: status as TaskStatus,
        count
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    // Tâches par membre
    const memberCounts: Record<string, number> = {};
    members.forEach(member => {
      memberCounts[member.id] = 0;
    });

    tasks.forEach(task => {
      if (memberCounts[task.assignedTo] !== undefined) {
        memberCounts[task.assignedTo]++;
      }
    });

    const tasksByMember = Object.entries(memberCounts)
      .map(([memberId, count]) => {
        const member = members.find(m => m.id === memberId);
        return {
          memberId,
          memberName: member ? `${member.firstName} ${member.lastName}` : 'Inconnu',
          count
        };
      })
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    // Tâches actives (ni achevées ni annulées)
    const totalActiveTasks = tasks.filter(task => 
      task.status !== 'achevée' && task.status !== 'annulée'
    ).length;

    return {
      tasksByStatus,
      tasksByMember,
      totalActiveTasks,
      totalTasks: tasks.length
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </View>
    );
  }

  const renderMemberStats = (member: { memberName: string; count: number }, index: number) => (
    <View style={styles.memberItem} key={index}>
      <Text style={styles.memberName} numberOfLines={1}>
        {member.memberName}
      </Text>
      <View style={styles.memberStats}>
        <Text style={styles.memberCount}>{member.count}</Text>
        <Text style={styles.memberLabel}>
          tâche{member.count !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord</Text>
        <Text style={styles.subtitle}>
          {stats.totalTasks} tâche{stats.totalTasks !== 1 ? 's' : ''} au total
        </Text>
      </View>

      <View style={styles.content}>
        {/* Carte : Tâches actives */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>📊 Tâches en cours</Text>
          <View style={styles.activeTasksContainer}>
            <Text style={styles.activeTasksCount}>{stats.totalActiveTasks}</Text>
            <Text style={styles.activeTasksLabel}>
              tâche{stats.totalActiveTasks !== 1 ? 's' : ''} active{stats.totalActiveTasks !== 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.activeTasksSubtitle}>
            {stats.totalTasks - stats.totalActiveTasks} tâche{stats.totalTasks - stats.totalActiveTasks !== 1 ? 's' : ''} terminée{stats.totalTasks - stats.totalActiveTasks !== 1 ? 's' : ''} ou annulée{stats.totalTasks - stats.totalActiveTasks !== 1 ? 's' : ''}
          </Text>
        </Card>

        {/* Carte : Graphique de distribution */}
        <Card style={styles.statsCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>📈 Distribution des tâches</Text>
            <View style={styles.chartToggle}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  selectedChart === 'bar' && styles.toggleButtonActive
                ]}
                onPress={() => setSelectedChart('bar')}
              >
                <Text style={[
                  styles.toggleButtonText,
                  selectedChart === 'bar' && styles.toggleButtonTextActive
                ]}>
                  Barres
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  selectedChart === 'pie' && styles.toggleButtonActive
                ]}
                onPress={() => setSelectedChart('pie')}
              >
                <Text style={[
                  styles.toggleButtonText,
                  selectedChart === 'pie' && styles.toggleButtonTextActive
                ]}>
                  Circulaire
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectedChart === 'bar' ? (
            <SafeBarChart 
              data={stats.tasksByStatus} 
              total={stats.totalTasks}
              height={200}
            />
          ) : (
            <SafePieChart 
              data={stats.tasksByStatus}
              size={160}
            />
          )}
        </Card>

        {/* Carte : Tâches par membre */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>👥 Tâches par membre</Text>
          <View style={styles.membersList}>
            {stats.tasksByMember.length > 0 ? (
              stats.tasksByMember.map(renderMemberStats)
            ) : (
              <Text style={styles.emptyText}>Aucune tâche assignée</Text>
            )}
          </View>
        </Card>

        {/* Carte : Résumé global */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>🔢 Résumé global</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{stats.totalTasks}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{stats.totalActiveTasks}</Text>
              <Text style={styles.summaryLabel}>En cours</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {stats.tasksByStatus.find(s => s.status === 'achevée')?.count || 0}
              </Text>
              <Text style={styles.summaryLabel}>Achevées</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {stats.tasksByStatus.find(s => s.status === 'annulée')?.count || 0}
              </Text>
              <Text style={styles.summaryLabel}>Annulées</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
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
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.large,
    paddingTop: 60,
  },
  title: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.tiny,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    padding: SPACING.large,
  },
  statsCard: {
    marginBottom: SPACING.large,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.medium,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  activeTasksContainer: {
    alignItems: 'center',
    marginVertical: SPACING.medium,
  },
  activeTasksCount: {
    fontSize: SIZES.xxxlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.tiny,
  },
  activeTasksLabel: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  activeTasksSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.small,
  },
  membersList: {
    gap: SPACING.medium,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  memberName: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.small,
  },
  memberStats: {
    alignItems: 'flex-end',
  },
  memberCount: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  memberLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  summaryItem: {
    alignItems: 'center',
    width: '48%',
    padding: SPACING.medium,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: SPACING.medium,
  },
  summaryNumber: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.tiny,
  },
  summaryLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: SPACING.large,
  },
});

export default DashboardScreen;