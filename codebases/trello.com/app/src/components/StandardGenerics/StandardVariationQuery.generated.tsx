import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"StandardVariation"}}
export type StandardVariationQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type StandardVariationQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'standardVariation'>
  )> }
);


export const StandardVariationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StandardVariation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"standardVariation"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useStandardVariationQuery__
 *
 * To run a query within a React component, call `useStandardVariationQuery` and pass it any options that fit your needs.
 * When your component renders, `useStandardVariationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStandardVariationQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useStandardVariationQuery(baseOptions: Apollo.QueryHookOptions<StandardVariationQuery, StandardVariationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StandardVariationQuery, StandardVariationQueryVariables>(StandardVariationDocument, options);
      }
export function useStandardVariationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StandardVariationQuery, StandardVariationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StandardVariationQuery, StandardVariationQueryVariables>(StandardVariationDocument, options);
        }
export type StandardVariationQueryHookResult = ReturnType<typeof useStandardVariationQuery>;
export type StandardVariationLazyQueryHookResult = ReturnType<typeof useStandardVariationLazyQuery>;
export type StandardVariationQueryResult = Apollo.QueryResult<StandardVariationQuery, StandardVariationQueryVariables>;