import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberEnterpriseLicenses"}}
export type MemberEnterpriseLicensesQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type MemberEnterpriseLicensesQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'idEnterprise' | 'confirmed'>
    & { enterpriseLicenses?: Types.Maybe<Array<(
      { __typename: 'Member_EnterpriseLicense' }
      & Pick<Types.Member_EnterpriseLicense, 'idEnterprise' | 'type'>
    )>> }
  )> }
);


export const MemberEnterpriseLicensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberEnterpriseLicenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberEnterpriseLicensesQuery__
 *
 * To run a query within a React component, call `useMemberEnterpriseLicensesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberEnterpriseLicensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberEnterpriseLicensesQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMemberEnterpriseLicensesQuery(baseOptions: Apollo.QueryHookOptions<MemberEnterpriseLicensesQuery, MemberEnterpriseLicensesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberEnterpriseLicensesQuery, MemberEnterpriseLicensesQueryVariables>(MemberEnterpriseLicensesDocument, options);
      }
export function useMemberEnterpriseLicensesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberEnterpriseLicensesQuery, MemberEnterpriseLicensesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberEnterpriseLicensesQuery, MemberEnterpriseLicensesQueryVariables>(MemberEnterpriseLicensesDocument, options);
        }
export type MemberEnterpriseLicensesQueryHookResult = ReturnType<typeof useMemberEnterpriseLicensesQuery>;
export type MemberEnterpriseLicensesLazyQueryHookResult = ReturnType<typeof useMemberEnterpriseLicensesLazyQuery>;
export type MemberEnterpriseLicensesQueryResult = Apollo.QueryResult<MemberEnterpriseLicensesQuery, MemberEnterpriseLicensesQueryVariables>;