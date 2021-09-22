//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetConversationForksByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  folderId: Types.Scalars['String'];
}>;


export type GetConversationForksByIdQuery = (
  { __typename?: 'Query' }
  & { conversationForks?: Types.Maybe<(
    { __typename?: 'ConversationForkConnection' }
    & { forks?: Types.Maybe<Array<(
      { __typename?: 'ConversationFork' }
      & Pick<Types.ConversationFork, 'displayNames' | 'id' | 'forkId' | 'ancestorIds' | 'Categories' | 'ConversationId' | 'DateTimeReceived' | 'DateTimeSent' | 'DisplayTo' | 'From' | 'HasAttachments' | 'IconIndex' | 'Importance' | 'InstanceKey' | 'IsDraft' | 'IsRead' | 'IsExternalSender' | 'ItemClass' | 'MentionedMe' | 'Preview' | 'ReceivedOrRenewTime' | 'Size' | 'Subject'>
      & { Flag?: Types.Maybe<(
        { __typename?: 'Flag' }
        & Pick<Types.Flag, 'FlagStatus' | 'StartDate' | 'DueDate' | 'CompleteDate'>
      )>, ParentFolderId?: Types.Maybe<(
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
      )> }
    )>> }
  )> }
);


export const GetConversationForksByIdDocument: DocumentNode<GetConversationForksByIdQuery, GetConversationForksByIdQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetConversationForksById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversationForks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"folderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayNames"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"forkId"}},{"kind":"Field","name":{"kind":"Name","value":"ancestorIds"}},{"kind":"Field","name":{"kind":"Name","value":"Categories"}},{"kind":"Field","name":{"kind":"Name","value":"ConversationId"}},{"kind":"Field","name":{"kind":"Name","value":"DateTimeReceived"}},{"kind":"Field","name":{"kind":"Name","value":"DateTimeSent"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayTo"}},{"kind":"Field","name":{"kind":"Name","value":"Flag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"FlagStatus"}},{"kind":"Field","name":{"kind":"Name","value":"StartDate"}},{"kind":"Field","name":{"kind":"Name","value":"DueDate"}},{"kind":"Field","name":{"kind":"Name","value":"CompleteDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"From"}},{"kind":"Field","name":{"kind":"Name","value":"HasAttachments"}},{"kind":"Field","name":{"kind":"Name","value":"IconIndex"}},{"kind":"Field","name":{"kind":"Name","value":"Importance"}},{"kind":"Field","name":{"kind":"Name","value":"InstanceKey"}},{"kind":"Field","name":{"kind":"Name","value":"IsDraft"}},{"kind":"Field","name":{"kind":"Name","value":"IsRead"}},{"kind":"Field","name":{"kind":"Name","value":"IsExternalSender"}},{"kind":"Field","name":{"kind":"Name","value":"ItemClass"}},{"kind":"Field","name":{"kind":"Name","value":"MentionedMe"}},{"kind":"Field","name":{"kind":"Name","value":"ParentFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Preview"}},{"kind":"Field","name":{"kind":"Name","value":"ReceivedOrRenewTime"}},{"kind":"Field","name":{"kind":"Name","value":"Size"}},{"kind":"Field","name":{"kind":"Name","value":"Subject"}}]}}]}}]}}]};