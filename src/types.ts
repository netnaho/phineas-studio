export interface Song {
  id: string;
  title: string;
  lyrics: string;
}

export interface ChatMessageUser {
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
  uploader: string;
  duration: string;
  url: string;
  cover: string;
  hint: string;
}
