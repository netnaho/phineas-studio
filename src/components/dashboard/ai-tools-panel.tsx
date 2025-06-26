"use client";

import { suggestLyrics } from "@/ai/flows/suggest-lyrics";
import { transcribeAudio } from "@/ai/flows/transcribe-audio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";

export function AiToolsPanel() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Transcription state
  const [transcriptionFile, setTranscriptionFile] = useState<File | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Suggestion state
  const [suggestionLyrics, setSuggestionLyrics] = useState("");
  const [suggestionFile, setSuggestionFile] = useState<File | null>(null);
  const [suggestionResult, setSuggestionResult] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleTranscribe = async () => {
    if (!transcriptionFile) {
      toast({
        title: "No file selected",
        description: "Please select an audio file to transcribe.",
        variant: "destructive",
      });
      return;
    }

    setIsTranscribing(true);
    setTranscriptionResult("");

    startTransition(async () => {
      try {
        const audioDataUri = await fileToDataUri(transcriptionFile);
        const result = await transcribeAudio({ audioDataUri });
        setTranscriptionResult(result.transcription);
      } catch (error) {
        console.error(error);
        toast({
          title: "Transcription failed",
          description: "Could not transcribe the audio file.",
          variant: "destructive",
        });
      } finally {
        setIsTranscribing(false);
      }
    });
  };

  const handleSuggest = async () => {
    if (!suggestionLyrics && !suggestionFile) {
      toast({
        title: "No input provided",
        description:
          "Please provide some existing lyrics or an audio file to get suggestions.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestionResult("");

    startTransition(async () => {
      try {
        let audioRecording: string | undefined;
        if (suggestionFile) {
          audioRecording = await fileToDataUri(suggestionFile);
        }
        const result = await suggestLyrics({
          existingLyrics: suggestionLyrics,
          audioRecording,
        });
        setSuggestionResult(result.suggestedLyrics);
      } catch (error) {
        console.error(error);
        toast({
          title: "Suggestion failed",
          description: "Could not generate lyric suggestions.",
          variant: "destructive",
        });
      } finally {
        setIsSuggesting(false);
      }
    });
  };

  const isLoading = isPending || isTranscribing || isSuggesting;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-headline">AI Songwriter Assistant</CardTitle>
        </div>
        <CardDescription>
          Use AI to transcribe recordings or get lyric ideas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transcribe">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transcribe">Transcribe Audio</TabsTrigger>
            <TabsTrigger value="suggest">Suggest Lyrics</TabsTrigger>
          </TabsList>
          <TabsContent value="transcribe" className="mt-4">
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="audio-file-transcribe">Audio File</Label>
                <Input
                  id="audio-file-transcribe"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setTranscriptionFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button onClick={handleTranscribe} disabled={isLoading || !transcriptionFile}>
                {isLoading && isTranscribing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Transcribe
              </Button>
              {transcriptionResult && (
                <div className="space-y-2">
                  <Label>Transcription Result</Label>
                  <Textarea
                    readOnly
                    value={transcriptionResult}
                    className="h-32"
                  />
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="suggest" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="existing-lyrics">
                  Existing Lyrics (optional)
                </Label>
                <Textarea
                  id="existing-lyrics"
                  placeholder="Enter some lyrics to get suggestions..."
                  value={suggestionLyrics}
                  onChange={(e) => setSuggestionLyrics(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="audio-file-suggest">
                  Audio Recording (optional)
                </Label>
                <Input
                  id="audio-file-suggest"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setSuggestionFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button onClick={handleSuggest} disabled={isLoading || (!suggestionLyrics && !suggestionFile)}>
                {isLoading && isSuggesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Get Suggestions
              </Button>
              {suggestionResult && (
                <div className="space-y-2">
                  <Label>Suggested Lyrics</Label>
                  <Textarea
                    readOnly
                    value={suggestionResult}
                    className="h-32"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
