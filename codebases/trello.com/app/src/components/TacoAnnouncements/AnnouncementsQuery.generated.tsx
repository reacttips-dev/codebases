import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"Announcements"}}
export type AnnouncementsQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.Scalars['String']>;
}>;


export type AnnouncementsQuery = (
  { __typename: 'Query' }
  & { announcements: Array<(
    { __typename: 'Announcement' }
    & Pick<Types.Announcement, 'id' | 'title' | 'html' | 'url' | 'locale' | 'type'>
  )> }
);


export const AnnouncementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Announcements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"announcements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"html"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useAnnouncementsQuery__
 *
 * To run a query within a React component, call `useAnnouncementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAnnouncementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAnnouncementsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAnnouncementsQuery(baseOptions?: Apollo.QueryHookOptions<AnnouncementsQuery, AnnouncementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AnnouncementsQuery, AnnouncementsQueryVariables>(AnnouncementsDocument, options);
      }
export function useAnnouncementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AnnouncementsQuery, AnnouncementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AnnouncementsQuery, AnnouncementsQueryVariables>(AnnouncementsDocument, options);
        }
export type AnnouncementsQueryHookResult = ReturnType<typeof useAnnouncementsQuery>;
export type AnnouncementsLazyQueryHookResult = ReturnType<typeof useAnnouncementsLazyQuery>;
export type AnnouncementsQueryResult = Apollo.QueryResult<AnnouncementsQuery, AnnouncementsQueryVariables>;