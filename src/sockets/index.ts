import { Socket } from 'socket.io';

import { ClientEvents, ServerEvents } from './events';
import { subscribeUserToRooms } from './subscribe';
import { SocketRequest, WithId, MessageArgs, UpdateMessageArgs } from './types';
import {
  createConversation,
  createMessage,
  deleteMessage,
  getPopulatedConversation,
  updateMessageDelivery
} from '../db/controllers';

const {
  DISCONNECT,
  CREATE_CONVERSATION,
  GET_CONVERSATION,
  CREATE_MESSAGE,
  ACK_DELIVERED_MESSAGE,
  ACK_SEEN_MESSAGE,
  DELETE_MESSAGE
} = ClientEvents;

const {
  SIGN_IN,
  SIGN_OUT,
  NEW_CREATED_MESSAGE,
  NEW_DELETED_MESSAGE,
  NEW_DELIVERED_MESSAGE,
  NEW_SEEN_MESSAGE,
  CONVERSATION_CREATED,
  CONVERSATION_FETCHED,
  MESSAGE_CREATED,
  MESSAGE_DELETED
} = ServerEvents;

export function socketManager(socket: Socket): void {
  console.log('New client connected');

  // Get these values after the cookie was validated.
  const { _userId, _userName, _token } = socket.request as SocketRequest;

  // Subscribe to rooms: own, contacts and groups.
  subscribeUserToRooms(socket, _userId, _token);

  // Emit sign-in notification to own channel.
  // All connected contacts should receive
  // this notification.
  socket.broadcast.to(_userId).emit(SIGN_IN, { id: _userId, name: _userName });

  // Emit sign-out notification to own channel.
  socket.on(DISCONNECT, () => {
    socket.broadcast
      .to(_userId)
      .emit(SIGN_OUT, { id: _userId, name: _userName });
  });

  /// ----- ClientEvent Listeners ----- ///

  socket.on(CREATE_CONVERSATION, async () => {
    console.log(CREATE_CONVERSATION, 'triggered.');
    const id = await createConversation();
    socket.emit(CONVERSATION_CREATED, { id });
  });

  socket.on(GET_CONVERSATION, async ({ id }: WithId) => {
    console.log(GET_CONVERSATION, 'triggered.');
    const conversation = await getPopulatedConversation(id);
    socket.emit(CONVERSATION_FETCHED, { conversation });
  });

  socket.on(
    CREATE_MESSAGE,
    async ({ conversationId, targetId, content }: MessageArgs) => {
      console.log(CREATE_MESSAGE, 'triggered.');
      const author = _userId;
      const message = await createMessage(conversationId, author, content);
      if (!message) return;

      // const message = {
      //   id: newMessage._id.toHexString(),
      //   date: newMessage.date,
      //   author,
      //   content
      // };

      // Return success response to sender
      socket.emit(MESSAGE_CREATED, { id: message._id });
      // Notify the other party
      socket.broadcast
        .to(targetId)
        .emit(NEW_CREATED_MESSAGE, { targetId, message });
    }
  );

  socket.on(
    DELETE_MESSAGE,
    async ({ messageId, targetId }: UpdateMessageArgs) => {
      console.log(DELETE_MESSAGE, 'triggered.');
      const success = await deleteMessage(messageId);
      // Return response to sender
      socket.emit(MESSAGE_DELETED, { success });
      // If a message was deleted, notify
      // the other subscriptors
      if (success) {
        socket.broadcast
          .to(targetId)
          .emit(NEW_DELETED_MESSAGE, { messageId, targetId });
      }
    }
  );

  socket.on(
    ACK_DELIVERED_MESSAGE,
    async ({ messageId, targetId }: UpdateMessageArgs) => {
      console.log(ACK_DELIVERED_MESSAGE, 'triggered.');
      // Update the database
      const success = await updateMessageDelivery(messageId, 'delivered');
      // Notify the other party
      if (success) {
        socket.broadcast
          .to(targetId)
          .emit(NEW_DELIVERED_MESSAGE, { messageId, targetId });
      }
    }
  );

  socket.on(
    ACK_SEEN_MESSAGE,
    async ({ messageId, targetId }: UpdateMessageArgs) => {
      console.log(ACK_SEEN_MESSAGE, 'triggered.');
      // Update the database
      const success = await updateMessageDelivery(messageId, 'seen');
      // Notify the other party
      if (success) {
        socket.broadcast
          .to(targetId)
          .emit(NEW_SEEN_MESSAGE, { messageId, targetId });
      }
    }
  );
}
