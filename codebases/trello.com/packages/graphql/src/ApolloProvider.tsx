import React from 'react';
import { ApolloProvider as AP } from '@apollo/client';
import { client } from './client';

export const ApolloProvider: React.FunctionComponent = ({ children }) => (
  <AP client={client}>{children}</AP>
);
