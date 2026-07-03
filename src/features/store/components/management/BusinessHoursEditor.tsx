import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { DAY_ORDER, DAY_LABELS, DEFAULT_BUSINESS_HOURS } from '@/types/store';
import type { BusinessHours, DayOfWeek } from '@/types/store';

type Props = {
  hours: BusinessHours | undefined;
  onUpdate: (hours: BusinessHours) => void;
};

// Validación simple de formato HH:mm
const isValidTime = (value: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export const BusinessHoursEditor = ({ hours, onUpdate }: Props) => {
  const { colors } = useAppTheme();
  // Si la tienda no tiene horarios guardados todavía, usamos el default
  const currentHours = hours || DEFAULT_BUSINESS_HOURS;

  const toggleDay = (day: DayOfWeek) => {
    onUpdate({
      ...currentHours,
      [day]: { ...currentHours[day], closed: !currentHours[day].closed },
    });
  };

  const updateTime = (day: DayOfWeek, field: 'open' | 'close', value: string) => {
    onUpdate({
      ...currentHours,
      [day]: { ...currentHours[day], [field]: value },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horarios de atención</Text>
      <Text style={styles.subtitle}>
        Definí cuándo tu tienda está abierta para tus clientes.
      </Text>

      {DAY_ORDER.map((day) => {
        const dayData = currentHours[day];
        return (
          <View key={day} style={styles.dayRow}>
            <Text style={styles.dayLabel}>{DAY_LABELS[day]}</Text>

            <TouchableOpacity
              onPress={() => toggleDay(day)}
              style={[
                styles.statusToggle,
                { backgroundColor: dayData.closed ? 'rgba(255,255,255,0.08)' : `${colors.brand.primary}20` }
              ]}
            >
              <Text style={[
                styles.statusText,
                { color: dayData.closed ? Colors.dark.icon : colors.brand.primary }
              ]}>
                {dayData.closed ? 'Cerrado' : 'Abierto'}
              </Text>
            </TouchableOpacity>

            {!dayData.closed && (
              <View style={styles.timeInputs}>
                <TextInput
                  style={[
                    styles.timeInput,
                    { borderColor: isValidTime(dayData.open) ? 'rgba(255,255,255,0.15)' : Colors.status.error }
                  ]}
                  value={dayData.open}
                  onChangeText={(v) => updateTime(day, 'open', v)}
                  placeholder="09:00"
                  placeholderTextColor={Colors.dark.icon}
                  maxLength={5}
                />
                <Text style={styles.timeSeparator}>a</Text>
                <TextInput
                  style={[
                    styles.timeInput,
                    { borderColor: isValidTime(dayData.close) ? 'rgba(255,255,255,0.15)' : Colors.status.error }
                  ]}
                  value={dayData.close}
                  onChangeText={(v) => updateTime(day, 'close', v)}
                  placeholder="18:00"
                  placeholderTextColor={Colors.dark.icon}
                  maxLength={5}
                />
              </View>
            )}
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
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  dayLabel: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    width: 80,
  },
  statusToggle: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  timeInput: {
    width: 60,
    height: 32,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xs,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  timeSeparator: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
  },
});