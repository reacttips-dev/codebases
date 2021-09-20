import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"IsEnterpriseOwnedMember"}}
export type IsEnterpriseOwnedMemberQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type IsEnterpriseOwnedMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'idEnterprise'>
    & { enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'isRealEnterprise'>
    )> }
  )> }
);


export const IsEnterpriseOwnedMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IsEnterpriseOwnedMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isRealEnterprise"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useIsEnterpriseOwnedMemberQuery__
 *
 * To run a query within a React component, call `useIsEnterpriseOwnedMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsEnterpriseOwnedMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsEnterpriseOwnedMemberQuery({
 *   variables: {
 *   },
 * });
 */
export function useIsEnterpriseOwnedMemberQuery(baseOptions?: Apollo.QueryHookOptions<IsEnterpriseOwnedMemberQuery, IsEnterpriseOwnedMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsEnterpriseOwnedMemberQuery, IsEnterpriseOwnedMemberQueryVariables>(IsEnterpriseOwnedMemberDocument, options);
      }
export function useIsEnterpriseOwnedMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsEnterpriseOwnedMemberQuery, IsEnterpriseOwnedMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsEnterpriseOwnedMemberQuery, IsEnterpriseOwnedMemberQueryVariables>(IsEnterpriseOwnedMemberDocument, options);
        }
export type IsEnterpriseOwnedMemberQueryHookResult = ReturnType<typeof useIsEnterpriseOwnedMemberQuery>;
export type IsEnterpriseOwnedMemberLazyQueryHookResult = ReturnType<typeof useIsEnterpriseOwnedMemberLazyQuery>;
export type IsEnterpriseOwnedMemberQueryResult = Apollo.QueryResult<IsEnterpriseOwnedMemberQuery, IsEnterpriseOwnedMemberQueryVariables>;