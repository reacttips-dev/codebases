//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { ItemRowFragmentFragment } from './ItemRowFragment.interface';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { ItemRowFragmentFragmentDoc } from './ItemRowFragment.interface';
export type ItemRowsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int'];
  after?: Types.Maybe<Types.Scalars['String']>;
  folderId: Types.Scalars['String'];
  searchFolderId?: Types.Maybe<Types.Scalars['String']>;
  sortBy: Types.SortByInput;
  viewFilter: Types.ViewFilter;
  focusedViewFilter: Types.FocusedViewFilter;
  category?: Types.Maybe<Types.Scalars['String']>;
  mailboxInfo: Types.MailboxInfoInput;
  shapeName: Types.Scalars['String'];
  isScheduledFolder: Types.Scalars['Boolean'];
  isPrefetch: Types.Scalars['Boolean'];
}>;


export type ItemRowsQuery = (
  { __typename?: 'Query' }
  & { itemRows?: Types.Maybe<(
    { __typename?: 'ItemRowConnection' }
    & Pick<Types.ItemRowConnection, 'searchFolderId' | 'totalItemRowsInView'>
    & { edges?: Types.Maybe<Array<(
      { __typename?: 'ItemRowEdge' }
      & Pick<Types.ItemRowEdge, 'cursor'>
      & { node?: Types.Maybe<(
        { __typename?: 'ItemRow' }
        & ItemRowFragmentFragment
      )> }
    )>>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor'>
    ) }
  )> }
);


export const ItemRowsDocument: DocumentNode<ItemRowsQuery, ItemRowsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ItemRows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchFolderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortByInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ViewFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"focusedViewFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FocusedViewFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shapeName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isScheduledFolder"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPrefetch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemRows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"searchFolderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchFolderId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"viewFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewFilter"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"focusedViewFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"focusedViewFilter"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"commonRowsOptions"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"folderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"shape"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ShapeName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shapeName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"IsScheduledFolder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isScheduledFolder"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"isPrefetch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPrefetch"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemRowFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"searchFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"totalItemRowsInView"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}},...ItemRowFragmentFragmentDoc.definitions]};