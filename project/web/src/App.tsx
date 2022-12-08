import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  theme,
} from "@chakra-ui/react"
import { ApolloProvider } from '@apollo/client';

import { createApolloClient } from "./apollo/createApolloClient";
import FilmList from './components/film/FilmList';

const apolloClient = createApolloClient();


export const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <Box>
        <Text>Ghibli GraphQL</Text>
      </Box>
      <FilmList />
    </ChakraProvider>
  </ApolloProvider>
  
)
