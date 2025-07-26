"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Paperclip, Mic, Image } from "lucide-react";

export default function ChatAssistant() {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      type: "assistant",
      content: "Hello! I'm your Sahayak AI Assistant. I can help you with lesson planning, content creation, grading, and much more. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "assistant",
        content: "I understand you'd like help with that. Let me assist you with creating educational content. Could you please provide more details about the specific topic or grade level you're working with?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Chat Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.type === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-muted-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Image className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything to your AI Assistant..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="sahayak-button w-auto px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
