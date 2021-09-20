import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardFilterData"}}
export type BoardFilterDataQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
}>;


export type BoardFilterDataQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'name'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'username' | 'activityBlocked' | 'avatarUrl' | 'initials' | 'fullName' | 'confirmed' | 'email'>
    )>, labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id' | 'name' | 'color'>
    )> }
  )> }
);


export const BoardFilterDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardFilterData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardFilterDataQuery__
 *
 * To run a query within a React component, call `useBoardFilterDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardFilterDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardFilterDataQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useBoardFilterDataQuery(baseOptions: Apollo.QueryHookOptions<BoardFilterDataQuery, BoardFilterDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardFilterDataQuery, BoardFilterDataQueryVariables>(BoardFilterDataDocument, options);
      }
export function useBoardFilterDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardFilterDataQuery, BoardFilterDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardFilterDataQuery, BoardFilterDataQueryVariables>(BoardFilterDataDocument, options);
        }
export type BoardFilterDataQueryHookResult = ReturnType<typeof useBoardFilterDataQuery>;
export type BoardFilterDataLazyQueryHookResult = ReturnType<typeof useBoardFilterDataLazyQuery>;
export type BoardFilterDataQueryResult = Apollo.QueryResult<BoardFilterDataQuery, BoardFilterDataQueryVariables>;