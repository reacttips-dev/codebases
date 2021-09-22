//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { ConversationTypeFragmentFragment } from 'owa-mail-find-rows/lib/graphql/__generated__/ConversationTypeFragment.interface';
import { ItemRowFragmentFragment } from 'owa-mail-find-rows/lib/graphql/__generated__/ItemRowFragment.interface';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { ConversationTypeFragmentFragmentDoc } from 'owa-mail-find-rows/lib/graphql/__generated__/ConversationTypeFragment.interface';
import { ItemRowFragmentFragmentDoc } from 'owa-mail-find-rows/lib/graphql/__generated__/ItemRowFragment.interface';
export type SubscribeToRowNotificationsSubscriptionVariables = Types.Exact<{
  subscriptionId: Types.Scalars['String'];
  folderId: Types.Scalars['String'];
  listViewType: Types.ReactListViewType;
  type: Types.TableQueryType;
  categoryName?: Types.Maybe<Types.Scalars['String']>;
  focusedViewFilter: Types.FocusedViewFilter;
  viewFilter: Types.ViewFilter;
  sortBy: Types.SortByInput;
  shapeName: Types.Scalars['String'];
  isScheduledFolder: Types.Scalars['Boolean'];
  mailboxInfo: Types.MailboxInfoInput;
}>;


export type SubscribeToRowNotificationsSubscription = (
  { __typename?: 'Subscription' }
  & { subscribeToRowNotifications?: Types.Maybe<(
    { __typename?: 'RowNotificationChangePayload' }
    & Pick<Types.RowNotificationChangePayload, 'id' | 'EventType'>
    & { Conversation?: Types.Maybe<(
      { __typename?: 'ConversationType' }
      & ConversationTypeFragmentFragment
    )>, Item?: Types.Maybe<(
      { __typename?: 'ItemRow' }
      & ItemRowFragmentFragment
    )> }
  ) | (
    { __typename?: 'RowNotificationDeletePayload' }
    & Pick<Types.RowNotificationDeletePayload, 'id' | 'EventType'>
    & { Conversation?: Types.Maybe<(
      { __typename?: 'RowInstanceKey' }
      & Pick<Types.RowInstanceKey, 'InstanceKey'>
    )>, Item?: Types.Maybe<(
      { __typename?: 'RowInstanceKey' }
      & Pick<Types.RowInstanceKey, 'InstanceKey'>
    )> }
  )> }
);


export const SubscribeToRowNotificationsDocument: DocumentNode<SubscribeToRowNotificationsSubscription, SubscribeToRowNotificationsSubscriptionVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"subscribeToRowNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listViewType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReactListViewType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TableQueryType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"focusedViewFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FocusedViewFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ViewFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortByInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shapeName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isScheduledFolder"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribeToRowNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"subscriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"listViewType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listViewType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"categoryName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"focusedViewFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"focusedViewFilter"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"viewFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewFilter"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"commonRowsOptions"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"folderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"shape"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ShapeName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shapeName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"IsScheduledFolder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isScheduledFolder"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"EventType"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RowNotificationChangePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Conversation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConversationTypeFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemRowFragment"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RowNotificationDeletePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Conversation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"InstanceKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"InstanceKey"}}]}}]}}]}}]}},...ConversationTypeFragmentFragmentDoc.definitions,...ItemRowFragmentFragmentDoc.definitions]};