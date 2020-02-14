// Events emitted by the client
export const ClientEvents = {
  DISCONNECT: 'disconnect',
  GET_CONVERSATION: 'chat/getConversation',
  CREATE_MESSAGE: 'chat/createMessage',
  UPDATE_MESSAGE: 'chat/updateMessage',
  UPDATE_CONVERSATION: 'chat/updateConversation'
};

export const ServerEvents = {
  // Respond to the client about their initiated events
  CONVERSATION_FETCHED: 'conversationFetched',
  // Notify others about the client's activity
  CONVERSATION_UPDATED: 'conversationUpdated',
  USER_CONNECTED: 'userConnected',
  // Notify everyone
  MESSAGE_CREATED: 'messageCreated',
  MESSAGE_UPDATED: 'messageUpdated'
};
