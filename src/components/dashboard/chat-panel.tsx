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
import type { Message } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = getMessages((messages) => {
      const updatedMessages = messages.map(msg => ({
        ...msg,
        isCurrentUser: msg.user.uid === user.uid
      }));
      setMessages(updatedMessages);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);
  
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
    if (newMessage.trim() === "" || !user) return;
    
    const textToSend = newMessage;
    setNewMessage("");

    try {
      await addMessage(textToSend, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        avatar: user.avatar,
      });
    } catch(error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message.",
        variant: "destructive"
      });
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
                      <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
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
            disabled={!user}
          />
          <Button type="submit" size="icon" disabled={!user || newMessage.trim() === ""}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
