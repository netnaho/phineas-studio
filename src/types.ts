export interface Song {
  id: string;
  title: string;
  lyrics: string;
}

export interface ChatMessageUser {
  uid: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  user: ChatMessageUser;
  text: string;
  isCurrentUser: boolean;
  timestamp: Date;
}

export interface AudioFile {
  id: string;
  title: string;
  uploader: string | null;
  uploaderId: string;
  duration: string;
  url: string;
  cover: string;
  hint: string;
}
