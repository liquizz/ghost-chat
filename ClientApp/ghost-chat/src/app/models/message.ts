export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  isSent: boolean;
}