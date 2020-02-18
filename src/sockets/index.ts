import { Socket } from 'socket.io';

import { ClientEvents, ServerEvents } from './events';
import { subscribeUserToRooms } from './subscribe';
import {
  SocketRequest,
  ConversationArgs,
  NewMessageArgs,
  UpdateMessageArgs
} from './types';
import {
  // createConversation,
  createMessage,
  updateMessageStatus,
  getPopulatedConversation,
  updateConversationStatus
} from '../db/controllers';

const {
  DISCONNECT,
  GET_CONVERSATION,
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  UPDATE_CONVERSATION
} = ClientEvents;

const {
  CONVERSATION_FETCHED,
  CONVERSATION_UPDATED,
  MESSAGE_CREATED,
  MESSAGE_UPDATED,
  USER_CONNECTED
} = ServerEvents;

export function socketManager(socket: Socket): void {
  // Get these values after the cookie was validated.
  const {
    _userId: userId,
    _userName: userName,
    _token
  } = socket.request as SocketRequest;

  // Subscribe to rooms: own, contacts and groups.
  subscribeUserToRooms(socket, userId, _token);

  // Emit sign-in notification to own channel.
  // All connected contacts should receive
  // this notification.
  socket.broadcast
    .to(userId)
    .emit(USER_CONNECTED, { userId, userName, connected: true });

  // Emit sign-out notification to own channel.
  socket.on(DISCONNECT, () => {
    socket.broadcast
      .to(userId)
      .emit(USER_CONNECTED, { userId, userName, connected: false });
  });

  /// ----- ClientEvent Listeners ----- ///

  socket.on(GET_CONVERSATION, async (id: string) => {
    const conversation = await getPopulatedConversation(id);
    if (!conversation) return;
    socket.emit(CONVERSATION_FETCHED, conversation);
  });

  socket.on(
    CREATE_MESSAGE,
    async ({ conversationId, content }: NewMessageArgs) => {
      const author = userId;
      const message = await createMessage(conversationId, author, content);
      if (!message) return;

      // Return new message to sender
      socket.emit(MESSAGE_CREATED, { conversationId, message, itsOwn: true });
      // Notify the other party
      socket.broadcast
        .to(userId)
        .emit(MESSAGE_CREATED, { conversationId, message, itsOwn: false });
    }
  );

  socket.on(
    UPDATE_MESSAGE,
    async ({ conversationId, messageId, newStatus }: UpdateMessageArgs) => {
      const success = await updateMessageStatus(messageId, newStatus);
      if (!success) return;

      // If a message was deleted,
      // notify the sender and the other
      // subscriptors (same event)
      const response = { conversationId, messageId, newStatus };
      socket.emit(MESSAGE_UPDATED, response);
      socket.broadcast.to(userId).emit(MESSAGE_UPDATED, response);
    }
  );

  socket.on(
    UPDATE_CONVERSATION,
    async ({ conversationId, newStatus }: ConversationArgs) => {
      // Update the database
      const success = await updateConversationStatus(conversationId, newStatus);
      if (success) {
        // Notify the other party
        socket.broadcast
          .to(userId)
          .emit(CONVERSATION_UPDATED, { conversationId, newStatus });
      }
    }
  );
}
