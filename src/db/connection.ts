import mongoose from 'mongoose';

export async function connect(): Promise<void> {
  const mongoURI = process.env.MONGODB_URI || '';

  await mongoose.connect(mongoURI, {
    auth: {
      user: process.env.MONGODB_USER || '',
      password: process.env.MONGODB_PASS || ''
    },
    authSource: 'admin',
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

export async function disconnect(): Promise<void> {
  await mongoose.disconnect();
}
