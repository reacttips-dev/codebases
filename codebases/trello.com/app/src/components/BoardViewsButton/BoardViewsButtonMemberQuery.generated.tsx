import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardViewsButtonMember"}}
export type BoardViewsButtonMemberQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type BoardViewsButtonMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const BoardViewsButtonMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardViewsButtonMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardViewsButtonMemberQuery__
 *
 * To run a query within a React component, call `useBoardViewsButtonMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardViewsButtonMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardViewsButtonMemberQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useBoardViewsButtonMemberQuery(baseOptions: Apollo.QueryHookOptions<BoardViewsButtonMemberQuery, BoardViewsButtonMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardViewsButtonMemberQuery, BoardViewsButtonMemberQueryVariables>(BoardViewsButtonMemberDocument, options);
      }
export function useBoardViewsButtonMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardViewsButtonMemberQuery, BoardViewsButtonMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardViewsButtonMemberQuery, BoardViewsButtonMemberQueryVariables>(BoardViewsButtonMemberDocument, options);
        }
export type BoardViewsButtonMemberQueryHookResult = ReturnType<typeof useBoardViewsButtonMemberQuery>;
export type BoardViewsButtonMemberLazyQueryHookResult = ReturnType<typeof useBoardViewsButtonMemberLazyQuery>;
export type BoardViewsButtonMemberQueryResult = Apollo.QueryResult<BoardViewsButtonMemberQuery, BoardViewsButtonMemberQueryVariables>;