import { Conversation, ConversationDoc, ConversationProps } from '../models';

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
