//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type MarkViewAsReadMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  focusedViewFilter: Types.FocusedViewFilter;
  viewFilter: Types.ViewFilter;
  markAsRead: Types.Scalars['Boolean'];
  clientLastSyncTime?: Types.Maybe<Types.Scalars['String']>;
  conversationIdsToExclude?: Types.Maybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
  itemIdsToExclude?: Types.Maybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
  suppressReadReceipt: Types.Scalars['Boolean'];
  mailboxInfo: Types.MailboxInfoInput;
}>;


export type MarkViewAsReadMutation = (
  { __typename?: 'Mutation' }
  & { markViewAsRead?: Types.Maybe<(
    { __typename?: 'MarkViewAsReadResult' }
    & { folder?: Types.Maybe<(
      { __typename?: 'MailFolder' }
      & { FolderId: (
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id'>
      ) }
    )> }
  )> }
);


export const MarkViewAsReadDocument: DocumentNode<MarkViewAsReadMutation, MarkViewAsReadMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkViewAsRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"focusedViewFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FocusedViewFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ViewFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"markAsRead"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientLastSyncTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationIdsToExclude"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemIdsToExclude"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"suppressReadReceipt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markViewAsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"focusedViewFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"focusedViewFilter"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"viewFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewFilter"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"markAsRead"},"value":{"kind":"Variable","name":{"kind":"Name","value":"markAsRead"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"clientLastSyncTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientLastSyncTime"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"conversationIdsToExclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationIdsToExclude"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"itemIdsToExclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemIdsToExclude"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"suppressReadReceipt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"suppressReadReceipt"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"FolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}}]}}]}}]}}]};