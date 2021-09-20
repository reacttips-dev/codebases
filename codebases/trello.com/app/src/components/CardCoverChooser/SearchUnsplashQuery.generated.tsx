import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"SearchUnsplash"}}
export type SearchUnsplashQueryVariables = Types.Exact<{
  query?: Types.Maybe<Types.Scalars['String']>;
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type SearchUnsplashQuery = (
  { __typename: 'Query' }
  & { unsplashPhotos: Array<(
    { __typename: 'UnsplashPhoto' }
    & Pick<Types.UnsplashPhoto, 'id'>
    & { urls: (
      { __typename: 'UnsplashPhoto_Urls' }
      & Pick<Types.UnsplashPhoto_Urls, 'thumb' | 'raw'>
    ), links: (
      { __typename: 'UnsplashPhoto_Links' }
      & Pick<Types.UnsplashPhoto_Links, 'download_location'>
    ), user: (
      { __typename: 'UnsplashPhoto_User' }
      & Pick<Types.UnsplashPhoto_User, 'id' | 'name'>
      & { links: (
        { __typename: 'UnsplashPhoto_User_Links' }
        & Pick<Types.UnsplashPhoto_User_Links, 'html'>
      ) }
    ) }
  )> }
);


export const SearchUnsplashDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchUnsplash"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"perPage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsplashPhotos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"perPage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"perPage"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumb"}},{"kind":"Field","name":{"kind":"Name","value":"raw"}}]}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"download_location"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"html"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useSearchUnsplashQuery__
 *
 * To run a query within a React component, call `useSearchUnsplashQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUnsplashQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUnsplashQuery({
 *   variables: {
 *      query: // value for 'query'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useSearchUnsplashQuery(baseOptions?: Apollo.QueryHookOptions<SearchUnsplashQuery, SearchUnsplashQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUnsplashQuery, SearchUnsplashQueryVariables>(SearchUnsplashDocument, options);
      }
export function useSearchUnsplashLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUnsplashQuery, SearchUnsplashQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUnsplashQuery, SearchUnsplashQueryVariables>(SearchUnsplashDocument, options);
        }
export type SearchUnsplashQueryHookResult = ReturnType<typeof useSearchUnsplashQuery>;
export type SearchUnsplashLazyQueryHookResult = ReturnType<typeof useSearchUnsplashLazyQuery>;
export type SearchUnsplashQueryResult = Apollo.QueryResult<SearchUnsplashQuery, SearchUnsplashQueryVariables>;