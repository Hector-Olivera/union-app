import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { TodoItem } from '@/types/store';

type Props = {
  todos: TodoItem[] | undefined;
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export const TodoList = ({ todos = [], onAdd, onToggle, onDelete }: Props) => {
  const { colors } = useAppTheme();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input);
    setInput('');
  };

  const pendingCount = todos.filter(t => !t.done).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pendientes</Text>
        {pendingCount > 0 && (
          <View style={[styles.countBadge, { backgroundColor: `${colors.brand.secondary}20` }]}>
            <Text style={[styles.countText, { color: colors.brand.secondary }]}>
              {pendingCount}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nueva tarea..."
          placeholderTextColor={Colors.dark.icon}
          onSubmitEditing={handleAdd}
          maxLength={100}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.brand.primary }]}
          onPress={handleAdd}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {todos.length === 0 ? (
        <Text style={styles.emptyText}>Sin pendientes por ahora.</Text>
      ) : (
        todos.map((todo) => (
          <View key={todo.id} style={styles.todoRow}>
            <TouchableOpacity
              onPress={() => onToggle(todo.id)}
              style={[
                styles.checkbox,
                todo.done && { backgroundColor: colors.brand.primary, borderColor: colors.brand.primary }
              ]}
            >
              {todo.done && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <Text style={[
              styles.todoText,
              todo.done && styles.todoTextDone
            ]}>
              {todo.text}
            </Text>

            <TouchableOpacity onPress={() => onDelete(todo.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    minWidth: 22,
    alignItems: 'center',
  },
  countText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  emptyText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  todoText: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
  },
  todoTextDone: {
    color: Colors.dark.icon,
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
});