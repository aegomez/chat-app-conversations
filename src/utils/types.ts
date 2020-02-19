import { Socket } from 'socket.io';
import { IncomingMessage } from 'http';

/**
 * The http request sent with the connection,
 * plus some custom fields.
 */
export interface SocketRequest extends IncomingMessage {
  _userId: string;
  _userName: string;
  _token: string;
}

/**
 * SocketIO middleware function.
 */
export interface SocketMiddleware {
  (socket: Socket, fn: (err?: Error) => void): void;
}

/**
 * Accepts the same parameteres as a
 * SocketIO middleware function, but returns
 * a Promise instead.
 */
export interface AsyncSocketMiddleware {
  (...args: Parameters<SocketMiddleware>): Promise<void>;
}

/**
 * The response type of the getUserLists query.
 */
export interface UserListsResponse {
  getUserLists: {
    success: boolean;
    groups: string[];
    contacts: string[];
  };
}

/**
 * The response type of the updateUserConnected query.
 */
export interface UserConnectedResponse {
  updateUserConnected: {
    success: boolean;
  };
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
