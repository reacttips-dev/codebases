import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardViewsPopoverUpsell"}}
export type BoardViewsPopoverUpsellQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type BoardViewsPopoverUpsellQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'products'>
  )> }
);


export const BoardViewsPopoverUpsellDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardViewsPopoverUpsell"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardViewsPopoverUpsellQuery__
 *
 * To run a query within a React component, call `useBoardViewsPopoverUpsellQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardViewsPopoverUpsellQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardViewsPopoverUpsellQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useBoardViewsPopoverUpsellQuery(baseOptions: Apollo.QueryHookOptions<BoardViewsPopoverUpsellQuery, BoardViewsPopoverUpsellQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardViewsPopoverUpsellQuery, BoardViewsPopoverUpsellQueryVariables>(BoardViewsPopoverUpsellDocument, options);
      }
export function useBoardViewsPopoverUpsellLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardViewsPopoverUpsellQuery, BoardViewsPopoverUpsellQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardViewsPopoverUpsellQuery, BoardViewsPopoverUpsellQueryVariables>(BoardViewsPopoverUpsellDocument, options);
        }
export type BoardViewsPopoverUpsellQueryHookResult = ReturnType<typeof useBoardViewsPopoverUpsellQuery>;
export type BoardViewsPopoverUpsellLazyQueryHookResult = ReturnType<typeof useBoardViewsPopoverUpsellLazyQuery>;
export type BoardViewsPopoverUpsellQueryResult = Apollo.QueryResult<BoardViewsPopoverUpsellQuery, BoardViewsPopoverUpsellQueryVariables>;