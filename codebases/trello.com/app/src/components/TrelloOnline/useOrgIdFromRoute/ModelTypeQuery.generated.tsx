import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ModelType"}}
export type ModelTypeQueryVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type ModelTypeQuery = (
  { __typename: 'Query' }
  & { modelType: (
    { __typename: 'ModelType' }
    & Pick<Types.ModelType, 'type' | 'id'>
  ) }
);


export const ModelTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ModelType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modelType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idOrName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useModelTypeQuery__
 *
 * To run a query within a React component, call `useModelTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useModelTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModelTypeQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useModelTypeQuery(baseOptions: Apollo.QueryHookOptions<ModelTypeQuery, ModelTypeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ModelTypeQuery, ModelTypeQueryVariables>(ModelTypeDocument, options);
      }
export function useModelTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ModelTypeQuery, ModelTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ModelTypeQuery, ModelTypeQueryVariables>(ModelTypeDocument, options);
        }
export type ModelTypeQueryHookResult = ReturnType<typeof useModelTypeQuery>;
export type ModelTypeLazyQueryHookResult = ReturnType<typeof useModelTypeLazyQuery>;
export type ModelTypeQueryResult = Apollo.QueryResult<ModelTypeQuery, ModelTypeQueryVariables>;