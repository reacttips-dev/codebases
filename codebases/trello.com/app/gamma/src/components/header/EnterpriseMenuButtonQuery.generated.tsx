import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"EnterpriseMenuButton"}}
export type EnterpriseMenuButtonQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type EnterpriseMenuButtonQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'confirmed' | 'idEnterprisesAdmin'>
  )> }
);


export const EnterpriseMenuButtonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EnterpriseMenuButton"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useEnterpriseMenuButtonQuery__
 *
 * To run a query within a React component, call `useEnterpriseMenuButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnterpriseMenuButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnterpriseMenuButtonQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useEnterpriseMenuButtonQuery(baseOptions: Apollo.QueryHookOptions<EnterpriseMenuButtonQuery, EnterpriseMenuButtonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EnterpriseMenuButtonQuery, EnterpriseMenuButtonQueryVariables>(EnterpriseMenuButtonDocument, options);
      }
export function useEnterpriseMenuButtonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnterpriseMenuButtonQuery, EnterpriseMenuButtonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EnterpriseMenuButtonQuery, EnterpriseMenuButtonQueryVariables>(EnterpriseMenuButtonDocument, options);
        }
export type EnterpriseMenuButtonQueryHookResult = ReturnType<typeof useEnterpriseMenuButtonQuery>;
export type EnterpriseMenuButtonLazyQueryHookResult = ReturnType<typeof useEnterpriseMenuButtonLazyQuery>;
export type EnterpriseMenuButtonQueryResult = Apollo.QueryResult<EnterpriseMenuButtonQuery, EnterpriseMenuButtonQueryVariables>;