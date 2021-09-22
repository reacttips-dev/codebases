import React from 'react';
import user from 'js/lib/user';

import { Query } from 'react-apollo';
import type { ApolloError, ApolloQueryResult } from 'apollo-client';

import type { Notification } from 'bundles/notification-center/types';

import type {
  NotificationCenterMessagesQueryResponse,
  NotificationCenterMessagesQueryVariables,
} from './NotificationCenterMessagesQuery';
import NotificationCenterMessagesQuery from './NotificationCenterMessagesQuery';

type QueryRenderProps = {
  loading?: boolean;
  error?: ApolloError;
  refetch: (
    variables?: NotificationCenterMessagesQueryVariables
  ) => Promise<ApolloQueryResult<NotificationCenterMessagesQueryResponse>>;
  notifications?: Notification[];
};

type QueryProps = {
  children: (renderProps: QueryRenderProps) => React.ReactNode;
};

const NotificationCenterQueryProvider: React.SFC<QueryProps> = ({ children }) => {
  const userId = user.get().id.toString();

  return (
    <Query<NotificationCenterMessagesQueryResponse, NotificationCenterMessagesQueryVariables>
      query={NotificationCenterMessagesQuery}
      variables={{ userId }}
    >
      {({ loading, error, refetch, data }) => {
        if (loading) {
          return children({ loading, refetch });
        }

        if (error) {
          return children({ error, refetch });
        }

        if (data?.NotificationCenterMessagesV1Resource?.elements) {
          const notifications = data.NotificationCenterMessagesV1Resource.elements;
          return children({ refetch, notifications });
        }

        return null;
      }}
    </Query>
  );
};

export default NotificationCenterQueryProvider;
