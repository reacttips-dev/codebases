import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardBannerList"}}
export type BoardBannerListQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type BoardBannerListQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'oneTimeMessagesDismissed'>
    & { banners: Array<(
      { __typename: 'Member_Banner' }
      & Pick<Types.Member_Banner, 'id' | 'message' | 'url' | 'dismissible'>
      & { meta?: Types.Maybe<(
        { __typename: 'Member_BannerMeta' }
        & Pick<Types.Member_BannerMeta, 'totalMembersInDomain' | 'totalWorkspacesInDomain'>
      )> }
    )> }
  )> }
);


export const BoardBannerListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardBannerList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"dismissible"}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalMembersInDomain"}},{"kind":"Field","name":{"kind":"Name","value":"totalWorkspacesInDomain"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardBannerListQuery__
 *
 * To run a query within a React component, call `useBoardBannerListQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardBannerListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardBannerListQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useBoardBannerListQuery(baseOptions: Apollo.QueryHookOptions<BoardBannerListQuery, BoardBannerListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardBannerListQuery, BoardBannerListQueryVariables>(BoardBannerListDocument, options);
      }
export function useBoardBannerListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardBannerListQuery, BoardBannerListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardBannerListQuery, BoardBannerListQueryVariables>(BoardBannerListDocument, options);
        }
export type BoardBannerListQueryHookResult = ReturnType<typeof useBoardBannerListQuery>;
export type BoardBannerListLazyQueryHookResult = ReturnType<typeof useBoardBannerListLazyQuery>;
export type BoardBannerListQueryResult = Apollo.QueryResult<BoardBannerListQuery, BoardBannerListQueryVariables>;