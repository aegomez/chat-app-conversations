import { RequestHandler } from 'express';
import { createConversation } from './db/controllers';

export const apiRouteHandler: RequestHandler = (req, res) => {
  const { operation, secret } = req.body;

  try {
    if (secret !== 'temporarysolution' || operation !== 'createConversation') {
      throw Error('Not authorized.');
    }
    createConversation().then(id => {
      if (!id) {
        Promise.reject();
      }
      res.send({ id });
    });
  } catch (error) {
    res.status(400).send({ error: 'NOT_AUTHORIZED' });
  }
};
