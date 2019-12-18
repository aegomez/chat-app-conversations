import {
  createSchema,
  Type,
  typedModel,
  ExtractDoc,
  ExtractProps
} from 'ts-mongoose';

import { MessageSchema } from './message';

const isRequired = { required: true as const };

const ConversationSchema = createSchema({
  lastUpdate: Type.date({
    ...isRequired,
    default: Date.now()
  }),
  messages: Type.array(isRequired).of(
    Type.ref(Type.objectId()).to('Message', MessageSchema)
  )
});

export const Conversation = typedModel('Conversation', ConversationSchema);

export type ConversationProps = ExtractProps<typeof ConversationSchema>;
export type ConversationDoc = ExtractDoc<typeof ConversationSchema>;
