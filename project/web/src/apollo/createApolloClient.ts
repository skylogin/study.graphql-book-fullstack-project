import { ApolloClient, from, fromPromise, NormalizedCacheObject } from "@apollo/client";
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

import { createApolloCache } from "./createApolloCache";
import { refreshAccessToken } from "./auth";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors){
    if (graphQLErrors.find((err) => err.message === 'access token expired')) {
      return fromPromise(refreshAccessToken(apolloClient, operation))
        .filter((result) => !!result)
        .flatMap(() => forward(operation));
    }
    
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

const authLink = setContext((request, prevContext) => {
  const accessToken = localStorage.getItem('access_token');
  return {
    headers: {
      ...prevContext.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

// const httpLink = new HttpLink({
//   uri: 'http://localhost:4000/graphql',
//   credentials: 'include',
// });
const httpUploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
  fetchOptions: 'include',
});

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  apolloClient = new ApolloClient({
    cache: createApolloCache(),
    link: from([authLink, errorLink, httpUploadLink as any]),
  });

  return apolloClient;
}
  
