import {
  Conversation,
  ConversationDoc,
  ConversationProps,
  MessageStatus,
  statusEnum
} from '../models';

export async function createConversation(): Promise<string | null> {
  try {
    const conversation = await Conversation.create({
      messages: []
    });
    if (!conversation) throw Error('could not create conversation.');

    return conversation.id;
  } catch (error) {
    console.error('createConversation: ', error.message);
    return null;
  }
}

/**
 * Find a Conversation document using mongoose findById.
 */
export function getConversation(
  id: string,
  projection?: string
): Promise<ConversationDoc | null> {
  if (typeof projection === 'string') {
    return Conversation.findById(id, projection).exec();
  } else {
    return Conversation.findById(id).exec();
  }
}

/**
 * Find a Conversation POJO using `lean()`. The
 * `messages` field will be fully populated.
 */
export function getPopulatedConversation(
  id: string
): Promise<ConversationProps | null> {
  return Conversation.findById(id, '-__v')
    .lean()
    .populate('messages')
    .exec();
}

/**
 * Update the status of all the messages
 * in a conversation.
 * If new status is `deleted`, clear the
 * message `content`, but the Document is
 * kept for archive purposes.
 * Deleting content cannot be undone.
 */
export async function updateConversationStatus(
  id: string,
  newStatus: MessageStatus
): Promise<boolean> {
  try {
    if (!newStatus || !statusEnum.includes(newStatus)) {
      throw Error('status string not valid');
    }
    // Get the messages
    const conversation = await Conversation.findById(id)
      .populateTs('messages')
      .exec();
    if (!conversation) throw Error('conversation not found.');

    // Update all messages
    for (const message of conversation.messages) {
      message.status = newStatus;
      if (newStatus === 'deleted') {
        message.content = '';
      }
    }
    const saved = await conversation.save();

    return !!saved;
  } catch (error) {
    console.error('updateConversationDelivery', error.message);
    return false;
  }
}
