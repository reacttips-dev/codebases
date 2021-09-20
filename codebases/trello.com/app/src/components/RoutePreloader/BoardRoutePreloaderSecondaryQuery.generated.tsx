import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardRoutePreloaderSecondary"}}
export type BoardRoutePreloaderSecondaryQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type BoardRoutePreloaderSecondaryQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'billableCollaboratorCount' | 'billableMemberCount' | 'creationMethod' | 'displayName' | 'id' | 'idMemberCreator' | 'premiumFeatures' | 'products' | 'teamType' | 'url'>
  )> }
);


export const BoardRoutePreloaderSecondaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardRoutePreloaderSecondary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billableCollaboratorCount"}},{"kind":"Field","name":{"kind":"Name","value":"billableMemberCount"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"teamType"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardRoutePreloaderSecondaryQuery__
 *
 * To run a query within a React component, call `useBoardRoutePreloaderSecondaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardRoutePreloaderSecondaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardRoutePreloaderSecondaryQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useBoardRoutePreloaderSecondaryQuery(baseOptions: Apollo.QueryHookOptions<BoardRoutePreloaderSecondaryQuery, BoardRoutePreloaderSecondaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardRoutePreloaderSecondaryQuery, BoardRoutePreloaderSecondaryQueryVariables>(BoardRoutePreloaderSecondaryDocument, options);
      }
export function useBoardRoutePreloaderSecondaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardRoutePreloaderSecondaryQuery, BoardRoutePreloaderSecondaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardRoutePreloaderSecondaryQuery, BoardRoutePreloaderSecondaryQueryVariables>(BoardRoutePreloaderSecondaryDocument, options);
        }
export type BoardRoutePreloaderSecondaryQueryHookResult = ReturnType<typeof useBoardRoutePreloaderSecondaryQuery>;
export type BoardRoutePreloaderSecondaryLazyQueryHookResult = ReturnType<typeof useBoardRoutePreloaderSecondaryLazyQuery>;
export type BoardRoutePreloaderSecondaryQueryResult = Apollo.QueryResult<BoardRoutePreloaderSecondaryQuery, BoardRoutePreloaderSecondaryQueryVariables>;