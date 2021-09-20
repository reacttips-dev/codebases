import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ActionLabel"}}
export type ActionLabelQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
}>;


export type ActionLabelQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id' | 'name' | 'color'>
    )> }
  )> }
);


export const ActionLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActionLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useActionLabelQuery__
 *
 * To run a query within a React component, call `useActionLabelQuery` and pass it any options that fit your needs.
 * When your component renders, `useActionLabelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActionLabelQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useActionLabelQuery(baseOptions: Apollo.QueryHookOptions<ActionLabelQuery, ActionLabelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ActionLabelQuery, ActionLabelQueryVariables>(ActionLabelDocument, options);
      }
export function useActionLabelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActionLabelQuery, ActionLabelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ActionLabelQuery, ActionLabelQueryVariables>(ActionLabelDocument, options);
        }
export type ActionLabelQueryHookResult = ReturnType<typeof useActionLabelQuery>;
export type ActionLabelLazyQueryHookResult = ReturnType<typeof useActionLabelLazyQuery>;
export type ActionLabelQueryResult = Apollo.QueryResult<ActionLabelQuery, ActionLabelQueryVariables>;