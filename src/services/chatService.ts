import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Message, ChatMessageUser } from '@/types';

export function getMessages(callback: (messages: Message[]) => void) {
  const messagesCollection = collection(db, 'messages');
  const q = query(messagesCollection, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate(),
        // This is a simplification. In a real app, you'd have user auth.
        isCurrentUser: data.user.name === 'User'
      } as Message;
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
