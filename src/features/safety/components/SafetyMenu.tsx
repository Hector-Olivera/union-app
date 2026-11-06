import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@stores/authStore';
import { useBlockStore } from '@stores/blockStore';
import { ConfirmDialog } from '@components/ui/ConfirmDialog';
import { ReportModal, type ReportTarget } from './ReportModal';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  target: {
    userId: string;
    name: string;
    avatarUrl?: string;
    storeId?: string;
    conversationId?: string;
  };
  onBlocked?: () => void;
};

export const SafetyMenu = ({ target, onBlocked }: Props) => {
  const { user } = useAuthStore();
  const isBlocked = useBlockStore(s => s.blockedIds.includes(target.userId));
  const block = useBlockStore(s => s.block);
  const unblock = useBlockStore(s => s.unblock);
  const [menuVisible, setMenuVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Todos los hooks arriba: este return condicional va después
  if (!user || user.id === target.userId) return null;

  const reportTarget: ReportTarget = {
    type: target.conversationId ? 'conversation' : 'store',
    userId: target.userId,
    name: target.name,
    storeId: target.storeId,
    conversationId: target.conversationId,
  };

  const handleBlockConfirmed = async () => {
    setConfirmVisible(false);
    try {
      await block({ id: target.userId, name: target.name, avatarUrl: target.avatarUrl });
      onBlocked?.();
    } catch (e) {
      console.error('[SafetyMenu] block error:', e);
    }
  };

  const handleUnblock = async () => {
    setMenuVisible(false);
    try {
      await unblock(target.userId);
    } catch (e) {
      console.error('[SafetyMenu] unblock error:', e);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.trigger}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color={Colors.dark.icon} />
      </TouchableOpacity>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => { setMenuVisible(false); setReportVisible(true); }}
            >
              <Ionicons name="flag-outline" size={18} color={Colors.dark.text} />
              <Text style={styles.optionText}>Reportar</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {isBlocked ? (
              <TouchableOpacity style={styles.option} onPress={handleUnblock}>
                <Ionicons name="checkmark-circle-outline" size={18} color={Colors.dark.text} />
                <Text style={styles.optionText}>Desbloquear usuario</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.option}
                onPress={() => { setMenuVisible(false); setConfirmVisible(true); }}
              >
                <Ionicons name="ban-outline" size={18} color={Colors.status.error} />
                <Text style={[styles.optionText, { color: Colors.status.error }]}>Bloquear usuario</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <ReportModal visible={reportVisible} target={reportTarget} onClose={() => setReportVisible(false)} />

      <ConfirmDialog
        visible={confirmVisible}
        title={`¿Bloquear a ${target.name}?`}
        message="No van a poder enviarte mensajes y su conversación se va a ocultar. Podés desbloquearlo cuando quieras."
        confirmLabel="Bloquear"
        cancelLabel="Cancelar"
        destructive
        onConfirm={handleBlockConfirmed}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  trigger: { padding: Spacing.xs },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  menu: {
    backgroundColor: Colors.dark.surface, borderRadius: Radius.lg, width: 260,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden',
  },
  option: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.lg },
  optionText: { color: Colors.dark.text, fontSize: Typography.sizes.md },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
});