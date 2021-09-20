import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"SelectPluginCover"}}
export type SelectPluginCoverQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type SelectPluginCoverQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idOrganization' | 'enterpriseOwned' | 'idEnterprise'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'cardCovers'>
    )>, memberships: Array<(
      { __typename: 'Board_Membership' }
      & Pick<Types.Board_Membership, 'id' | 'idMember' | 'memberType'>
    )>, plugins: Array<(
      { __typename: 'Plugin' }
      & Pick<Types.Plugin, 'id' | 'name' | 'capabilities' | 'tags'>
      & { icon: (
        { __typename: 'Plugin_Icon' }
        & Pick<Types.Plugin_Icon, 'url'>
      ) }
    )>, boardPlugins: Array<(
      { __typename: 'BoardPlugin' }
      & Pick<Types.BoardPlugin, 'idPlugin'>
    )> }
  )> }
);


export const SelectPluginCoverDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SelectPluginCover"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plugins"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"available"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardPlugins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useSelectPluginCoverQuery__
 *
 * To run a query within a React component, call `useSelectPluginCoverQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelectPluginCoverQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelectPluginCoverQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useSelectPluginCoverQuery(baseOptions: Apollo.QueryHookOptions<SelectPluginCoverQuery, SelectPluginCoverQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SelectPluginCoverQuery, SelectPluginCoverQueryVariables>(SelectPluginCoverDocument, options);
      }
export function useSelectPluginCoverLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SelectPluginCoverQuery, SelectPluginCoverQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SelectPluginCoverQuery, SelectPluginCoverQueryVariables>(SelectPluginCoverDocument, options);
        }
export type SelectPluginCoverQueryHookResult = ReturnType<typeof useSelectPluginCoverQuery>;
export type SelectPluginCoverLazyQueryHookResult = ReturnType<typeof useSelectPluginCoverLazyQuery>;
export type SelectPluginCoverQueryResult = Apollo.QueryResult<SelectPluginCoverQuery, SelectPluginCoverQueryVariables>;