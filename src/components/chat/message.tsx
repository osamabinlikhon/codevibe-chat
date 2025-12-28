"use client";

import { ToolInvocation, UIMessage } from "ai";
import { cn } from "@/lib/utils";
import { Terminal, Loader2 } from "lucide-react";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageBubble,
  Reasoning,
  ReasoningContent,
} from "@/components/prompt-kit/message";
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockHeader,
} from "@/components/prompt-kit/chat-container";

interface MessageProps {
  message: UIMessage;
}

function CodeBlockDisplay({ code, output }: { code: string; output?: string }) {
  return (
    <div className="mt-3 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700/50">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-zinc-700/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-400">Python</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs text-zinc-500">Executed</span>
        </div>
      </div>
      <CodeBlockCode code={code} language="python" />
      {output && (
        <div className="p-3 pt-0 font-mono text-sm">
          <pre className="text-emerald-400 whitespace-pre-wrap break-words">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

function ToolResult({ toolInvocation }: { toolInvocation: ToolInvocation }) {
  const isVisible = toolInvocation.state === "result";

  if (!isVisible) {
    return (
      <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Executing code...</span>
      </div>
    );
  }

  const result = toolInvocation.result as {
    code?: string;
    stdout?: string;
    stderr?: string;
  };

  if (result?.code) {
    return (
      <CodeBlockDisplay
        code={result.code}
        output={result.stdout || result.stderr}
      />
    );
  }

  return null;
}

export function MessageComponent({ message }: MessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isData = message.role === "data";

  if (isData) {
    return null;
  }

  return (
    <Message className={isUser ? "justify-end" : "justify-start"}>
      {!isUser && (
        <MessageAvatar fallback="AI" />
      )}
      <MessageContent>
        <MessageBubble variant={isUser ? "user" : "assistant"}>
          {message.content && (
            <div className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          )}
        </MessageBubble>

        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="mt-2 w-full max-w-md">
            {message.toolInvocations.map((tool) => (
              <ToolResult key={tool.toolCallId} toolInvocation={tool} />
            ))}
          </div>
        )}

        {isAssistant && (
          <Reasoning isStreaming={false}>
            <ReasoningContent>
              <div className="text-xs text-zinc-500">
                AI is analyzing your request and preparing the response...
              </div>
            </ReasoningContent>
          </Reasoning>
        )}
      </MessageContent>
      {isUser && <MessageAvatar fallback="You" />}
    </Message>
  );
}
