import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"GetMemberInfo"}}
export type GetMemberInfoQueryVariables = Types.Exact<{
  idMembers: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type GetMemberInfoQuery = (
  { __typename: 'Query' }
  & { members: Array<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'aaId' | 'fullName' | 'avatarUrl'>
  )> }
);


export const GetMemberInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMemberInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idMembers"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idMembers"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aaId"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetMemberInfoQuery__
 *
 * To run a query within a React component, call `useGetMemberInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberInfoQuery({
 *   variables: {
 *      idMembers: // value for 'idMembers'
 *   },
 * });
 */
export function useGetMemberInfoQuery(baseOptions: Apollo.QueryHookOptions<GetMemberInfoQuery, GetMemberInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMemberInfoQuery, GetMemberInfoQueryVariables>(GetMemberInfoDocument, options);
      }
export function useGetMemberInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMemberInfoQuery, GetMemberInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMemberInfoQuery, GetMemberInfoQueryVariables>(GetMemberInfoDocument, options);
        }
export type GetMemberInfoQueryHookResult = ReturnType<typeof useGetMemberInfoQuery>;
export type GetMemberInfoLazyQueryHookResult = ReturnType<typeof useGetMemberInfoLazyQuery>;
export type GetMemberInfoQueryResult = Apollo.QueryResult<GetMemberInfoQuery, GetMemberInfoQueryVariables>;