"use client";

import { useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, StopCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  stop: () => void;
  placeholder?: string;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  placeholder = "Ask me anything, or request code execution...",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (input.trim() && !isLoading) {
          handleSubmit(e as unknown as React.FormEvent);
        }
      }
    },
    [input, isLoading, handleSubmit]
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim() && !isLoading) {
            handleSubmit(e);
          }
        }}
        className="relative flex items-end gap-2 p-4"
      >
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[56px] max-h-[200px] pr-12 resize-none rounded-2xl bg-zinc-800/50 border-zinc-700/50 focus:bg-zinc-800/80 transition-all duration-200"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          size="icon"
          className={cn(
            "rounded-full h-12 w-12 transition-all duration-200",
            isLoading
              ? "bg-zinc-700"
              : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
          )}
        >
          {isLoading ? (
            <StopCircle className="w-5 h-5 animate-pulse" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </form>
      <p className="text-center text-xs text-zinc-500 pb-4">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
}
