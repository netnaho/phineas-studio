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
import { Music, Plus } from "lucide-react";
import { useState } from "react";
import { NewSongDialog } from "./new-song-dialog";

interface Song {
  title: string;
  lyrics: string;
}

const initialLyricsData: Song[] = [
  {
    title: "Echoes of the Valley",
    lyrics: `(Verse 1)
In the quiet of the morning light,
A gentle mist, a silver white.
The valley wakes, a sleepy sigh,
Beneath the vast and endless sky.

(Chorus)
Oh, echoes of the valley call,
A silent song that touches all.
Through whispering trees and flowing streams,
Living out our wildest dreams.`,
  },
  {
    title: "City of a Thousand Lights",
    lyrics: `(Verse 1)
Neon glows in the pouring rain,
A symphony of joy and pain.
Streetlights paint the night with gold,
A story waiting to be told.

(Chorus)
City of a thousand lights,
Burning through the darkest nights.
We're just a flicker in the gleam,
Caught inside a vibrant dream.`,
  },
  {
    title: "Ocean's Lullaby",
    lyrics: `(Verse 1)
The waves crash in, a steady beat,
Salty air, so bittersweet.
The sun dips low, a fiery kiss,
Filling us with tranquil bliss.

(Chorus)
The ocean's lullaby so deep,
Secrets that the waters keep.
Rocking us to gentle sleep,
Promises we're bound to keep.`,
  },
];

export function LyricsPanel() {
  const [lyricsData, setLyricsData] = useState<Song[]>(initialLyricsData);
  
  const handleAddSong = (title: string, lyrics: string) => {
    const newSong: Song = { title, lyrics };
    setLyricsData(prevSongs => [newSong, ...prevSongs]);
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
        <Accordion type="single" collapsible className="w-full">
          {lyricsData.map((song, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{song.title}</AccordionTrigger>
              <AccordionContent>
                <pre className="whitespace-pre-wrap font-sans text-sm">{song.lyrics}</pre>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
