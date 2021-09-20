import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CrossFlowProvider"}}
export type CrossFlowProviderQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type CrossFlowProviderQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'idPremOrgsAdmin' | 'isAaMastered' | 'fullName'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & Pick<Types.Member_Prefs, 'locale'>
    )>, enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'name' | 'displayName'>
    )>, organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'idEnterprise' | 'displayName' | 'name' | 'url'>
    )> }
  )> }
);


export const CrossFlowProviderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CrossFlowProvider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"isAaMastered"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCrossFlowProviderQuery__
 *
 * To run a query within a React component, call `useCrossFlowProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useCrossFlowProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCrossFlowProviderQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useCrossFlowProviderQuery(baseOptions: Apollo.QueryHookOptions<CrossFlowProviderQuery, CrossFlowProviderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CrossFlowProviderQuery, CrossFlowProviderQueryVariables>(CrossFlowProviderDocument, options);
      }
export function useCrossFlowProviderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CrossFlowProviderQuery, CrossFlowProviderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CrossFlowProviderQuery, CrossFlowProviderQueryVariables>(CrossFlowProviderDocument, options);
        }
export type CrossFlowProviderQueryHookResult = ReturnType<typeof useCrossFlowProviderQuery>;
export type CrossFlowProviderLazyQueryHookResult = ReturnType<typeof useCrossFlowProviderLazyQuery>;
export type CrossFlowProviderQueryResult = Apollo.QueryResult<CrossFlowProviderQuery, CrossFlowProviderQueryVariables>;