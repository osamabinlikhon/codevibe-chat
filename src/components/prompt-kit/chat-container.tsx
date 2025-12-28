"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

function useStickToBottom() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);

  React.useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let animationFrameId: number;
    let isAtBottomTimeout: NodeJS.Timeout;

    const checkIsAtBottom = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      const threshold = 50;
      const atBottom = distanceToBottom <= threshold;

      setIsAtBottom(atBottom);
      setShouldAutoScroll((prev) => (atBottom ? true : prev));
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      const threshold = 50;
      const atBottom = distanceToBottom <= threshold;

      if (atBottom) {
        setIsAtBottom(true);
        setShouldAutoScroll(true);
      } else {
        setIsAtBottom(false);
        setShouldAutoScroll(false);
      }
    };

    const autoScroll = () => {
      if (shouldAutoScroll && element) {
        const { scrollHeight, clientHeight } = element;
        element.scrollTop = scrollHeight - clientHeight;
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(autoScroll);

    const resizeObserver = new ResizeObserver(() => {
      if (shouldAutoScroll && element) {
        const { scrollHeight, clientHeight } = element;
        element.scrollTop = scrollHeight - clientHeight;
      }
    });

    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [shouldAutoScroll]);

  return { scrollRef, isAtBottom, shouldAutoScroll, setShouldAutoScroll };
}

interface ChatContainerRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ChatContainerRoot = React.forwardRef<HTMLDivElement, ChatContainerRootProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative flex flex-col h-full", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatContainerRoot.displayName = "ChatContainerRoot";

interface ChatContainerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ChatContainerContent = React.forwardRef<
  HTMLDivElement,
  ChatContainerContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-y-auto scroll-smooth",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ChatContainerContent.displayName = "ChatContainerContent";

interface ChatContainerScrollAnchorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ChatContainerScrollAnchor = React.forwardRef<
  HTMLDivElement,
  ChatContainerScrollAnchorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("h-px w-full shrink-0", className)}
      {...props}
    />
  );
});
ChatContainerScrollAnchor.displayName = "ChatContainerScrollAnchor";

interface ScrollButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  show?: boolean;
}

const ScrollButton = React.forwardRef<HTMLButtonElement, ScrollButtonProps>(
  ({ className, show = true, children, ...props }, ref) => {
    if (!show) return null;

    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100",
          "transition-all duration-200 shadow-lg",
          "border border-zinc-700/50",
          className
        )}
        {...props}
      >
        {children || <ChevronDown className="w-5 h-5" />}
      </button>
    );
  }
);
ScrollButton.displayName = "ScrollButton";

interface ChainOfThoughtProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ChainOfThought = React.forwardRef<
  HTMLDivElement,
  ChainOfThoughtProps
>(({ className, children, ...props }, ref) => {
  return (
    <Collapsible defaultOpen className={className} {...props} ref={ref}>
      {children}
    </Collapsible>
  );
});
ChainOfThought.displayName = "ChainOfThought";

interface ChainOfThoughtStepProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isLast?: boolean;
}

const ChainOfThoughtStep = React.forwardRef<
  HTMLDivElement,
  ChainOfThoughtStepProps
>(({ className, children, isLast = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-start gap-2 p-3 rounded-lg",
        "bg-zinc-800/50 border border-zinc-700/30",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {!isLast && (
        <div className="w-px h-full absolute left-6 top-8 bg-zinc-700/50" />
      )}
      {children}
    </div>
  );
});
ChainOfThoughtStep.displayName = "ChainOfThoughtStep";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "not-prose overflow-hidden rounded-lg",
          "bg-zinc-900 border border-zinc-700/50",
          "my-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

interface CodeBlockCodeProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
  theme?: string;
}

const CodeBlockCode = React.forwardRef<HTMLPreElement, CodeBlockCodeProps>(
  ({ className, code, language = "tsx", theme = "github-dark", ...props }, ref) => {
    // Simple syntax highlighting simulation
    const highlightedCode = React.useMemo(() => {
      if (!code) return "";
      
      // Basic keyword highlighting
      const keywords = /\b(function|const|let|var|return|import|export|from|async|await|if|else|for|while|class|def|print|return|True|False|None)\b/g;
      const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
      const numbers = /\b\d+\.?\d*\b/g;
      const comments = /#.*$/gm;
      
      let html = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(comments, '<span class="text-zinc-500">$&</span>')
        .replace(keywords, '<span class="text-purple-400">$&</span>')
        .replace(strings, '<span class="text-emerald-400">$&</span>')
        .replace(numbers, '<span class="text-amber-400">$&</span>');
      
      return html;
    }, [code]);

    return (
      <pre
        ref={ref}
        className={cn(
          "p-4 overflow-x-auto font-mono text-sm leading-relaxed",
          "text-zinc-300",
          className
        )}
        {...props}
      >
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    );
  }
);
CodeBlockCode.displayName = "CodeBlockCode";

interface CodeBlockHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  language?: string;
  showLineNumbers?: boolean;
}

const CodeBlockHeader = React.forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({ className, language = "text", showLineNumbers = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between px-4 py-2",
          "bg-zinc-800/50 border-b border-zinc-700/30",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-xs text-zinc-500 font-medium uppercase">
            {language}
          </span>
        </div>
        {children}
      </div>
    );
  }
);
CodeBlockHeader.displayName = "CodeBlockHeader";

interface CodeBlockGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CodeBlockGroup = React.forwardRef<HTMLDivElement, CodeBlockGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CodeBlockGroup.displayName = "CodeBlockGroup";

export {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
  ScrollButton,
  ChainOfThought,
  ChainOfThoughtStep,
  CodeBlock,
  CodeBlockCode,
  CodeBlockHeader,
  CodeBlockGroup,
  TextShimmer,
  useStickToBottom,
};

interface TextShimmerProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  duration?: number;
  spread?: number;
  className?: string;
}

const TextShimmer = ({
  children,
  as: Component = "span",
  duration = 4,
  spread = 20,
  className,
}: TextShimmerProps) => {
  return (
    <Component
      className={cn(
        "relative inline-block overflow-hidden",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 z-20 animate-shimmer pointer-events-none"
        style={{
          background: `linear-gradient(
              to right,
              transparent 0%,
              currentColor 50%,
              transparent ${spread}%
            )`,
          backgroundSize: "200% 100%",
          animationDuration: `${duration}s`,
        }}
        aria-hidden="true"
      />
    </Component>
  );
};
TextShimmer.displayName = "TextShimmer";
