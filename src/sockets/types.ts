import { MessageStatus } from '../db/models';

export { SocketRequest } from '../utils/types';

export interface ConversationArgs {
  conversationId: string;
  targetId: string; // Contact/group id
  newStatus: MessageStatus;
}

export interface NewMessageArgs {
  conversationId: string;
  targetId: string;
  content: string;
}

export interface UpdateMessageArgs extends ConversationArgs {
  messageId: string;
}
