import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal,
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
} from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { useResponsiveLayout } from '@hooks/useResponsiveLayout';
import { submitReport } from '@services/firebase/safety';
import { REPORT_REASON_LABELS, type ReportReason, type ReportTargetType } from '@/types/safety';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

export type ReportTarget = {
  type: ReportTargetType;
  userId: string;
  name: string;
  storeId?: string;
  conversationId?: string;
};

type Props = {
  visible: boolean;
  target: ReportTarget;
  onClose: () => void;
};

export const ReportModal = ({ visible, target, onClose }: Props) => {
  const { user } = useAuthStore();
  const { colors } = useAppTheme();
  const { isWeb } = useResponsiveLayout();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setReason(null);
    setDetails('');
    setSent(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!reason) {
      setError('Elegí un motivo');
      return;
    }
    setError(null);
    setSending(true);
    try {
      await submitReport({
        reporterId: user.id,
        reportedUserId: target.userId,
        targetType: target.type,
        storeId: target.storeId,
        conversationId: target.conversationId,
        reason,
        details,
      });
      setSent(true);
    } catch (e) {
      console.error('[ReportModal] submit error:', e);
      setError('No pudimos enviar el reporte. Intentá de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType={isWeb ? 'fade' : 'slide'} onRequestClose={handleClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.backdrop, isWeb && styles.backdropWeb]}>
          <View style={[styles.sheet, isWeb && styles.sheetWeb]}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {sent ? (
                <>
                  <Text style={styles.title}>Gracias por avisarnos</Text>
                  <Text style={styles.text}>
                    Recibimos tu reporte sobre {target.name} y lo vamos a revisar.
                  </Text>
                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.brand.primary }]}
                    onPress={handleClose}
                  >
                    <Text style={styles.primaryText}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.title}>Reportar a {target.name}</Text>
                  <Text style={styles.text}>¿Cuál es el motivo?</Text>

                  {(Object.keys(REPORT_REASON_LABELS) as ReportReason[]).map((key) => {
                    const selected = reason === key;
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[styles.reasonRow, selected && { borderColor: colors.brand.primary }]}
                        onPress={() => setReason(key)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.radio, selected && { borderColor: colors.brand.primary }]}>
                          {selected && <View style={[styles.radioDot, { backgroundColor: colors.brand.primary }]} />}
                        </View>
                        <Text style={styles.reasonText}>{REPORT_REASON_LABELS[key]}</Text>
                      </TouchableOpacity>
                    );
                  })}

                  <TextInput
                    style={styles.input}
                    value={details}
                    onChangeText={setDetails}
                    placeholder="Detalles (opcional)"
                    placeholderTextColor={Colors.dark.icon}
                    multiline
                    maxLength={500}
                  />

                  {!!error && <Text style={styles.errorText}>{error}</Text>}

                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                      <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.primaryButton, styles.flex1, { backgroundColor: colors.brand.primary }]}
                      onPress={handleSubmit}
                      disabled={sending}
                    >
                      <Text style={styles.primaryText}>{sending ? 'Enviando...' : 'Enviar reporte'}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  backdropWeb: { justifyContent: 'center', alignItems: 'center' },
  sheet: {
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.xl,
    maxHeight: '85%',
  },
  sheetWeb: { borderRadius: Radius.lg, width: '100%', maxWidth: 480 },
  title: { color: Colors.dark.text, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, marginBottom: Spacing.sm },
  text: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, lineHeight: 20, marginBottom: Spacing.md },
  reasonRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', marginBottom: Spacing.xs,
  },
  radio: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center',
  },
  radioDot: { width: 8, height: 8, borderRadius: 4 },
  reasonText: { color: Colors.dark.text, fontSize: Typography.sizes.sm, flex: 1 },
  input: {
    minHeight: 70, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.md, padding: Spacing.md,
    color: Colors.dark.text, fontSize: Typography.sizes.sm, textAlignVertical: 'top',
    marginTop: Spacing.sm,
  },
  errorText: { color: Colors.status.error, fontSize: Typography.sizes.xs, marginTop: Spacing.sm },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  flex1: { flex: 1 },
  cancelButton: {
    height: 44, paddingHorizontal: Spacing.lg, borderRadius: Radius.md, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
  },
  cancelText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm },
  primaryButton: { height: 44, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginTop: Spacing.sm },
  primaryText: { color: '#fff', fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
});