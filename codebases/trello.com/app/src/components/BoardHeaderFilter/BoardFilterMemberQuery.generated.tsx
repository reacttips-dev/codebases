import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardFilterMember"}}
export type BoardFilterMemberQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type BoardFilterMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & Pick<Types.Member_Prefs, 'colorBlind'>
    )> }
  )> }
);


export const BoardFilterMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardFilterMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colorBlind"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardFilterMemberQuery__
 *
 * To run a query within a React component, call `useBoardFilterMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardFilterMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardFilterMemberQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useBoardFilterMemberQuery(baseOptions: Apollo.QueryHookOptions<BoardFilterMemberQuery, BoardFilterMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardFilterMemberQuery, BoardFilterMemberQueryVariables>(BoardFilterMemberDocument, options);
      }
export function useBoardFilterMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardFilterMemberQuery, BoardFilterMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardFilterMemberQuery, BoardFilterMemberQueryVariables>(BoardFilterMemberDocument, options);
        }
export type BoardFilterMemberQueryHookResult = ReturnType<typeof useBoardFilterMemberQuery>;
export type BoardFilterMemberLazyQueryHookResult = ReturnType<typeof useBoardFilterMemberLazyQuery>;
export type BoardFilterMemberQueryResult = Apollo.QueryResult<BoardFilterMemberQuery, BoardFilterMemberQueryVariables>;