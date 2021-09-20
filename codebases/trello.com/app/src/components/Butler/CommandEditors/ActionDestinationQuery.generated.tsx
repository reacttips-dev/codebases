import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ActionDestination"}}
export type ActionDestinationQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  initialIdBoard: Types.Scalars['ID'];
}>;


export type ActionDestinationQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name'>
    )> }
  )>, board?: Types.Maybe<(
    { __typename: 'Board' }
    & { lists: Array<(
      { __typename: 'List' }
      & Pick<Types.List, 'id' | 'name'>
    )> }
  )>, initialBoard?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'name'>
  )> }
);


export const ActionDestinationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActionDestination"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"initialIdBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"initialBoard"},"name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"initialIdBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useActionDestinationQuery__
 *
 * To run a query within a React component, call `useActionDestinationQuery` and pass it any options that fit your needs.
 * When your component renders, `useActionDestinationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActionDestinationQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      initialIdBoard: // value for 'initialIdBoard'
 *   },
 * });
 */
export function useActionDestinationQuery(baseOptions: Apollo.QueryHookOptions<ActionDestinationQuery, ActionDestinationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ActionDestinationQuery, ActionDestinationQueryVariables>(ActionDestinationDocument, options);
      }
export function useActionDestinationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActionDestinationQuery, ActionDestinationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ActionDestinationQuery, ActionDestinationQueryVariables>(ActionDestinationDocument, options);
        }
export type ActionDestinationQueryHookResult = ReturnType<typeof useActionDestinationQuery>;
export type ActionDestinationLazyQueryHookResult = ReturnType<typeof useActionDestinationLazyQuery>;
export type ActionDestinationQueryResult = Apollo.QueryResult<ActionDestinationQuery, ActionDestinationQueryVariables>;