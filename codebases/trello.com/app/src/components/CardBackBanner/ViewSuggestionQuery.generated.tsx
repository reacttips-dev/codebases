import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ViewSuggestion"}}
export type ViewSuggestionQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID'];
}>;


export type ViewSuggestionQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'idLabels' | 'idMembers' | 'start' | 'due'>
    & { checklists: Array<(
      { __typename: 'Checklist' }
      & Pick<Types.Checklist, 'id'>
      & { checkItems: Array<(
        { __typename: 'CheckItem' }
        & Pick<Types.CheckItem, 'id' | 'due'>
      )> }
    )> }
  )> }
);


export const ViewSuggestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewSuggestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idLabels"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"due"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useViewSuggestionQuery__
 *
 * To run a query within a React component, call `useViewSuggestionQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewSuggestionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewSuggestionQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useViewSuggestionQuery(baseOptions: Apollo.QueryHookOptions<ViewSuggestionQuery, ViewSuggestionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewSuggestionQuery, ViewSuggestionQueryVariables>(ViewSuggestionDocument, options);
      }
export function useViewSuggestionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewSuggestionQuery, ViewSuggestionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewSuggestionQuery, ViewSuggestionQueryVariables>(ViewSuggestionDocument, options);
        }
export type ViewSuggestionQueryHookResult = ReturnType<typeof useViewSuggestionQuery>;
export type ViewSuggestionLazyQueryHookResult = ReturnType<typeof useViewSuggestionLazyQuery>;
export type ViewSuggestionQueryResult = Apollo.QueryResult<ViewSuggestionQuery, ViewSuggestionQueryVariables>;