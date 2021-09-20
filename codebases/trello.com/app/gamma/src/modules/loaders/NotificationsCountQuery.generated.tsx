import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"NotificationsCount"}}
export type NotificationsCountQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NotificationsCountQuery = (
  { __typename: 'Query' }
  & Pick<Types.Query, 'notificationsCount'>
);


export const NotificationsCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationsCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationsCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"grouped"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"StringValue","value":"all","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]}]}}]} as unknown as DocumentNode;

/**
 * __useNotificationsCountQuery__
 *
 * To run a query within a React component, call `useNotificationsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationsCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationsCountQuery(baseOptions?: Apollo.QueryHookOptions<NotificationsCountQuery, NotificationsCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationsCountQuery, NotificationsCountQueryVariables>(NotificationsCountDocument, options);
      }
export function useNotificationsCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationsCountQuery, NotificationsCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationsCountQuery, NotificationsCountQueryVariables>(NotificationsCountDocument, options);
        }
export type NotificationsCountQueryHookResult = ReturnType<typeof useNotificationsCountQuery>;
export type NotificationsCountLazyQueryHookResult = ReturnType<typeof useNotificationsCountLazyQuery>;
export type NotificationsCountQueryResult = Apollo.QueryResult<NotificationsCountQuery, NotificationsCountQueryVariables>;