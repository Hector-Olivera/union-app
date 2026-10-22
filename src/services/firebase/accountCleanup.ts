import {
  collection, doc, query, where, getDocs, getDoc,
  deleteDoc, updateDoc, arrayUnion,
} from 'firebase/firestore';
import { db } from './config';

export const DELETED_USER_NAME = 'Usuario eliminado';

// Se ejecuta con la sesión todavía activa y la reautenticación hecha.
// Las reglas de Firestore exigen estar autenticado para cada paso.
export const cleanUpUserData = async (userId: string): Promise<void> => {
  // 1. Conversaciones: se conservan para el otro participante, con la
  //    identidad de quien se va reemplazada por "Usuario eliminado"
  const conversations = await getDocs(
    query(collection(db, 'conversations'), where('participants', 'array-contains', userId))
  );
  await Promise.all(conversations.docs.map(d =>
    updateDoc(d.ref, {
      [`participantInfo.${userId}`]: { name: DELETED_USER_NAME, deleted: true },
      deletedUsers: arrayUnion(userId),
    })
  ));

  // 2. Bloqueos creados por el usuario
  const blocks = await getDocs(
    query(collection(db, 'blocks'), where('blockerId', '==', userId))
  );
  await Promise.all(blocks.docs.map(d => deleteDoc(d.ref)));

  // 3. Tienda y productos, solo si existe. Leer los productos de una tienda
  //    inexistente da permiso denegado: eso rompía la eliminación de cuentas sin tienda.
  const storeRef = doc(db, 'stores', userId);
  const store = await getDoc(storeRef);
  if (store.exists()) {
    const products = await getDocs(collection(db, 'stores', userId, 'products'));
    await Promise.all(products.docs.map(d => deleteDoc(d.ref)));
    await deleteDoc(storeRef);
  }

  // 4. Datos del perfil (favoritos, historial, aceptación de términos)
  await deleteDoc(doc(db, 'players', userId));
};