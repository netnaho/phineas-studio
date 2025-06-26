"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, type FC, useTransition } from "react";

interface NewSongDialogProps {
  onAddSong: (title: string, lyrics: string) => Promise<void>;
  children: React.ReactNode;
}

export const NewSongDialog: FC<NewSongDialogProps> = ({ onAddSong, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAddSong = () => {
    if (!title || !lyrics) {
      toast({
        title: "Missing fields",
        description: "Please provide a title and lyrics for the new song.",
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
        await onAddSong(title, lyrics);
        setIsOpen(false);
        setTitle("");
        setLyrics("");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Create a new song with a title and lyrics.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Song title"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="lyrics" className="text-right pt-2">
              Lyrics
            </Label>
            <Textarea
              id="lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="col-span-3 min-h-[200px]"
              placeholder="(Verse 1)..."
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddSong} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Song
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
