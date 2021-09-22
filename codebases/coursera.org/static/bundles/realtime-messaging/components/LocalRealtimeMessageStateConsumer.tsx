import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import { resolvers } from 'bundles/realtime-messaging/graphql';

const LocalRealtimeMessageStateConsumer = ({ children }: $TSFixMe) => (
  <ApolloConsumer>
    {(client) => {
      if (!Object.keys(client.getResolvers()?.Query ?? {}).includes('localRealtimeMessages')) {
        client.addResolvers(resolvers);
      }
      return children;
    }}
  </ApolloConsumer>
);

export default LocalRealtimeMessageStateConsumer;
