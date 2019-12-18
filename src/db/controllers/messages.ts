import { getConversation } from './conversations';
import { Message, InitMessageProps } from '../models';

export async function createMessage(
  conversationId: string,
  messageProps: InitMessageProps
): Promise<string | null> {
  try {
    // Get the conversation
    const conversation = await getConversation(conversationId, 'messages');
    if (conversation === null) throw Error('conversation not found');

    // Create a new message document
    const newMessage = await Message.create({ ...messageProps });
    if (!newMessage) throw Error('could not create message');

    // Add the message id to the conversation's array
    const { id, date } = newMessage;
    conversation.messages.push(id);
    conversation.lastUpdate = date;
    await conversation.save();

    return id as string;
  } catch (error) {
    console.error('createMessage: ', error.message);
    return null;
  }
}

/**
 * Deletes the message `content`, but the Document
 * is kept for archive purposes. Also changes the
 * `visible` flag to false. Cannot be undone.
 */
export async function deleteMessage(messageId: string): Promise<boolean> {
  try {
    // Get the message
    const message = await Message.findById(messageId).exec();
    if (message === null) throw Error('message not found');

    // Delete the content and set as not visible.
    message.content = ' ';
    message.visible = false;
    const saved = await message.save();

    return !!saved;
  } catch (error) {
    console.error('deleteMessage', error.message);
    return false;
  }
}
