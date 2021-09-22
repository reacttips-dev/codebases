import React from 'react';
import type { ApolloError, ApolloQueryResult } from 'apollo-client';

import type { Notification } from 'bundles/notification-center/types';

import NotificationCenterQueryProvider from './NotificationCenterQueryProvider';
import NotificationCenterMarkAsReadMutation from './NotificationCenterMarkAsReadMutation';
import NotificationCenterMarkAllAsReadMutation from './NotificationCenterMarkAllAsReadMutation';

import type {
  NotificationCenterMessagesQueryResponse,
  NotificationCenterMessagesQueryVariables,
} from './NotificationCenterMessagesQuery';

type NotificationCenterDataRenderProps = {
  loading?: boolean;
  error?: ApolloError;
  refetch: (
    variables?: NotificationCenterMessagesQueryVariables
  ) => Promise<ApolloQueryResult<NotificationCenterMessagesQueryResponse>>;
  notifications?: Notification[];
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: string) => void;
};

type DataProviderProps = {
  children: (renderProps: NotificationCenterDataRenderProps) => React.ReactNode;
};

const NotificationCenterDataProvider: React.SFC<DataProviderProps> = ({ children }) => (
  <NotificationCenterQueryProvider>
    {({ loading, error, refetch, notifications }) => (
      <NotificationCenterMarkAllAsReadMutation>
        {({ markAllNotificationsAsRead }) => (
          <NotificationCenterMarkAsReadMutation>
            {({ markNotificationAsRead }) =>
              children({
                loading,
                error,
                refetch,
                notifications,
                markNotificationAsRead,
                markAllNotificationsAsRead,
              })
            }
          </NotificationCenterMarkAsReadMutation>
        )}
      </NotificationCenterMarkAllAsReadMutation>
    )}
  </NotificationCenterQueryProvider>
);

export default NotificationCenterDataProvider;
