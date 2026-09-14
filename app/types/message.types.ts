export interface Message {
  id: string;
  content: string;
  workspaceId: string;
  senderId: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface MessagesResponse {
  data: Message[];
}

export interface SendMessageData {
  content: string;
}
