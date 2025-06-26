"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect, FormEvent } from "react";
import { getMessages, addMessage } from "@/services/chatService";
import type { Message, ChatMessageUser } from "@/types";
import { useToast } from "@/hooks/use-toast";


// Simplification: In a real app, user data would come from an auth context.
const currentUser: ChatMessageUser = {
    name: "User",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
};

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = getMessages((messages) => {
      setMessages(messages);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [messages]);
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    const textToSend = newMessage;
    setNewMessage("");

    try {
      await addMessage(textToSend, currentUser);
    } catch(error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message.",
        variant: "destructive"
      });
      // Restore message on failure
      setNewMessage(textToSend);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-headline">Group Chat</CardTitle>
        </div>
        <CardDescription>Discuss ideas and coordinate with the group.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-3",
                    msg.isCurrentUser && "justify-end"
                  )}
                >
                  {!msg.isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.user.avatar} />
                      <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xs rounded-lg px-3 py-2 text-sm",
                      msg.isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {!msg.isCurrentUser && <p className="font-semibold text-xs pb-1">{msg.user.name}</p>}
                    <p>{msg.text}</p>
                  </div>
                  {msg.isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.user.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
