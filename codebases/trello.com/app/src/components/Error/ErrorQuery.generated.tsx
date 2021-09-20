import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"Error"}}
export type ErrorQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ErrorQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'email' | 'fullName'>
  )> }
);


export const ErrorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useErrorQuery__
 *
 * To run a query within a React component, call `useErrorQuery` and pass it any options that fit your needs.
 * When your component renders, `useErrorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useErrorQuery({
 *   variables: {
 *   },
 * });
 */
export function useErrorQuery(baseOptions?: Apollo.QueryHookOptions<ErrorQuery, ErrorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ErrorQuery, ErrorQueryVariables>(ErrorDocument, options);
      }
export function useErrorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ErrorQuery, ErrorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ErrorQuery, ErrorQueryVariables>(ErrorDocument, options);
        }
export type ErrorQueryHookResult = ReturnType<typeof useErrorQuery>;
export type ErrorLazyQueryHookResult = ReturnType<typeof useErrorLazyQuery>;
export type ErrorQueryResult = Apollo.QueryResult<ErrorQuery, ErrorQueryVariables>;