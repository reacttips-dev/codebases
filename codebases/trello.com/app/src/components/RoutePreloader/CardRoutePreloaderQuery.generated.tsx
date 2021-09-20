import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardRoutePreloader"}}
export type CardRoutePreloaderQueryVariables = Types.Exact<{
  cardId: Types.Scalars['ID'];
  memberId: Types.Scalars['ID'];
}>;


export type CardRoutePreloaderQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'idBoard'>
    & { board: (
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'idOrganization'>
    ) }
  )>, member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed' | 'products' | 'username'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'closed' | 'dateLastView' | 'idOrganization' | 'url'>
      & { organization?: Types.Maybe<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'displayName' | 'id' | 'logoHash'>
      )> }
    )>, logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'claimable'>
    )>, organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'displayName' | 'id' | 'logoHash' | 'name' | 'premiumFeatures' | 'products'>
    )> }
  )> }
);


export const CardRoutePreloaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardRoutePreloader"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claimable"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardRoutePreloaderQuery__
 *
 * To run a query within a React component, call `useCardRoutePreloaderQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardRoutePreloaderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardRoutePreloaderQuery({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useCardRoutePreloaderQuery(baseOptions: Apollo.QueryHookOptions<CardRoutePreloaderQuery, CardRoutePreloaderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardRoutePreloaderQuery, CardRoutePreloaderQueryVariables>(CardRoutePreloaderDocument, options);
      }
export function useCardRoutePreloaderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardRoutePreloaderQuery, CardRoutePreloaderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardRoutePreloaderQuery, CardRoutePreloaderQueryVariables>(CardRoutePreloaderDocument, options);
        }
export type CardRoutePreloaderQueryHookResult = ReturnType<typeof useCardRoutePreloaderQuery>;
export type CardRoutePreloaderLazyQueryHookResult = ReturnType<typeof useCardRoutePreloaderLazyQuery>;
export type CardRoutePreloaderQueryResult = Apollo.QueryResult<CardRoutePreloaderQuery, CardRoutePreloaderQueryVariables>;