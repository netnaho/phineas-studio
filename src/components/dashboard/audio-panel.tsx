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
import { Mic, Pause, Play, Upload, Volume2, VolumeX, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect, type FC } from "react";
import Image from "next/image";
import { UploadAudioDialog } from "./upload-audio-dialog";
import { getAudioFiles, uploadAudioFile } from "@/services/audioService";
import type { AudioFile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
  
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setProgress(
      audioRef.current.duration > 0
        ? (audioRef.current.currentTime / audioRef.current.duration) * 100
        : 0
    );
  };
  
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <audio
        ref={audioRef}
        src={file.url}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => onPlay("")}
        preload="metadata"
      />
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
            <span className="text-xs font-mono w-10 text-muted-foreground">{formatTime(duration) || file.duration}</span>
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
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAudioFiles = async () => {
        try {
            const files = await getAudioFiles();
            setAudioFiles(files);
        } catch (error) {
            console.error("Error fetching audio files:", error);
            toast({
                title: "Error",
                description: "Could not fetch audio files.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    fetchAudioFiles();
  }, [toast]);

  const handleUpload = async (title: string, file: File) => {
    if (!user) {
        toast({
            title: "Authentication Error",
            description: "You must be signed in to upload files.",
            variant: "destructive",
        });
        return;
    }
    try {
      await uploadAudioFile(file, title, user);
      const files = await getAudioFiles();
      setAudioFiles(files);
      toast({
          title: "Upload successful",
          description: `"${title}" has been added.`,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
          title: "Upload failed",
          description: "Could not upload the audio file.",
          variant: "destructive",
      });
    }
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
            <Button disabled={!user}>
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
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {audioFiles.map((file) => (
              <AudioPlayer
                key={file.id}
                file={file}
                isPlaying={currentlyPlaying === file.url}
                onPlay={setCurrentlyPlaying}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
