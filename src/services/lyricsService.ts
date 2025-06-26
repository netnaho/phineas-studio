import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import type { Song } from '@/types';

export async function getSongs(): Promise<Song[]> {
  const songsCollection = collection(db, 'songs');
  const q = query(songsCollection, orderBy('createdAt', 'desc'));
  const songSnapshot = await getDocs(q);
  const songList = songSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
  return songList;
}

export async function addSong(title: string, lyrics: string): Promise<string> {
  const songsCollection = collection(db, 'songs');
  const docRef = await addDoc(songsCollection, {
    title,
    lyrics,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
