import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TrelloEnterpriseLearnMoreMemberId"}}
export type TrelloEnterpriseLearnMoreMemberIdQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TrelloEnterpriseLearnMoreMemberIdQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'idOrganizations'>
  )> }
);


export const TrelloEnterpriseLearnMoreMemberIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloEnterpriseLearnMoreMemberId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganizations"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTrelloEnterpriseLearnMoreMemberIdQuery__
 *
 * To run a query within a React component, call `useTrelloEnterpriseLearnMoreMemberIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloEnterpriseLearnMoreMemberIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloEnterpriseLearnMoreMemberIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useTrelloEnterpriseLearnMoreMemberIdQuery(baseOptions?: Apollo.QueryHookOptions<TrelloEnterpriseLearnMoreMemberIdQuery, TrelloEnterpriseLearnMoreMemberIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrelloEnterpriseLearnMoreMemberIdQuery, TrelloEnterpriseLearnMoreMemberIdQueryVariables>(TrelloEnterpriseLearnMoreMemberIdDocument, options);
      }
export function useTrelloEnterpriseLearnMoreMemberIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrelloEnterpriseLearnMoreMemberIdQuery, TrelloEnterpriseLearnMoreMemberIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrelloEnterpriseLearnMoreMemberIdQuery, TrelloEnterpriseLearnMoreMemberIdQueryVariables>(TrelloEnterpriseLearnMoreMemberIdDocument, options);
        }
export type TrelloEnterpriseLearnMoreMemberIdQueryHookResult = ReturnType<typeof useTrelloEnterpriseLearnMoreMemberIdQuery>;
export type TrelloEnterpriseLearnMoreMemberIdLazyQueryHookResult = ReturnType<typeof useTrelloEnterpriseLearnMoreMemberIdLazyQuery>;
export type TrelloEnterpriseLearnMoreMemberIdQueryResult = Apollo.QueryResult<TrelloEnterpriseLearnMoreMemberIdQuery, TrelloEnterpriseLearnMoreMemberIdQueryVariables>;