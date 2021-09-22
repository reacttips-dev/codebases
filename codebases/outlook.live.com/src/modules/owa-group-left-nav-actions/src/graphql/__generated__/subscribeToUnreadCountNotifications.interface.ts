//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SubscribeToUnreadCountNotificationsSubscriptionVariables = Types.Exact<{
  subscriptionId: Types.Scalars['String'];
  mailboxSmtpAddress: Types.Scalars['String'];
}>;


export type SubscribeToUnreadCountNotificationsSubscription = (
  { __typename?: 'Subscription' }
  & { subscribeToUnreadCountNotifications?: Types.Maybe<(
    { __typename?: 'UnreadItemNotificationPayload' }
    & Pick<Types.UnreadItemNotificationPayload, 'id' | 'EventType' | 'NotificationId' | 'UnreadCount' | 'BrokerSubscriptionId'>
  )> }
);


export const SubscribeToUnreadCountNotificationsDocument: DocumentNode<SubscribeToUnreadCountNotificationsSubscription, SubscribeToUnreadCountNotificationsSubscriptionVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"subscribeToUnreadCountNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxSmtpAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribeToUnreadCountNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"subscriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"mailboxSmtpAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxSmtpAddress"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"EventType"}},{"kind":"Field","name":{"kind":"Name","value":"NotificationId"}},{"kind":"Field","name":{"kind":"Name","value":"UnreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"BrokerSubscriptionId"}}]}}]}}]};