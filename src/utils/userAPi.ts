import { GraphQLClient } from 'graphql-request';

import { UserListsResponse } from './types';

const userGroupsQuery = /* GraphQL */ `
  query {
    getUserLists {
      success
      contacts
      groups
    }
  }
`;

export async function getUserLists(token: string): Promise<string[] | null> {
  try {
    const URI = process.env.USER_API_URI;
    if (!URI) throw Error('URI not found');

    // Send a request to the users service.
    const client = new GraphQLClient(URI, {
      headers: {
        Cookie: `token=${token}`
      }
    });
    const response = await client.request<UserListsResponse>(userGroupsQuery);

    // If response is bad
    if (!response?.getUserLists) {
      throw Error('Users server bad response.');
    }

    const user = response.getUserLists;

    // If operation was successful, return an
    // array containing all the groups' and
    // contacts' ids the user should subscribe.
    if (user.success) {
      return [...user.contacts, ...user.groups];
    } else {
      throw Error('Could not get data.');
    }
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
