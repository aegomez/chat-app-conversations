// Events emitted by the client
export const ClientEvents = {
  DISCONNECT: 'disconnect',
  CREATE_CONVERSATION: 'createConversation',
  GET_CONVERSATION: 'getConversation',
  CREATE_MESSAGE: 'createMessage',
  ACK_DELIVERED_MESSAGE: 'ackDeliveredMessage',
  ACK_SEEN_MESSAGE: 'ackSeenMessage',
  DELETE_MESSAGE: 'deleteMessage'
};

export const ServerEvents = {
  // Respond to the client about their initiated events
  CONVERSATION_CREATED: 'conversationCreated',
  CONVERSATION_FETCHED: 'conversationData',
  MESSAGE_CREATED: 'messageCreated',
  MESSAGE_DELETED: 'messageDeleted',
  // Notify others about the client's activity
  SIGN_IN: 'signIn',
  SIGN_OUT: 'signOut',
  NEW_CREATED_MESSAGE: 'newCreatedMessage',
  NEW_DELETED_MESSAGE: 'newDeletedMessage',
  NEW_DELIVERED_MESSAGE: 'newDeliveredMessage',
  NEW_SEEN_MESSAGE: 'newSeenMessage'
};
