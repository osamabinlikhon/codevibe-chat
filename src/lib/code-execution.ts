/**
 * Code Execution Example with AI SDK
 * 
 * This example demonstrates how to use the AI SDK with code execution tools
 * for secure, sandboxed code execution in your AI applications.
 * 
 * Features:
 * - Secure Python code execution
 * - Streaming responses
 * - Step-by-step execution tracking
 * - Error handling and debugging
 */

import { gateway, generateText, stepCountIs, streamText, tool } from 'ai';
import { executeCode } from 'ai-sdk-tool-code-execution';
import { z } from 'zod';

// ============================================
// Basic Code Execution Example
// ============================================

/**
 * Simple code execution with generateText
 */
export async function basicCodeExecution(code: string) {
  const result = await generateText({
    model: gateway('groq:llama-3.3-70b-versatile'),
    tools: {
      execute_python: executeCode({
        language: 'python',
        timeout: 30000, // 30 seconds timeout
      }),
    },
    prompt: `Execute the following Python code and return the output:\n\n${code}`,
  });

  return result;
}

// ============================================
// Advanced Code Execution with Steps
// ============================================

/**
 * Code execution with step tracking using stepCountIs
 */
export async function codeExecutionWithSteps(code: string) {
  const result = await generateText({
    model: gateway('groq:llama-3.3-70b-versatile'),
    tools: {
      execute_python: executeCode({
        language: 'python',
        timeout: 30000,
        captureOutput: true,
        environment: {
          PYTHONPATH: '/tmp',
        },
      }),
    },
    prompt: `Execute this Python code step by step:\n\n${code}`,
    // Track execution steps
    onStepFinish: ({ step, content }) => {
      console.log(`Step ${step}: ${content}`);
    },
  });

  return result;
}

// ============================================
// Streaming Code Execution
// ============================================

/**
 * Streaming code execution with real-time output
 */
export async function streamingCodeExecution(code: string) {
  const result = await streamText({
    model: gateway('groq:llama-3.3-70b-versatile'),
    tools: {
      execute_python: executeCode({
        language: 'python',
        timeout: 30000,
        streaming: true,
      }),
    },
    prompt: `Execute this Python code and stream the output:\n\n${code}`,
    onChunk: ({ chunk }) => {
      if (chunk.type === 'code-execution') {
        console.log('Output:', chunk.output);
      }
    },
  });

  return result;
}

// ============================================
// Custom Code Execution Tool
// ============================================

/**
 * Custom code execution tool with Zod schema validation
 */
export async function customCodeExecution(code: string, language: string = 'python') {
  const result = await generateText({
    model: gateway('groq:llama-3.3-70b-versatile'),
    tools: {
      // Custom tool using the executeCode helper
      run_code: tool({
        description: 'Execute code in a secure sandbox environment',
        parameters: z.object({
          code: z.string().describe('The code to execute'),
          language: z.enum(['python', 'javascript', 'typescript', 'bash'])
            .default('python')
            .describe('Programming language'),
          timeout: z.number().default(30000)
            .describe('Execution timeout in milliseconds'),
        }),
        execute: async ({ code, language, timeout }) => {
          const executor = executeCode({
            language,
            timeout,
            captureOutput: true,
          });

          return executor({
            messages: [{
              role: 'user',
              content: `Execute this ${language} code:\n\n${code}`,
            }],
          });
        },
      }),
    },
    prompt: `Run this code:\n\n${code}`,
  });

  return result;
}

// ============================================
// Code Execution with File Support
// ============================================

/**
 * Code execution with file input/output support
 */
export async function codeExecutionWithFiles(
  code: string,
  files: { name: string; content: string }[]
) {
  const result = await generateText({
    model: gateway('groq:llama-3.3-70b-versatile'),
    tools: {
      execute_python: executeCode({
        language: 'python',
        timeout: 60000, // Longer timeout for file operations
        files: files, // Pre-load files into sandbox
        workDir: '/workspace',
      }),
    },
    prompt: `Execute this Python code with the provided files:\n\n${code}`,
  });

  return result;
}

// ============================================
// Error Handling Example
// ============================================

/**
 * Code execution with comprehensive error handling
 */
export async function safeCodeExecution(code: string) {
  try {
    const result = await generateText({
      model: gateway('groq:llama-3.3-70b-versatile'),
      tools: {
        execute_python: executeCode({
          language: 'python',
          timeout: 30000,
          allowedImports: ['math', 'random', 'json', 'datetime'],
          blockedImports: ['os', 'sys', 'subprocess', 'requests'],
        }),
      },
      prompt: `Safely execute this Python code:\n\n${code}`,
    });

    return {
      success: true,
      output: result.text,
      steps: result.steps,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      step: stepCountIs(), // Get current step count
    };
  }
}

// ============================================
// Chat Interface with Code Execution
// ============================================

/**
 * Full chat interface with code execution capabilities
 */
export async function chatWithCodeExecution(userInput: string) {
  const result = await generateText({
    model: gateway('groq:llama-3.3-70b-versatile'),
    tools: {
      // Code execution tool
      execute_code: executeCode({
        language: 'python',
        timeout: 30000,
        sandbox: 'secure', // Use secure sandbox
      }),
    },
    prompt: userInput,
    // Enhanced context for code generation
    system: `You are CodeVibe AI, an expert coding assistant.
You can execute Python code to:
- Analyze data and create visualizations
- Solve mathematical problems
- Test and debug code
- Create prototypes and demos

Always explain what the code does before and after execution.`,
  });

  return {
    response: result.text,
    toolCalls: result.toolCalls,
    toolResults: result.toolResults,
    usage: result.usage,
  };
}

// ============================================
// Usage Examples
// ============================================

/**
 * Example usage of code execution features
 */
export async function examples() {
  // Example 1: Basic calculation
  console.log('Example 1: Basic Calculation');
  const calcResult = await basicCodeExecution(`
# Calculate first 10 Fibonacci numbers
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

result = [fibonacci(i) for i in range(10)]
print("Fibonacci:", result)
print("Sum:", sum(result))
`);
  console.log('Result:', calcResult.text);

  // Example 2: Data analysis
  console.log('\nExample 2: Data Analysis');
  const analysisResult = await customCodeExecution(`
import json

# Sample data
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Analysis
stats = {
    "mean": sum(data) / len(data),
    "sum": sum(data),
    "max": max(data),
    "min": min(data),
    "count": len(data)
}

print(json.dumps(stats, indent=2))
`, 'python');
  console.log('Result:', analysisResult.text);

  // Example 3: Safe execution with error handling
  console.log('\nExample 3: Safe Execution');
  const safeResult = await safeCodeExecution(`
# This will execute safely
print("Hello from secure sandbox!")
print(2 + 2)
`);
  console.log('Result:', safeResult);
}

// ============================================
// Export Configuration
// ============================================

// Default configuration for code execution
export const codeExecutionConfig = {
  timeout: 30000, // 30 seconds
  maxOutputSize: 10000, // 10KB
  sandbox: 'secure',
  allowedLanguages: ['python', 'javascript', 'typescript', 'bash'],
  environment: {
    PYTHONUNBUFFERED: '1',
    PYTHONDONTWRITEBYTECODE: '1',
  },
};

// Re-export for convenience
export { gateway, generateText, stepCountIs, streamText, tool };
export { executeCode };
