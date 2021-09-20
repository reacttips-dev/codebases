import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"QrCode"}}
export type QrCodeQueryVariables = Types.Exact<{
  url: Types.Scalars['String'];
}>;


export type QrCodeQuery = (
  { __typename: 'Query' }
  & { qrCode: (
    { __typename: 'QrCode' }
    & Pick<Types.QrCode, 'imageData'>
  ) }
);


export const QrCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QrCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qrCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageData"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useQrCodeQuery__
 *
 * To run a query within a React component, call `useQrCodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useQrCodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQrCodeQuery({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useQrCodeQuery(baseOptions: Apollo.QueryHookOptions<QrCodeQuery, QrCodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QrCodeQuery, QrCodeQueryVariables>(QrCodeDocument, options);
      }
export function useQrCodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QrCodeQuery, QrCodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QrCodeQuery, QrCodeQueryVariables>(QrCodeDocument, options);
        }
export type QrCodeQueryHookResult = ReturnType<typeof useQrCodeQuery>;
export type QrCodeLazyQueryHookResult = ReturnType<typeof useQrCodeLazyQuery>;
export type QrCodeQueryResult = Apollo.QueryResult<QrCodeQuery, QrCodeQueryVariables>;