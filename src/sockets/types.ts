import { MessageStatus } from '../db/models';

export { SocketRequest } from '../utils/types';

export interface ConversationArgs {
  conversationId: string;
  newStatus: MessageStatus;
}

export interface NewMessageArgs {
  conversationId: string;
  content: string;
}

export interface UpdateMessageArgs extends ConversationArgs {
  messageId: string;
}
