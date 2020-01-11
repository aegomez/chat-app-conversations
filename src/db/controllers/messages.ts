import { getConversation } from './conversations';
import { Message, MessageProps, deliveryEnum, DeliveryStatus } from '../models';

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

export async function updateMessageDelivery(
  messageId: string,
  newStatus: DeliveryStatus
): Promise<boolean> {
  try {
    // Validate the newStatus
    if (!newStatus || !deliveryEnum.includes(newStatus)) {
      throw Error('status string not valid.');
    }
    // Get the message
    const message = await Message.findById(messageId, 'delivery').exec();
    if (!message) throw Error('message not found.');

    // Return if no changes are detected
    if (message.delivery === newStatus) {
      return true;
    }
    // Change the delivery field to a valid status
    message.delivery = newStatus;
    const saved = await message.save();

    return !!saved;
  } catch (error) {
    console.error('updateMessageDelivery', error.message);
    return false;
  }
}
