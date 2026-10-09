import { View, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@constants/theme';

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
  leftRatio?: number; // proporción de la columna izquierda, 0 a 1
};

export const SplitScreenLayout = ({ left, right, leftRatio = 0.3 }: Props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.column, { flex: leftRatio }]}
        contentContainerStyle={styles.columnContent}
        showsVerticalScrollIndicator={false}
      >
        {left}
      </ScrollView>

      <View style={styles.divider} />

      <ScrollView
        style={[styles.column, { flex: 1 - leftRatio }]}
        contentContainerStyle={styles.columnContent}
        showsVerticalScrollIndicator={false}
      >
        {right}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    flexDirection: 'row',
    backgroundColor: Colors.dark.background,
  },
  column: { flex: 1 },
  columnContent: { padding: 24, paddingBottom: 48 },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});