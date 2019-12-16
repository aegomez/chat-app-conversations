/* eslint-disable require-atomic-updates */
import { parse } from 'cookie';
import { request } from 'graphql-request';

import { AsyncMiddleware, VerifyTokenResponse } from './types';

const verifyTokenQuery = /* GraphQL */ `
  query verifyToken($token: String) {
    verify(token: $token) {
      valid
      _userId
      _userName
    }
  }
`;

export const validateCookies: AsyncMiddleware<void> = async (
  req,
  res,
  next
) => {
  try {
    const cookies = parse(req.headers.cookie || '');
    // If the cookie does not even exist:
    if (!cookies.token) {
      throw Error('Could not parse cookies');
    }

    // Extract just the token value:
    const token = cookies.token.replace('Bearer ', '');

    // Call the auth server to verify the token
    const response = await request<VerifyTokenResponse>(
      process.env.AUTH_API_URI || '',
      verifyTokenQuery,
      { token }
    );

    // If response is bad:
    if (!response?.verify) {
      throw Error('Auth server bad response');
    }

    const auth = response.verify;

    // If response is ok...
    if (!auth.valid) {
      // ... but token is not valid
      throw Error('Token not valid');
    } else {
      // ... and token is valid
      // Copy the returned values to the req object
      req._userId = auth._userId;
      req._userName = auth._userName;
      next();
    }
  } catch (error) {
    console.error('Error validateCookies: ', error.message);
    // Return a successful response but
    // inform that the cookie is invalid.
    res.status(200).send({
      data: { error: 'NOT_AUTHORIZED ' }
    });
  }
};
