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
import { MessageSquare, Send } from "lucide-react";
import React, { useState, useRef, useEffect, FormEvent } from "react";

interface Message {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  isCurrentUser: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    user: { name: "Alex", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    text: "Hey everyone! How's practice for 'Echoes' going?",
    isCurrentUser: false,
  },
  {
    id: 2,
    user: { name: "User", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    text: "Going well! I just uploaded my part for the harmony.",
    isCurrentUser: true,
  },
  {
    id: 3,
    user: { name: "Sam", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
    text: "Awesome, I'll give it a listen. I'm struggling a bit with the bridge.",
    isCurrentUser: false,
  },
  {
    id: 4,
    user: { name: "Casey", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f" },
    text: "Maybe we can try it together during our next session?",
    isCurrentUser: false,
  },
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [messages]);
  

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const msg: Message = {
      id: messages.length + 1,
      user: { name: "User", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
      text: newMessage,
      isCurrentUser: true,
    };
    setMessages([...messages, msg]);
    setNewMessage("");
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
