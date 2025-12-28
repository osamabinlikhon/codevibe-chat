"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

interface ThinkingBarProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  stopLabel?: string;
  onStop?: () => void;
  onClick?: () => void;
}

const ThinkingBar = React.forwardRef<HTMLDivElement, ThinkingBarProps>(
  ({
    className,
    text = "Thinking",
    stopLabel = "Answer now",
    onStop,
    onClick,
    children,
    ...props
  }, ref) => {
    const [dots, setDots] = React.useState("");

    React.useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-4",
          "px-4 py-3 rounded-lg",
          "bg-zinc-800/50 border border-zinc-700/30",
          "transition-all duration-200",
          onClick && "cursor-pointer hover:bg-zinc-800/70",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-zinc-300">{text}</span>
            <span className="text-sm text-zinc-400 w-8">{dots}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onStop && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStop();
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium",
                "bg-zinc-700 hover:bg-zinc-600",
                "text-zinc-200 rounded-md",
                "transition-colors"
              )}
            >
              {stopLabel}
            </button>
          )}
          {children}
        </div>
      </div>
    );
  }
);

ThinkingBar.displayName = "ThinkingBar";

interface ToolPartProps {
  type: string;
  state: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  toolCallId?: string;
  errorText?: string;
}

interface ToolProps {
  toolPart: ToolPartProps;
  defaultOpen?: boolean;
  className?: string;
}

const ToolPart = React.memo(({ part }: { part: ToolPartProps }) => {
  if (!part) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-zinc-500 uppercase">
          {part.type}
        </span>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-700/50 text-zinc-400">
          {part.state}
        </span>
      </div>

      {part.toolCallId && (
        <div className="text-xs text-zinc-600 font-mono">
          ID: {part.toolCallId}
        </div>
      )}

      {part.input && Object.keys(part.input).length > 0 && (
        <div className="text-xs">
          <span className="text-zinc-500">Input: </span>
          <pre className="mt-1 p-2 rounded bg-zinc-800/50 text-zinc-400 overflow-x-auto">
            {JSON.stringify(part.input, null, 2)}
          </pre>
        </div>
      )}

      {part.output && Object.keys(part.output).length > 0 && (
        <div className="text-xs">
          <span className="text-zinc-500">Output: </span>
          <pre className="mt-1 p-2 rounded bg-zinc-800/50 text-emerald-400 overflow-x-auto">
            {JSON.stringify(part.output, null, 2)}
          </pre>
        </div>
      )}

      {part.errorText && (
        <div className="text-xs">
          <span className="text-red-400">Error: </span>
          <pre className="mt-1 p-2 rounded bg-red-500/10 text-red-400 overflow-x-auto">
            {part.errorText}
          </pre>
        </div>
      )}
    </div>
  );
});

ToolPart.displayName = "ToolPart";

const Tool = React.forwardRef<HTMLDivElement, ToolProps>(
  ({ toolPart, defaultOpen = false, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    if (!toolPart) return null;

    const hasContent =
      (toolPart.input && Object.keys(toolPart.input).length > 0) ||
      (toolPart.output && Object.keys(toolPart.output).length > 0) ||
      toolPart.errorText;

    return (
      <div
        ref={ref}
        className={cn(
          "mt-2 rounded-lg overflow-hidden",
          "bg-zinc-900 border border-zinc-700/50",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2",
            "bg-zinc-800/50 border-b border-zinc-700/30",
            hasContent && "cursor-pointer hover:bg-zinc-800/70"
          )}
          onClick={() => hasContent && setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">
              {toolPart.type || "Tool"}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-700/50 text-zinc-500">
              {toolPart.state}
            </span>
          </div>

          {hasContent && (
            <span
              className={cn(
                "text-xs text-zinc-500 transition-transform duration-200",
                isOpen ? "rotate-180" : ""
              )}
            >
              {isOpen ? "Hide" : "Show"} details
            </span>
          )}
        </div>

        {hasContent && isOpen && (
          <div className="p-3">
            <ToolPart part={toolPart} />
          </div>
        )}
      </div>
    );
  }
);

Tool.displayName = "Tool";

export { ThinkingBar, Tool, ToolPart };
