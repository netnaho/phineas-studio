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
import { useToast } from "@/hooks/use-toast";
import { useState, type FC } from "react";

interface UploadAudioDialogProps {
  onUpload: (title: string, file: File) => void;
  children: React.ReactNode;
}

export const UploadAudioDialog: FC<UploadAudioDialogProps> = ({ onUpload, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleUpload = () => {
    if (!title || !file) {
      toast({
        title: "Missing fields",
        description: "Please provide a title and select a file.",
        variant: "destructive",
      });
      return;
    }
    onUpload(title, file);
    setIsOpen(false);
    setTitle("");
    setFile(null);
     toast({
        title: "Upload successful",
        description: `"${title}" has been added.`,
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Audio</DialogTitle>
          <DialogDescription>
            Add a new audio recording to the repository. Fill in the details below.
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
              placeholder="E.g. Echoes of the Valley - Part 1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="audio-file" className="text-right">
              Audio File
            </Label>
            <Input
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
