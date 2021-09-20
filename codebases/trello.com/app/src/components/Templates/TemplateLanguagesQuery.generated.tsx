import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TemplateLanguages"}}
export type TemplateLanguagesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TemplateLanguagesQuery = (
  { __typename: 'Query' }
  & { templateLanguages: Array<(
    { __typename: 'TemplateLanguage' }
    & Pick<Types.TemplateLanguage, 'language' | 'locale' | 'description' | 'localizedDescription' | 'enabled'>
  )> }
);


export const TemplateLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplateLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateLanguages"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"localizedDescription"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTemplateLanguagesQuery__
 *
 * To run a query within a React component, call `useTemplateLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateLanguagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTemplateLanguagesQuery(baseOptions?: Apollo.QueryHookOptions<TemplateLanguagesQuery, TemplateLanguagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplateLanguagesQuery, TemplateLanguagesQueryVariables>(TemplateLanguagesDocument, options);
      }
export function useTemplateLanguagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplateLanguagesQuery, TemplateLanguagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplateLanguagesQuery, TemplateLanguagesQueryVariables>(TemplateLanguagesDocument, options);
        }
export type TemplateLanguagesQueryHookResult = ReturnType<typeof useTemplateLanguagesQuery>;
export type TemplateLanguagesLazyQueryHookResult = ReturnType<typeof useTemplateLanguagesLazyQuery>;
export type TemplateLanguagesQueryResult = Apollo.QueryResult<TemplateLanguagesQuery, TemplateLanguagesQueryVariables>;