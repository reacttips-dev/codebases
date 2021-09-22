// This is a render prop function that you can use anywhere to get a count down timer.
// Timers with the same id will receive the same data to allow multiple count down timers to stay
// in sync.  Therefore, the id should be unique to the time interval being tracked.
// (eg. countdown timers for the duration of a timed quiz on different pages will all use the same
// id because they are all tracking the same quiz duration)
// The local expiresAt makes sure we do not depend on the backend timestamp, because the local
// timestamp may be different.  Instead, we calculate and store a local timestamp based on the time left.

import React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';

import { localTimerQuery } from './queries';
import { addLocalTimer, updateLocalTimer } from './resolvers';

type LocalExpiresAtRenderProps = {
  expiresAt?: number | null;
};

const LocalExpiresAt = ({
  id,
  remainingTimeInMs,
  children,
}: {
  id: string;
  remainingTimeInMs?: number;
  children: (x0: LocalExpiresAtRenderProps) => React.ReactNode;
}) => (
  <ApolloConsumer>
    {(client) => {
      addLocalTimer(client);
      return (
        <Query query={localTimerQuery} variables={{ id }}>
          {({ data, loading }: $TSFixMe) => {
            if (loading) {
              return children({ expiresAt: null });
            }
            const { expiresAt } = ((data || {}).LocalTimer || {}).get || {};

            if (expiresAt === null && typeof remainingTimeInMs === 'number') {
              updateLocalTimer({ id, expiresAt: Date.now() + remainingTimeInMs }, client);
            }

            return children({
              expiresAt,
            });
          }}
        </Query>
      );
    }}
  </ApolloConsumer>
);

export default LocalExpiresAt;
