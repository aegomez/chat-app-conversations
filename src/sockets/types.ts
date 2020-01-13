export { SocketRequest } from '../utils/types';

export interface WithId {
  id: string;
}

export interface MessageArgs {
  conversationId: string;
  targetId: string;
  content: string;
}

export interface UpdateMessageArgs {
  messageId: string;
  targetId: string;
}
