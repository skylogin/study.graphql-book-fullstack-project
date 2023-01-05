import * as React from "react"
import { ChakraProvider, theme } from "@chakra-ui/react"
import { BrowserRouter, Route } from "react-router-dom";
import { ApolloProvider } from '@apollo/client';

import { createApolloClient } from "./apollo/createApolloClient";
import Main from './pages/Main';
import Film from "./pages/Film";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Review from "./pages/Review";
import Rank from "./pages/Rank";

const apolloClient = createApolloClient();


export const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Route exact path="/" component={Main} />
        <Route exact path="/film/:filmId" component={Film} />
        <Route exact path="/review/:userId" component={Review} />
        <Route exact path="/rank" component={Rank} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/login" component={Login} />
      </BrowserRouter>
    </ChakraProvider>
  </ApolloProvider>
  
)
