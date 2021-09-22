import gql from 'graphql-tag';
import type { Notification } from 'bundles/notification-center/types';

export type NotificationCenterMessagesQueryResponse = {
  NotificationCenterMessagesV1Resource: {
    __typename: 'NotificationCenterMessagesV1Resource';
    elements: Notification[];
  };
};

export type NotificationCenterMessagesQueryVariables = {
  userId: string;
};

/* eslint-disable graphql/template-strings */
export default gql`
  query NotificationCenterMessagesQuery($userId: String!) {
    NotificationCenterMessagesV1Resource(userId: $userId)
      @rest(
        type: "NotificationCenterMessages"
        path: "notificationCenterMessages.v1/?q=byUser&userId={args.userId}"
        method: "GET"
      ) {
      elements @type(name: "notificationCenterMessage") {
        id
        isRead
        createdAt
        messageType
        data
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */
