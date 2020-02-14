import { getConversation } from './conversations';
import { Message, MessageProps, MessageStatus, statusEnum } from '../models';

export async function createMessage(
  conversationId: string,
  author: string,
  content: string
): Promise<MessageProps | null> {
  try {
    // Get the conversation
    const conversation = await getConversation(conversationId, 'messages');
    if (conversation === null) throw Error('conversation not found');

    // Create a new message document
    const newMessage = await Message.create({ author, content });
    if (!newMessage) throw Error('could not create message');

    // Add the message id to the conversation's array
    const { id, date } = newMessage;
    conversation.messages.push(id);
    conversation.lastUpdate = date;
    await conversation.save();

    return newMessage;
  } catch (error) {
    console.error('createMessage: ', error.message);
    return null;
  }
}

/**
 * Update a single message status.
 * If new status is `deleted`, clear the
 * message `content`, but the Document is
 * kept for archive purposes.
 * Deleting content cannot be undone.
 */
export async function updateMessageStatus(
  messageId: string,
  newStatus: MessageStatus
): Promise<boolean> {
  try {
    // Validate the newStatus
    if (!newStatus || !statusEnum.includes(newStatus)) {
      throw Error('status string not valid.');
    }

    // Get the message
    const message = await Message.findById(messageId).exec();
    if (!message) throw Error('message not found');

    // Return if no changes are detected
    if (message.status === newStatus) {
      return false;
    }

    // Update the message status
    message.status = newStatus;
    if (newStatus === 'deleted') {
      // Delete the message content and set as not visible.
      message.content = ' ';
    }
    const saved = await message.save();

    return !!saved;
  } catch (error) {
    console.error('updateMessageStatus', error.message);
    return false;
  }
}
