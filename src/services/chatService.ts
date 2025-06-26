import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Message, ChatMessageUser } from '@/types';

export function getMessages(callback: (messages: Omit<Message, 'isCurrentUser'>[]) => void) {
  const messagesCollection = collection(db, 'messages');
  const q = query(messagesCollection, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate(),
      } as Omit<Message, 'isCurrentUser'>;
    });
    callback(messages);
  });
}

export async function addMessage(text: string, user: ChatMessageUser): Promise<string> {
  const messagesCollection = collection(db, 'messages');
  const docRef = await addDoc(messagesCollection, {
    text,
    user,
    timestamp: serverTimestamp(),
  });
  return docRef.id;
}
