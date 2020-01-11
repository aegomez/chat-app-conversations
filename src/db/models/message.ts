import { createSchema, Type, typedModel, ExtractProps } from 'ts-mongoose';

const isRequired = { required: true as const };

// The message sent/delivered status.
export const deliveryEnum = ['sent', 'delivered', 'seen'] as const;
export type DeliveryStatus = typeof deliveryEnum[number];

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
  }),
  delivery: Type.string({
    ...isRequired,
    enum: deliveryEnum,
    default: deliveryEnum[0]
  })
});

export const Message = typedModel('Message', MessageSchema);

export type MessageProps = ExtractProps<typeof MessageSchema>;
