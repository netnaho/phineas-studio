"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Mic, Pause, Play, Upload, Volume2, VolumeX } from "lucide-react";
import React, { useState, useRef, useEffect, type FC } from "react";
import Image from "next/image";
import { UploadAudioDialog } from "./upload-audio-dialog";

const initialAudioFiles = [
  {
    title: "Echoes of the Valley - Practice",
    uploader: "Alex",
    duration: "3:45",
    url: "/audio/placeholder-1.mp3",
    cover: "https://placehold.co/100x100.png",
    hint: "concert performance"
  },
  {
    title: "City Lights - Harmony Part",
    uploader: "Sam",
    duration: "2:15",
    url: "/audio/placeholder-2.mp3",
    cover: "https://placehold.co/100x100.png",
    hint: "studio recording"
  },
  {
    title: "Ocean's Lullaby - Full Mix",
    uploader: "Casey",
    duration: "4:30",
    url: "/audio/placeholder-3.mp3",
    cover: "https://placehold.co/100x100.png",
    hint: "acoustic guitar"
  },
];

interface AudioFile {
    title: string;
    uploader: string;
    duration: string;
    url: string;
    cover: string;
    hint: string;
}

interface AudioPlayerProps {
  file: AudioFile;
  isPlaying: boolean;
  onPlay: (url: string) => void;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ file, isPlaying, onPlay }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audioUrl = file.url.startsWith('blob:') ? file.url : `/${file.url.replace(/^\//, '')}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => {
        const newTime = audio.currentTime;
        setCurrentTime(newTime);
        setProgress(newTime > 0 ? (newTime / audio.duration) * 100 : 0);
      };

      audio.addEventListener("loadeddata", setAudioData);
      audio.addEventListener("timeupdate", setAudioTime);
      audio.addEventListener("ended", () => onPlay(""));

      return () => {
        audio.removeEventListener("loadeddata", setAudioData);
        audio.removeEventListener("timeupdate", setAudioTime);
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      };
    }
  }, [file.url, onPlay]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if(value[0] === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Image
        src={file.cover}
        alt={file.title}
        width={64}
        height={64}
        className="rounded-md"
        data-ai-hint={file.hint}
      />
      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex-1">
          <p className="font-semibold">{file.title}</p>
          <p className="text-sm text-muted-foreground">Uploaded by {file.uploader}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button size="icon" variant="ghost" onClick={() => onPlay(isPlaying ? "" : file.url)}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2 flex-1 sm:w-48">
            <span className="text-xs font-mono w-10 text-muted-foreground">{formatTime(currentTime)}</span>
            <Slider
              value={[progress]}
              onValueChange={handleProgressChange}
              className="w-full"
            />
            <span className="text-xs font-mono w-10 text-muted-foreground">{formatTime(duration || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => setIsMuted(!isMuted)}>
                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5"/> : <Volume2 className="h-5 w-5"/>}
            </Button>
            <Slider value={[isMuted ? 0 : volume]} onValueChange={handleVolumeChange} max={1} step={0.1} className="w-20"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export function AudioPanel() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>(initialAudioFiles);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string>("");

  const handleUpload = (title: string, file: File) => {
    const newAudioFile: AudioFile = {
      title,
      uploader: 'User',
      duration: '0:00',
      url: URL.createObjectURL(file),
      cover: "https://placehold.co/100x100.png",
      hint: "new upload"
    };
    setAudioFiles(prevFiles => [...prevFiles, newAudioFile]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <Mic className="h-6 w-6 text-primary" />
              </div>
            <CardTitle className="font-headline">Audio Recordings</CardTitle>
          </div>
          <UploadAudioDialog onUpload={handleUpload}>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </UploadAudioDialog>
        </div>
        <CardDescription>
          Listen to practice sessions and harmony parts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {audioFiles.map((file) => (
            <AudioPlayer
              key={file.url}
              file={file}
              isPlaying={currentlyPlaying === file.url}
              onPlay={setCurrentlyPlaying}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
