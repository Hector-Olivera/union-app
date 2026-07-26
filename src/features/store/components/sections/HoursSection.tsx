import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { DAY_ORDER, DAY_LABELS, DEFAULT_BUSINESS_HOURS } from '@/types/store';
import type { BusinessHours, DayOfWeek } from '@/types/store';

type Props = {
  hours?: BusinessHours;
  primaryColor: string;
};

// Determina qué día de la semana es hoy, mapeado a nuestras claves cortas
const getTodayKey = (): DayOfWeek => {
  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[new Date().getDay()];
};

export const HoursSection = ({ hours, primaryColor }: Props) => {
  const data = hours || DEFAULT_BUSINESS_HOURS;
  const today = getTodayKey();

  return (
  <View style={styles.container}>
    <Text style={styles.title}>Horarios de atención</Text>
    {DAY_ORDER.map((day) => {
      const isToday = day === today;
      const d = data[day];
      return (
        <View key={day} style={[styles.row, isToday && { borderColor: `${primaryColor}40`, borderWidth: 1 }]}>
          <Text
            style={[styles.day, isToday && { color: primaryColor, fontWeight: Typography.weights.bold }]}
            numberOfLines={1}
          >
            {DAY_LABELS[day]}
          </Text>
          <Text
            style={[styles.hours, isToday && { color: primaryColor }]}
            numberOfLines={1}
          >
             {d.closed ? 'Cerrado' : ` ${d.open} - ${d.close}`} </Text>
        </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: 2,
  },
  day: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
  },
  hours: {
    flexShrink: 0,
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    textAlign: 'right',
  },
});