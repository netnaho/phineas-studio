import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { AudioFile } from '@/types';

export async function getAudioFiles(): Promise<AudioFile[]> {
    const audioFilesCollection = collection(db, 'audioFiles');
    const q = query(audioFilesCollection, orderBy('createdAt', 'desc'));
    const audioFilesSnapshot = await getDocs(q);
    const audioFilesList = audioFilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AudioFile));
    return audioFilesList;
}

export async function uploadAudioFile(file: File, title: string, uploader: string): Promise<AudioFile> {
    if (!file) throw new Error("No file provided for upload.");

    const storageRef = ref(storage, `audio/${Date.now()}_${file.name}`);
    
    // Upload the file
    const uploadResult = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const url = await getDownloadURL(uploadResult.ref);

    // Get audio duration
    const duration = await new Promise<number>((resolve, reject) => {
        const audio = document.createElement('audio');
        audio.onloadedmetadata = () => {
            resolve(audio.duration);
            URL.revokeObjectURL(audio.src);
        };
        audio.onerror = reject;
        audio.src = URL.createObjectURL(file);
    });
    
    const formatDuration = (time: number) => {
        if (!isFinite(time) || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const newAudioFileData = {
        title,
        uploader,
        url,
        duration: formatDuration(duration),
        cover: "https://placehold.co/100x100.png", // placeholder
        hint: "new upload",
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'audioFiles'), newAudioFileData);

    return { id: docRef.id, ...newAudioFileData, createdAt: new Date() } as unknown as AudioFile;
}
