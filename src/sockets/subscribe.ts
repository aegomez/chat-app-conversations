import { Socket } from 'socket.io';
import { getUserLists } from '../utils';

/**
 * Subscribe the socket to a room with the same
 * `id` as the user's, and to the rooms with
 * the `ids` of their contacts and of the
 * groups they have joined.
 * @param socket The current socket
 * @param userId User ID.
 * @param token  The token passed in as a cookie.
 */
export function subscribeUserToRooms(
  socket: Socket,
  userId: string,
  token: string
): void {
  // First, join to a room with the same id as the user.
  // This user should emit in this room for connection events.
  // Contacts should emit to this channel for direct messaging.
  socket.join(userId);

  // Get all the groups the user belongs to.
  getUserLists(token)
    .then(list => {
      if (list && list.length > 0) {
        // Subscribe to all the contacts' and
        // groups' rooms.
        list.forEach(roomId => {
          socket.join(roomId);
        });
      }
    })
    .catch(e => console.error(e));
}
