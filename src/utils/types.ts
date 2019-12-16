import { RequestHandler } from 'express';

// Declaration Merging
// Augment the original Request interface
declare module 'express-serve-static-core' {
  interface Request {
    _userId: string;
    _userName: string;
  }
}

/**
 * A RequestHandler function that returns a
 * Promise, which resolves to type `RT`.
 */
export interface AsyncMiddleware<RT> {
  (...args: Parameters<RequestHandler>): Promise<RT>;
}

/**
 * The response type of the verifyToken query.
 */
export interface VerifyTokenResponse {
  verify: {
    valid: boolean;
    _userId: string;
    _userName: string;
  };
}
