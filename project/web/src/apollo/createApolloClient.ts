import { ApolloClient, from, HttpLink, NormalizedCacheObject } from "@apollo/client";
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

import { createApolloCache } from "./createApolloCache";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors){
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: -> ${operation.operationName}
        Message: ${message}, Query: ${path}, Location: ${JSON.stringify(locations,)}`,
      ),
    );
  }

  if (networkError) {
    console.log(`[networkError]: -> ${operation.operationName}
    Message: ${networkError.message}`);
  }
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((request, prevContext) => {
  const accessToken = localStorage.getItem('access_token');
  return {
    headers: {
      ...prevContext.headers,
      Authorization: accessToken ? `Baarer ${accessToken}` : '',
    },
  };
});

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    cache: createApolloCache(),
    link: from([authLink, errorLink, httpLink]),
  });
