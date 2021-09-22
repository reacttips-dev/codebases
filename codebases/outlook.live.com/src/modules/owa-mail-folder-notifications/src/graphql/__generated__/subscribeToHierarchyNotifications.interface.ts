//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SubscribeToHierarchyNotificationsSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type SubscribeToHierarchyNotificationsSubscription = (
  { __typename?: 'Subscription' }
  & { subscribeToHierarchyNotifications?: Types.Maybe<(
    { __typename?: 'HierarchyNotificationPayload' }
    & Pick<Types.HierarchyNotificationPayload, 'EventType' | 'folderId' | 'displayName' | 'parentFolderId' | 'itemCount' | 'unreadCount'>
  )> }
);


export const SubscribeToHierarchyNotificationsDocument: DocumentNode<SubscribeToHierarchyNotificationsSubscription, SubscribeToHierarchyNotificationsSubscriptionVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"subscribeToHierarchyNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribeToHierarchyNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"EventType"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}}]}}]}}]};