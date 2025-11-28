import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants';
import { TaskStatus } from '../app/types';

interface PieChartProps {
  data: { status: TaskStatus; count: number }[];
  size?: number;
}

const SafePieChart: React.FC<PieChartProps> = ({ data, size = 150 }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

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

  const renderPieChart = () => {
    if (data.length === 0 || total === 0) {
      return (
        <View style={[styles.pieChart, { width: size, height: size }]}>
          <Text style={styles.emptyText}>Aucune donnée</Text>
        </View>
      );
    }

    let currentAngle = 0;
    
    return (
      <View style={[styles.pieChart, { width: size, height: size }]}>
        {data
          .filter(item => item.count > 0)
          .map((item, index) => {
            const percentage = (item.count / total) * 100;
            const angle = (item.count / total) * 360;
            const sliceAngle = currentAngle;
            currentAngle += angle;

            // Calcul des coordonnées pour le segment circulaire
            const largeArcFlag = angle > 180 ? 1 : 0;
            const x1 = 50 + 50 * Math.cos((sliceAngle * Math.PI) / 180);
            const y1 = 50 + 50 * Math.sin((sliceAngle * Math.PI) / 180);
            const x2 = 50 + 50 * Math.cos(((sliceAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 50 * Math.sin(((sliceAngle + angle) * Math.PI) / 180);

            return (
              <View
                key={item.status}
                style={[
                  styles.pieSlice,
                  {
                    width: size,
                    height: size,
                    backgroundColor: getStatusColor(item.status),
                    transform: [
                      { rotate: `${sliceAngle}deg` }
                    ],
                  },
                ]}
              >
                <View style={[styles.pieSliceInner, { transform: [{ rotate: `${angle / 2}deg` }] }]}>
                  {percentage > 10 && (
                    <Text style={styles.sliceText}>{percentage.toFixed(0)}%</Text>
                  )}
                </View>
              </View>
            );
          })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderPieChart()}
      
      {/* Légende */}
      <View style={styles.legend}>
        {data
          .filter(item => item.count > 0)
          .map((item) => (
            <View key={item.status} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor, 
                  { backgroundColor: getStatusColor(item.status) }
                ]} 
              />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendLabel}>{getStatusLabel(item.status)}</Text>
                <Text style={styles.legendCount}>
                  {item.count} ({((item.count / total) * 100).toFixed(0)}%)
                </Text>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.medium,
  },
  pieChart: {
    borderRadius: 75,
    overflow: 'hidden',
    position: 'relative',
  },
  pieSlice: {
    position: 'absolute',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSliceInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliceText: {
    fontSize: SIZES.small - 2,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  legend: {
    flex: 1,
    marginLeft: SPACING.large,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SPACING.small,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendLabel: {
    fontSize: SIZES.small,
    color: COLORS.text,
    fontWeight: '500',
  },
  legendCount: {
    fontSize: SIZES.small - 2,
    color: COLORS.textSecondary,
  },
});

export default SafePieChart;