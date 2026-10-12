import {
  doc, setDoc, deleteDoc, addDoc, collection,
  query, where, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { BlockedUser, ReportReason, ReportTargetType } from '@/types/safety';

// El ID del documento es bloqueador_bloqueado: las reglas lo usan para
// chequear el bloqueo con exists() sin leer ningún dato.
export const blockUser = async (
  blockerId: string,
  target: { id: string; name: string; avatarUrl?: string }
): Promise<void> => {
  const data: Record<string, any> = {
    blockerId,
    blockedId: target.id,
    blockedName: target.name,
    createdAt: serverTimestamp(),
  };
  // Firestore rechaza campos undefined, solo se agrega si existe
  if (target.avatarUrl) data.blockedAvatarUrl = target.avatarUrl;
  await setDoc(doc(db, 'blocks', `${blockerId}_${target.id}`), data);
};

export const unblockUser = async (blockerId: string, blockedId: string): Promise<void> => {
  await deleteDoc(doc(db, 'blocks', `${blockerId}_${blockedId}`));
};

export const subscribeToBlocks = (
  blockerId: string,
  callback: (blocked: BlockedUser[]) => void
) => {
  const q = query(collection(db, 'blocks'), where('blockerId', '==', blockerId));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => {
      const x = d.data();
      return {
        blockedId: x.blockedId,
        blockedName: x.blockedName,
        blockedAvatarUrl: x.blockedAvatarUrl,
      } as BlockedUser;
    }));
  }, (error) => {
    console.error('[safety] subscribeToBlocks:', error);
    callback([]);
  });
};

export const submitReport = async (report: {
  reporterId: string;
  reportedUserId: string;
  targetType: ReportTargetType;
  storeId?: string;
  conversationId?: string;
  reason: ReportReason;
  details?: string;
}): Promise<void> => {
  const data: Record<string, any> = {
    reporterId: report.reporterId,
    reportedUserId: report.reportedUserId,
    targetType: report.targetType,
    reason: report.reason,
    status: 'open',
    createdAt: serverTimestamp(),
  };
  if (report.storeId) data.storeId = report.storeId;
  if (report.conversationId) data.conversationId = report.conversationId;
  if (report.details?.trim()) data.details = report.details.trim().slice(0, 500);

  await addDoc(collection(db, 'reports'), data);
};