// messages.ts
export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    images: string[];
    seen?: boolean;
  }