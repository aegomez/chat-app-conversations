import { createSchema, Type, typedModel, ExtractProps } from 'ts-mongoose';

const isRequired = { required: true as const };

// The message sent/delivered status.
export const statusEnum = ['sent', 'received', 'seen', 'deleted'] as const;
export type MessageStatus = typeof statusEnum[number];

export const MessageSchema = createSchema({
  author: Type.string(isRequired),
  content: Type.string(isRequired),
  date: Type.date({
    ...isRequired,
    default: Date.now()
  }),
  status: Type.string({
    ...isRequired,
    enum: statusEnum,
    default: statusEnum[0]
  })
});

export const Message = typedModel('Message', MessageSchema);

export type MessageProps = ExtractProps<typeof MessageSchema>;
