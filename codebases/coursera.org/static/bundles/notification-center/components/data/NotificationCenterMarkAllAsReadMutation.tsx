import React from 'react';
import gql from 'graphql-tag';
import user from 'js/lib/user';

import { Mutation } from 'react-apollo';

import type { NotificationCenterMessagesQueryResponse } from './NotificationCenterMessagesQuery';
import NotificationCenterMessagesQuery from './NotificationCenterMessagesQuery';

/* eslint-disable graphql/template-strings */
const MARK_ALL_AS_READ = gql`
  mutation MarkAllAsReadMutation {
    action(userId: $userId, input: {})
      @rest(
        method: "POST"
        type: "NotificationCenterMessagesV1"
        path: "notificationCenterMessages.v1/?action=markAllAsRead&userId={args.userId}"
      ) {
      id
    }
  }
`;
/* eslint-enable graphql/template-strings */

type MarkAllAsReadRenderProps = {
  markAllNotificationsAsRead: () => void;
};

type MarkAllAsReadProps = {
  children: (renderProps: MarkAllAsReadRenderProps) => React.ReactNode;
};

type MarkAllAsReadMutationData = {};

type MarkAllAsReadMutationVariables = {
  userId: string;
};

const NotificationCenterMarkAllAsReadMutation: React.SFC<MarkAllAsReadProps> = ({ children }) => (
  <Mutation<MarkAllAsReadMutationData, MarkAllAsReadMutationVariables> mutation={MARK_ALL_AS_READ}>
    {(markNotificationAsReadMutation) => {
      const markAllNotificationsAsRead = () => {
        markNotificationAsReadMutation({
          variables: { userId: user.get().id.toString() },
          update: (cache) => {
            const data: NotificationCenterMessagesQueryResponse | null = cache.readQuery({
              query: NotificationCenterMessagesQuery,
              variables: { userId: user.get().id.toString() },
            });

            if (data?.NotificationCenterMessagesV1Resource.elements) {
              const notifications = data.NotificationCenterMessagesV1Resource.elements;
              const updatedNotifications = notifications.map((notification) => ({
                ...notification,
                isRead: true,
              }));

              data.NotificationCenterMessagesV1Resource.elements = updatedNotifications;
            }

            cache.writeQuery({
              query: NotificationCenterMessagesQuery,
              variables: { userId: user.get().id.toString() },
              data,
            });
          },
        });
      };

      return children({ markAllNotificationsAsRead });
    }}
  </Mutation>
);

export default NotificationCenterMarkAllAsReadMutation;
