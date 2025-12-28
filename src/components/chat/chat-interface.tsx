"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageComponent } from "./message";
import { useChat } from "ai/react";
import { ChatInput } from "./chat-input";
import { Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
  ScrollButton,
  useStickToBottom,
} from "@/components/prompt-kit/chat-container";

export default function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    error,
  } = useChat({
    api: "/api/chat",
  });

  const {
    scrollRef: containerRef,
    isAtBottom,
    shouldAutoScroll,
    setShouldAutoScroll,
  } = useStickToBottom();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScrollButtonClick = useCallback(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      containerRef.current.scrollTop = scrollHeight - clientHeight;
      setShouldAutoScroll(true);
    }
  }, [setShouldAutoScroll]);

  useEffect(() => {
    if (shouldAutoScroll && containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      containerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages, isLoading, shouldAutoScroll]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        const threshold = 100;
        setShowScrollButton(distanceToBottom > threshold);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 backdrop-blur-md bg-zinc-950/80 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">CodeVibe</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Bot className="w-4 h-4" />
          <span>Llama 3.3 70B</span>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="flex-shrink-0 px-4 py-3 bg-red-500/10 border-b border-red-500/20">
          <div className="max-w-3xl mx-auto flex items-center gap-2 text-red-400 text-sm">
            <span className="font-medium">Connection Error:</span>
            <span>{error.message}</span>
            <button
              onClick={() => reload()}
              className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Messages Container with ChatContainer */}
      <ChatContainerRoot className="flex-1 overflow-hidden">
        <ChatContainerContent ref={containerRef} className="p-4">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  Ready to code together
                </h2>
                <p className="text-zinc-500 max-w-md">
                  Ask me to write, analyze, or execute code. I can run Python in a
                  secure sandbox and help you build anything.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {[
                    "Create a Fibonacci generator",
                    "Plot a sine wave",
                    "Analyze this data",
                    "Build a REST API",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        handleInputChange({
                          target: { value: suggestion },
                        } as React.ChangeEvent<HTMLTextAreaElement>);
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm text-zinc-300 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageComponent key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-3 p-4 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
              </>
            )}
            <ChatContainerScrollAnchor ref={messagesEndRef} />
          </div>
        </ChatContainerContent>

        {/* Scroll to bottom button */}
        <ScrollButton
          show={showScrollButton}
          onClick={handleScrollButtonClick}
          className="absolute right-4 bottom-4 z-10"
        />
      </ChatContainerRoot>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-zinc-800/50 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleFormSubmit}
          isLoading={isLoading}
          stop={stop}
        />
      </div>
    </div>
  );
}
