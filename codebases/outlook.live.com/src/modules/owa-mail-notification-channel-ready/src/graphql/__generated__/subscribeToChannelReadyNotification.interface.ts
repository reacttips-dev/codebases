//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SubscribeToNotificationChannelReadySubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type SubscribeToNotificationChannelReadySubscription = (
  { __typename?: 'Subscription' }
  & { subscribeToNotificationChannelReady: (
    { __typename?: 'ChannelReadyNotification' }
    & Pick<Types.ChannelReadyNotification, 'status'>
  ) }
);


export const SubscribeToNotificationChannelReadyDocument: DocumentNode<SubscribeToNotificationChannelReadySubscription, SubscribeToNotificationChannelReadySubscriptionVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"subscribeToNotificationChannelReady"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribeToNotificationChannelReady"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]};