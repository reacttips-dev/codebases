import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MultiBoardViewProviderCards"}}
export type MultiBoardViewProviderCardsQueryVariables = Types.Exact<{
  idBoards: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
  idOrg: Types.Scalars['ID'];
  pageSize: Types.Scalars['Int'];
  cursor?: Types.Maybe<Types.Scalars['String']>;
  due?: Types.Maybe<Types.Scalars['String']>;
  dueComplete?: Types.Maybe<Types.Scalars['Boolean']>;
  sortBy?: Types.Maybe<Types.Scalars['String']>;
  idLists?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  labels?: Types.Maybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
  idMembers?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
}>;


export type MultiBoardViewProviderCardsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { cards: (
      { __typename: 'OrganizationCards' }
      & Pick<Types.OrganizationCards, 'total' | 'cursor'>
      & { cards: Array<(
        { __typename: 'Card' }
        & Pick<Types.Card, 'id' | 'idBoard' | 'due' | 'dueComplete' | 'dueReminder' | 'idList' | 'idMembers' | 'name' | 'url' | 'closed' | 'isTemplate' | 'start' | 'pos' | 'idShort'>
        & { labels: Array<(
          { __typename: 'Label' }
          & Pick<Types.Label, 'id' | 'name' | 'color' | 'idBoard'>
        )> }
      )> }
    ) }
  )> }
);


export const MultiBoardViewProviderCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MultiBoardViewProviderCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoards"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrg"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"due"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dueComplete"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idLists"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labels"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idMembers"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrg"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idBoards"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoards"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"due"},"value":{"kind":"Variable","name":{"kind":"Name","value":"due"}}},{"kind":"Argument","name":{"kind":"Name","value":"dueComplete"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dueComplete"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"idLists"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idLists"}}},{"kind":"Argument","name":{"kind":"Name","value":"labels"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labels"}}},{"kind":"Argument","name":{"kind":"Name","value":"idMembers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idMembers"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"dueReminder"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"idShort"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"cursor"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMultiBoardViewProviderCardsQuery__
 *
 * To run a query within a React component, call `useMultiBoardViewProviderCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMultiBoardViewProviderCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMultiBoardViewProviderCardsQuery({
 *   variables: {
 *      idBoards: // value for 'idBoards'
 *      idOrg: // value for 'idOrg'
 *      pageSize: // value for 'pageSize'
 *      cursor: // value for 'cursor'
 *      due: // value for 'due'
 *      dueComplete: // value for 'dueComplete'
 *      sortBy: // value for 'sortBy'
 *      idLists: // value for 'idLists'
 *      labels: // value for 'labels'
 *      idMembers: // value for 'idMembers'
 *   },
 * });
 */
export function useMultiBoardViewProviderCardsQuery(baseOptions: Apollo.QueryHookOptions<MultiBoardViewProviderCardsQuery, MultiBoardViewProviderCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MultiBoardViewProviderCardsQuery, MultiBoardViewProviderCardsQueryVariables>(MultiBoardViewProviderCardsDocument, options);
      }
export function useMultiBoardViewProviderCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MultiBoardViewProviderCardsQuery, MultiBoardViewProviderCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MultiBoardViewProviderCardsQuery, MultiBoardViewProviderCardsQueryVariables>(MultiBoardViewProviderCardsDocument, options);
        }
export type MultiBoardViewProviderCardsQueryHookResult = ReturnType<typeof useMultiBoardViewProviderCardsQuery>;
export type MultiBoardViewProviderCardsLazyQueryHookResult = ReturnType<typeof useMultiBoardViewProviderCardsLazyQuery>;
export type MultiBoardViewProviderCardsQueryResult = Apollo.QueryResult<MultiBoardViewProviderCardsQuery, MultiBoardViewProviderCardsQueryVariables>;