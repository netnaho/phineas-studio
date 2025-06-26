"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { NewSongDialog } from "./new-song-dialog";
import { getSongs, addSong } from "@/services/lyricsService";
import type { Song } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function LyricsPanel() {
  const [lyricsData, setLyricsData] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await getSongs();
        setLyricsData(songs);
      } catch (error) {
        console.error("Error fetching songs:", error);
        toast({
            title: "Error",
            description: "Could not fetch song lyrics.",
            variant: "destructive"
        })
      } finally {
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, [toast]);
  
  const handleAddSong = async (title: string, lyrics: string) => {
    try {
        await addSong(title, lyrics);
        // Optimistically update UI or re-fetch
        const songs = await getSongs();
        setLyricsData(songs);
        toast({
            title: "Song Added",
            description: `"${title}" has been added to the repository.`,
        });
    } catch (error) {
        console.error("Error adding song:", error);
        toast({
            title: "Error",
            description: "Could not add the new song.",
            variant: "destructive"
        })
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-md">
                    <Music className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">Lyrics Repository</CardTitle>
            </div>
            <NewSongDialog onAddSong={handleAddSong}>
                <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    New Song
                </Button>
            </NewSongDialog>
        </div>
        <CardDescription>
          Browse and manage lyrics for your group's songs.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {lyricsData.map((song) => (
              <AccordionItem value={song.id} key={song.id}>
                <AccordionTrigger>{song.title}</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap font-sans text-sm">{song.lyrics}</pre>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
