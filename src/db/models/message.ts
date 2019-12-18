import { createSchema, Type, typedModel, ExtractProps } from 'ts-mongoose';

const isRequired = { required: true as const };

export const MessageSchema = createSchema({
  author: Type.string(isRequired),
  content: Type.string(isRequired),
  date: Type.date({
    ...isRequired,
    default: Date.now()
  }),
  visible: Type.boolean({
    ...isRequired,
    default: true
  })
});

export const Message = typedModel('Message', MessageSchema);

export type MessageProps = ExtractProps<typeof MessageSchema>;
export type InitMessageProps = Pick<MessageProps, 'author' | 'content'>;
