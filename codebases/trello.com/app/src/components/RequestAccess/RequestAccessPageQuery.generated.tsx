import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"RequestAccessPage"}}
export type RequestAccessPageQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  modelType: Types.RequestAccessModelType;
  modelId: Types.Scalars['ID'];
}>;


export type RequestAccessPageQuery = (
  { __typename: 'Query' }
  & { boardAccessRequest: (
    { __typename: 'BoardAccessRequest' }
    & Pick<Types.BoardAccessRequest, 'requested'>
  ), member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'fullName' | 'email'>
  )> }
);


export const RequestAccessPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RequestAccessPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestAccessModelType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardAccessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"modelType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requested"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useRequestAccessPageQuery__
 *
 * To run a query within a React component, call `useRequestAccessPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestAccessPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestAccessPageQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      modelType: // value for 'modelType'
 *      modelId: // value for 'modelId'
 *   },
 * });
 */
export function useRequestAccessPageQuery(baseOptions: Apollo.QueryHookOptions<RequestAccessPageQuery, RequestAccessPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RequestAccessPageQuery, RequestAccessPageQueryVariables>(RequestAccessPageDocument, options);
      }
export function useRequestAccessPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RequestAccessPageQuery, RequestAccessPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RequestAccessPageQuery, RequestAccessPageQueryVariables>(RequestAccessPageDocument, options);
        }
export type RequestAccessPageQueryHookResult = ReturnType<typeof useRequestAccessPageQuery>;
export type RequestAccessPageLazyQueryHookResult = ReturnType<typeof useRequestAccessPageLazyQuery>;
export type RequestAccessPageQueryResult = Apollo.QueryResult<RequestAccessPageQuery, RequestAccessPageQueryVariables>;