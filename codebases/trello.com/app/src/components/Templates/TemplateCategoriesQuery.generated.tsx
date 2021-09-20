import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TemplateCategories"}}
export type TemplateCategoriesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TemplateCategoriesQuery = (
  { __typename: 'Query' }
  & { templateCategories: Array<(
    { __typename: 'TemplateCategory' }
    & Pick<Types.TemplateCategory, 'key'>
  )> }
);


export const TemplateCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplateCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateCategories"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTemplateCategoriesQuery__
 *
 * To run a query within a React component, call `useTemplateCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTemplateCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>(TemplateCategoriesDocument, options);
      }
export function useTemplateCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>(TemplateCategoriesDocument, options);
        }
export type TemplateCategoriesQueryHookResult = ReturnType<typeof useTemplateCategoriesQuery>;
export type TemplateCategoriesLazyQueryHookResult = ReturnType<typeof useTemplateCategoriesLazyQuery>;
export type TemplateCategoriesQueryResult = Apollo.QueryResult<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>;