/**
 * MDX Components Library for CodeVibe Chat
 * 
 * Features:
 * - LinearProcessFlow: Multi-step process visualization
 * - Quiz: Interactive questionnaires
 * - Math: LaTeX formatting support
 * - Extended code blocks with metadata
 * - Chain of Thought integration
 */

import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// ============================================
// Type Definitions
// ============================================

interface ProcessStep {
  title: string;
  description: string;
  status?: 'pending' | 'active' | 'completed' | 'error';
  icon?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface CodeBlockMeta {
  project?: string;
  file?: string;
  type?: string;
  title?: string;
  language?: string;
}

// ============================================
// LinearProcessFlow Component
// ============================================

/**
 * Multi-step process visualization component
 */
export function LinearProcessFlow({ 
  steps, 
  currentStep = 0,
  onStepClick
}: { 
  steps: ProcessStep[];
  currentStep?: number;
  onStepClick?: (index: number) => void;
}) {
  return (
    <div className="linear-process-flow">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            {/* Step Circle */}
            <div 
              className={`
                relative flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer
                ${index <= currentStep ? 'border-primary bg-primary text-white' : 'border-gray-300 text-gray-400'}
                ${index < steps.length - 1 ? 'flex-1' : ''}
              `}
              onClick={() => onStepClick?.(index)}
            >
              {step.status === 'completed' ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="font-semibold">{index + 1}</span>
              )}
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded whitespace-nowrap">
                {step.title}
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-1 mx-2 rounded
                ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Current Step Details */}
      {steps[currentStep] && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">{steps[currentStep].title}</h4>
          <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// Quiz Component
// ============================================

/**
 * Interactive questionnaire component
 */
export function Quiz({ 
  questions, 
  onComplete 
}: { 
  questions: QuizQuestion[];
  onComplete?: (score: number, answers: Record<string, number>) => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleNext = () => {
    const newAnswers = { ...answers, [question.id]: selectedAnswer! };
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      const score = Object.entries(newAnswers).filter(
        ([qId, ans]) => questions.find(q => q.id === qId)?.correctAnswer === ans
      ).length;
      onComplete?.(score, newAnswers);
    }
  };

  if (isComplete) {
    const score = Object.entries(answers).filter(
      ([qId, ans]) => questions.find(q => q.id === qId)?.correctAnswer === ans
    ).length;
    
    return (
      <div className="quiz-complete p-6 bg-green-50 rounded-lg">
        <h3 className="text-xl font-bold text-green-800 mb-4">Quiz Complete!</h3>
        <p className="text-lg">
          Score: <span className="font-bold">{score}</span> / <span className="font-bold">{questions.length}</span>
        </p>
        <p className="text-sm text-green-600 mt-2">
          {score === questions.length ? 'Perfect score! 🎉' : 
           score >= questions.length * 0.7 ? 'Great job! 👍' : 
           'Keep learning! 📚'}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="mb-4">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h4 className="text-lg font-semibold mb-4">{question.question}</h4>

      <div className="space-y-2 mb-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showExplanation && setSelectedAnswer(index)}
            disabled={showExplanation}
            className={`
              w-full p-3 text-left rounded-lg border transition-colors
              ${showExplanation && index === question.correctAnswer 
                ? 'border-green-500 bg-green-50' 
                : showExplanation && index === selectedAnswer && !isCorrect
                ? 'border-red-500 bg-red-50'
                : selectedAnswer === index 
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:bg-muted'}
            `}
          >
            <span className="font-medium mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className={`
          p-4 rounded-lg mb-4
          ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
        `}>
          <p className="font-medium mb-1">
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          {question.explanation && (
            <p className="text-sm">{question.explanation}</p>
          )}
        </div>
      )}

      <button
        onClick={showExplanation ? handleContinue : handleNext}
        disabled={selectedAnswer === null}
        className="btn btn-primary"
      >
        {showExplanation ? 'Continue' : 'Submit Answer'}
      </button>
    </div>
  );
}

// ============================================
// Math Component (LaTeX Rendering)
// ============================================

/**
 * LaTeX math expression renderer using KaTeX
 */
export function Math({ 
  expression, 
  displayMode = true 
}: { 
  expression: string; 
  displayMode?: boolean;
}) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      const rendered = katex.renderToString(expression, {
        displayMode,
        throwOnError: false,
      });
      setHtml(rendered);
    } catch (error) {
      setHtml(`<span class="text-red-500">Error rendering LaTeX</span>`);
    }
  }, [expression, displayMode]);

  return (
    <span 
      className="math-expression"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ============================================
// Extended Code Block Component
// ============================================

/**
 * Enhanced code block with metadata support
 */
export function ExtendedCodeBlock({
  children,
  meta
}: {
  children: string;
  meta?: CodeBlockMeta;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="extended-code-block my-4 rounded-lg overflow-hidden border border-gray-200">
      {/* Header */}
      {(meta?.project || meta?.file || meta?.type) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {meta?.project && (
              <span className="text-xs font-medium text-gray-600">
                📁 {meta.project}
              </span>
            )}
            {meta?.file && (
              <span className="text-xs text-gray-500">
                / {meta.file}
              </span>
            )}
            {meta?.type && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                {meta.type}
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            {copied ? (
              <>
                <span>✅</span> Copied!
              </>
            ) : (
              <>
                <span>📋</span> Copy
              </>
            )}
          </button>
        </div>
      )}

      {/* Code Content */}
      <pre className={`
        p-4 overflow-x-auto text-sm
        ${meta?.type === 'react' ? 'bg-blue-dark' : 
          meta?.type === 'nodejs' ? 'bg-green-dark' :
          meta?.type === 'html' ? 'bg-orange-dark' :
          'bg-gray-900'}
      `}>
        <code className={`language-${meta?.language || 'text'}`}>
          {children}
        </code>
      </pre>
    </div>
  );
}

// ============================================
// Mermaid Chart Component
// ============================================

/**
 * Mermaid diagram renderer
 */
export function MermaidChart({ 
  code, 
  title 
}: { 
  code: string; 
  title?: string;
}) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic import of mermaid
    import('mermaid').then((mermaid) => {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      mermaid.render(`mermaid-${Date.now()}`, code)
        .then(({ svg }) => setSvg(svg))
        .catch((err) => setError(err.message));
    }).catch(() => {
      setError('Mermaid not loaded');
    });
  }, [code]);

  if (error) {
    return (
      <div className="mermaid-error p-4 bg-red-50 text-red-700 rounded">
        <p className="font-medium">Failed to render diagram</p>
        <pre className="mt-2 text-sm overflow-auto">{code}</pre>
      </div>
    );
  }

  return (
    <div className="mermaid-chart my-4">
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <div 
        className="mermaid-output p-4 bg-gray-900 rounded-lg overflow-auto"
        dangerouslySetInnerHTML={{ __html: svg || '<p>Loading...</p>' }}
      />
    </div>
  );
}

// ============================================
// Thinking Component (Chain of Thought)
// ============================================

/**
 * Chain of Thought reasoning display
 */
export function Thinking({ 
  children,
  collapsed = false 
}: { 
  children: React.ReactNode;
  collapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  return (
    <div className="thinking-container my-4">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <span className={`
          inline-block transition-transform
          ${isCollapsed ? 'rotate-0' : 'rotate-90'}
        `}>
          ▶
        </span>
        <span>Thinking Process</span>
        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
          Internal
        </span>
      </button>
      
      {!isCollapsed && (
        <div className="thinking-content mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-xs text-yellow-600 mb-2 uppercase tracking-wide">
            Chain of Thought Reasoning
          </div>
          <div className="prose prose-yellow max-w-none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MDX Parser Helper
// ============================================

/**
 * Parse and render MDX content with custom components
 */
export function renderMDX(content: string): JSX.Element {
  // Custom renderer for markdown with extended code blocks
  const processContent = (text: string) => {
    // Handle code blocks with metadata
    const codeBlockRegex = /```(\w+)?(?:\s+(?:project="([^"]*)"\s+file="([^"]*)"\s+type="([^"]*)"))?\n([\s\S]*?)```/g;
    
    text = text.replace(codeBlockRegex, (match, lang, project, file, type, code) => {
      return `<ExtendedCodeBlock meta='${JSON.stringify({ language: lang, project, file, type })}'>\n${code.trim()}\n</ExtendedCodeBlock>`;
    });

    // Handle math expressions
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => {
      return `<Math expression="${expr.replace(/"/g, '&quot;')}" displayMode={true} />`;
    });
    text = text.replace(/\$([^\$\n]+?)\$/g, (_, expr) => {
      return `<Math expression="${expr.replace(/"/g, '&quot;')}" displayMode={false} />`;
    });

    // Handle mermaid diagrams
    text = text.replace(/```mermaid(?:\s+title="([^"]*)")?\n([\s\S]*?)```/g, (_, title, code) => {
      return `<MermaidChart title="${title || ''}" code="${code.trim().replace(/"/g, '&quot;')}" />`;
    });

    return text;
  };

  // Parse markdown to HTML
  const html = marked(processContent(content));

  return (
    <div 
      className="mdx-content prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html as string }}
    />
  );
}

// ============================================
// Example Usage
// ============================================

export const examples = {
  linearProcessFlow: `
<LinearProcessFlow
  steps={[
    { title: 'Planning', description: 'Define project requirements' },
    { title: 'Design', description: 'Create wireframes and mockups' },
    { title: 'Development', description: 'Write code and implement features' },
    { title: 'Testing', description: 'QA and bug fixes' },
    { title: 'Deployment', description: 'Release to production' }
  ]}
  currentStep={2}
/>
  `,

  quiz: `
<Quiz
  questions={[
    {
      id: 'q1',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
      explanation: 'Paris is the capital and largest city of France.'
    }
  ]}
  onComplete={(score) => console.log('Score:', score)}
/>
  `,

  math: `
Inline: $E = mc^2$

Display:
$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$
  `,

  extendedCodeBlock: `
\`\`\`tsx project="MyApp" file="src/App.tsx" type="react"
import React from 'react';

export function App() {
  return <div>Hello World!</div>;
}
\`\`\`
  `,

  mermaid: `
\`\`\`mermaid title="User Flow" type="diagram"
graph TD
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[Action 1]
    C -->|No| E[Action 2]
    D --> F[End]
    E --> F
\`\`\`
  `,

  thinking: `
<Thinking>
1. Analyzing the user's request for code generation
2. Determining the appropriate programming language
3. Considering best practices and patterns
4. Writing the code with proper documentation
5. Reviewing for potential edge cases
</Thinking>
  `
};

// Export all components
export {
  ProcessStep,
  QuizQuestion,
  CodeBlockMeta,
};
