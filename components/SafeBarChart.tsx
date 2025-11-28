import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants';
import { TaskStatus } from '../app/types';

interface BarChartProps {
  data: { status: TaskStatus; count: number }[];
  total: number;
  height?: number;
}

const SafeBarChart: React.FC<BarChartProps> = ({ 
  data, 
  total, 
  height = 200 
}) => {
  const screenWidth = Dimensions.get('window').width - 80; // Padding inclus
  const maxValue = Math.max(...data.map(item => item.count), 1);

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
      'nouveau': 'Nouv.',
      'vue': 'Vue',
      'planifiée': 'Planif.',
      'en cours': 'En cours',
      'achevée': 'Terminé',
      'annulée': 'Annulé'
    };
    return labels[status];
  };

  if (data.length === 0 || total === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.emptyText}>Aucune donnée disponible</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {/* Barres du graphique */}
      <View style={styles.chartBars}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.count / maxValue) * (height - 60) : 0;
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          
          return (
            <View key={item.status} style={styles.barContainer}>
              {/* Barre verticale */}
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar,
                    { 
                      height: barHeight,
                      backgroundColor: getStatusColor(item.status)
                    }
                  ]} 
                />
              </View>
              
              {/* Étiquette en bas */}
              <View style={styles.barLabel}>
                <Text style={styles.barCount}>{item.count}</Text>
                <Text style={styles.barStatus} numberOfLines={1}>
                  {getStatusLabel(item.status)}
                </Text>
                <Text style={styles.barPercentage}>
                  {percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Ligne horizontale de base */}
      <View style={styles.baseLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: SPACING.medium,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 40,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    alignItems: 'center',
    marginTop: SPACING.small,
  },
  barCount: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  barStatus: {
    fontSize: SIZES.small - 2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 60,
  },
  barPercentage: {
    fontSize: SIZES.small - 2,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  baseLine: {
    position: 'absolute',
    bottom: 45,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: COLORS.border,
    zIndex: -1,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SafeBarChart;