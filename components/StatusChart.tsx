import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { TaskStatus } from '../app/types';
import { COLORS } from '../constants';

interface StatusChartProps {
  tasksByStatus: { status: TaskStatus; count: number }[];
}

const StatusChart: React.FC<StatusChartProps> = ({ tasksByStatus }) => {
  const screenWidth = Dimensions.get('window').width;

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

  const chartData = tasksByStatus
    .filter(item => item.count > 0)
    .map(item => ({
      name: getStatusLabel(item.status),
      population: item.count,
      color: getStatusColor(item.status),
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));

  if (chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune donnée à afficher</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Répartition des tâches</Text>
      <PieChart
        data={chartData}
        width={screenWidth - 80}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default StatusChart;