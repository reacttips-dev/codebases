import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ConvertCardRoleButton"}}
export type ConvertCardRoleButtonQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID'];
}>;


export type ConvertCardRoleButtonQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'cardRole' | 'possibleCardRole'>
  )> }
);


export const ConvertCardRoleButtonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConvertCardRoleButton"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"possibleCardRole"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useConvertCardRoleButtonQuery__
 *
 * To run a query within a React component, call `useConvertCardRoleButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `useConvertCardRoleButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConvertCardRoleButtonQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useConvertCardRoleButtonQuery(baseOptions: Apollo.QueryHookOptions<ConvertCardRoleButtonQuery, ConvertCardRoleButtonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConvertCardRoleButtonQuery, ConvertCardRoleButtonQueryVariables>(ConvertCardRoleButtonDocument, options);
      }
export function useConvertCardRoleButtonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConvertCardRoleButtonQuery, ConvertCardRoleButtonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConvertCardRoleButtonQuery, ConvertCardRoleButtonQueryVariables>(ConvertCardRoleButtonDocument, options);
        }
export type ConvertCardRoleButtonQueryHookResult = ReturnType<typeof useConvertCardRoleButtonQuery>;
export type ConvertCardRoleButtonLazyQueryHookResult = ReturnType<typeof useConvertCardRoleButtonLazyQuery>;
export type ConvertCardRoleButtonQueryResult = Apollo.QueryResult<ConvertCardRoleButtonQuery, ConvertCardRoleButtonQueryVariables>;