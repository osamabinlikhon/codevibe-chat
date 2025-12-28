"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex gap-3 p-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Message.displayName = "Message";

interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  delayMs?: number;
}

const MessageAvatar = React.forwardRef<HTMLDivElement, MessageAvatarProps>(
  ({ className, src, alt, fallback, delayMs = 600, ...props }, ref) => {
    const [showFallback, setShowFallback] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
      if (delayMs > 0) {
        const timer = setTimeout(() => setShowFallback(true), delayMs);
        return () => clearTimeout(timer);
      }
      setShowFallback(true);
    }, [delayMs]);

    const handleLoad = () => {
      setLoaded(true);
      setShowFallback(false);
    };

    if (!showFallback && !loaded) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600",
            "animate-pulse",
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600",
          "flex items-center justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        {fallback ? (
          <span className="text-xs font-medium text-white">{fallback}</span>
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
    );
  }
);
MessageAvatar.displayName = "MessageAvatar";

interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  markdown?: boolean;
}

const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className, children, markdown = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col max-w-[80%]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageContent.displayName = "MessageContent";

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "user" | "assistant";
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ className, variant = "assistant", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl px-4 py-2.5",
          variant === "user"
            ? "bg-indigo-600 text-white rounded-tr-sm"
            : "bg-zinc-800/80 text-zinc-100 rounded-tl-sm",
          className
        )}
        {...props}
      />
    );
  }
);
MessageBubble.displayName = "MessageBubble";

interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MessageActions = React.forwardRef<HTMLDivElement, MessageActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1 mt-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageActions.displayName = "MessageActions";

interface ReasoningProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isStreaming?: boolean;
}

const Reasoning = React.forwardRef<HTMLDivElement, ReasoningProps>(
  ({ className, children, open, onOpenChange, isStreaming = true, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(true);

    const controlledOpen = open !== undefined ? open : isOpen;
    const handleOpenChange = onOpenChange || setIsOpen;

    React.useEffect(() => {
      if (!isStreaming && controlledOpen) {
        const timer = setTimeout(() => {
          handleOpenChange(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [isStreaming, controlledOpen, handleOpenChange]);

    return (
      <div
        ref={ref}
        className={cn(
          "mt-2 overflow-hidden transition-all duration-300",
          controlledOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          className
        )}
        {...props}
      >
        <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
          {children}
        </div>
      </div>
    );
  }
);
Reasoning.displayName = "Reasoning";

interface ReasoningTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ReasoningTrigger = React.forwardRef<HTMLButtonElement, ReasoningTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-400",
          "transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ReasoningTrigger.displayName = "ReasoningTrigger";

interface ReasoningContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  markdown?: boolean;
}

const ReasoningContent = React.forwardRef<HTMLDivElement, ReasoningContentProps>(
  ({ className, children, markdown = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "text-sm text-zinc-400",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ReasoningContent.displayName = "ReasoningContent";

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageBubble,
  MessageActions,
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
};
