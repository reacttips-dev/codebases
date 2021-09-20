import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"RestrictedGuests"}}
export type RestrictedGuestsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  orgId: Types.Scalars['ID'];
}>;


export type RestrictedGuestsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )>, prefs: (
      { __typename: 'Organization_Prefs' }
      & Pick<Types.Organization_Prefs, 'boardInviteRestrict'>
    ) }
  )>, board?: Types.Maybe<(
    { __typename: 'Board' }
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'fullName'>
    )> }
  )> }
);


export const RestrictedGuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RestrictedGuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useRestrictedGuestsQuery__
 *
 * To run a query within a React component, call `useRestrictedGuestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRestrictedGuestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRestrictedGuestsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useRestrictedGuestsQuery(baseOptions: Apollo.QueryHookOptions<RestrictedGuestsQuery, RestrictedGuestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RestrictedGuestsQuery, RestrictedGuestsQueryVariables>(RestrictedGuestsDocument, options);
      }
export function useRestrictedGuestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RestrictedGuestsQuery, RestrictedGuestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RestrictedGuestsQuery, RestrictedGuestsQueryVariables>(RestrictedGuestsDocument, options);
        }
export type RestrictedGuestsQueryHookResult = ReturnType<typeof useRestrictedGuestsQuery>;
export type RestrictedGuestsLazyQueryHookResult = ReturnType<typeof useRestrictedGuestsLazyQuery>;
export type RestrictedGuestsQueryResult = Apollo.QueryResult<RestrictedGuestsQuery, RestrictedGuestsQueryVariables>;