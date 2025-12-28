"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockHeader,
} from "./chat-container";

interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
}

function processMarkdown(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    // Code blocks
    if (lines[i].startsWith("```")) {
      const language = lines[i].slice(3).trim() || "text";
      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }

      if (lines[i]?.startsWith("```")) {
        i++;
      }

      const code = codeLines.join("\n");
      elements.push(
        <CodeBlock key={`code-${elements.length}`}>
          <CodeBlockHeader language={language} />
          <CodeBlockCode code={code} language={language} />
        </CodeBlock>
      );
      continue;
    }

    // Headers
    if (lines[i].startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-bold mb-4 mt-6">
          {lines[i].slice(2)}
        </h1>
      );
      i++;
      continue;
    }

    if (lines[i].startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-semibold mb-3 mt-5">
          {lines[i].slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    if (lines[i].startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-medium mb-2 mt-4">
          {lines[i].slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Inline code
    if (lines[i].includes("`")) {
      const parts = lines[i].split(/(`[^`]+`)/g);
      elements.push(
        <p key={`p-${i}`} className="mb-2 leading-relaxed">
          {parts.map((part, idx) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <code
                  key={idx}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-sm font-mono"
                >
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          })}
        </p>
      );
      i++;
      continue;
    }

    // Empty lines
    if (lines[i].trim() === "") {
      i++;
      continue;
    }

    // Regular paragraphs
    const text = lines[i].replace(/\*\*(.*?)\*\*/g, (_, text) => {
      return `<strong class="font-semibold text-zinc-100">${text}</strong>`;
    });

    elements.push(
      <p
        key={`p-${i}`}
        className="mb-2 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
    i++;
  }

  return elements;
}

const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("prose prose-invert max-w-none", className)}
        {...props}
      >
        {processMarkdown(children)}
      </div>
    );
  }
);

Markdown.displayName = "Markdown";

export { Markdown };
