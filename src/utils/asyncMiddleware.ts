import { RequestHandler } from 'express';

/**
 * A wrapper around Promise-based middleware.
 */
export function asyncMiddleware(fn: Function): RequestHandler {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
