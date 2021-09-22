import React from 'react';
import gql from 'graphql-tag';
import user from 'js/lib/user';
import type { Notification } from 'bundles/notification-center/types';

import { Mutation } from 'react-apollo';

import type { NotificationCenterMessagesQueryResponse } from './NotificationCenterMessagesQuery';
import NotificationCenterMessagesQuery from './NotificationCenterMessagesQuery';

/* eslint-disable graphql/template-strings */
export const MarkAsReadQuery = gql`
  mutation MarkAsReadMutation {
    action(id: $id, input: {})
      @rest(
        method: "POST"
        type: "NotificationCenterMessagesV1"
        path: "notificationCenterMessages.v1/?action=markAsRead&id={args.id}"
      ) {
      id
    }
  }
`;
/* eslint-enable graphql/template-strings */

type MarkAsReadRenderProps = {
  markNotificationAsRead: (id: string) => void;
};

type MarkAsReadProps = {
  children: (renderProps: MarkAsReadRenderProps) => React.ReactNode;
};

type MarkAllAsReadMutationData = {};

type MarkAllAsReadMutationVariables = {
  id: string;
};

const NotificationCenterMarkAsReadMutation: React.SFC<MarkAsReadProps> = ({ children }) => (
  <Mutation<MarkAllAsReadMutationData, MarkAllAsReadMutationVariables> mutation={MarkAsReadQuery}>
    {(markNotificationAsReadMutation) => {
      const markNotificationAsRead = (id: string) => {
        markNotificationAsReadMutation({
          variables: { id },
          update: (cache) => {
            const data: NotificationCenterMessagesQueryResponse | null = cache.readQuery({
              query: NotificationCenterMessagesQuery,
              variables: { userId: user.get().id.toString() },
            });

            const notifications = data?.NotificationCenterMessagesV1Resource.elements;
            const notification = notifications?.find((n: Notification) => n.id === id);
            if (notification) {
              notification.isRead = true;
            }

            cache.writeQuery({
              query: NotificationCenterMessagesQuery,
              variables: { userId: user.get().id.toString() },
              data,
            });
          },
        });
      };

      return children({ markNotificationAsRead });
    }}
  </Mutation>
);

export default NotificationCenterMarkAsReadMutation;
