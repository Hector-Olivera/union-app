import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { LEGAL } from '@constants/legal';

// Guarda la versión aceptada y cuándo, como constancia.
export const acceptTerms = async (userId: string): Promise<void> => {
  await setDoc(
    doc(db, 'players', userId),
    { termsAcceptedVersion: LEGAL.termsVersion, termsAcceptedAt: serverTimestamp() },
    { merge: true }
  );
};