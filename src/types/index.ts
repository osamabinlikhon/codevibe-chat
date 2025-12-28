import { ToolInvocation } from "ai";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
  toolInvocations?: ToolInvocation[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
