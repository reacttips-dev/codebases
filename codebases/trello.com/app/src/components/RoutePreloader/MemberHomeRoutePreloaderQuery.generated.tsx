import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberHomeRoutePreloader"}}
export type MemberHomeRoutePreloaderQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type MemberHomeRoutePreloaderQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'idEnterprisesAdmin' | 'oneTimeMessagesDismissed' | 'confirmed' | 'products' | 'username'>
    & { logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'claimable'>
    )>, boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name' | 'premiumFeatures' | 'shortUrl' | 'closed' | 'dateLastActivity' | 'dateLastView' | 'idOrganization' | 'starred' | 'url'>
      & { memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<Types.Board_Membership, 'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'>
      )>, organization?: Types.Maybe<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'id' | 'displayName' | 'logoHash'>
      )> }
    )>, boardStars: Array<(
      { __typename: 'BoardStar' }
      & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
    )>, cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id' | 'idBoard' | 'isTemplate' | 'name' | 'shortUrl'>
      & { checklists: Array<(
        { __typename: 'Checklist' }
        & Pick<Types.Checklist, 'id'>
        & { checkItems: Array<(
          { __typename: 'CheckItem' }
          & Pick<Types.CheckItem, 'id' | 'due' | 'idChecklist' | 'idMember' | 'name' | 'nameData' | 'pos' | 'state'>
        )> }
      )> }
    )>, organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'premiumFeatures' | 'idMemberCreator' | 'name' | 'desc' | 'descData' | 'displayName' | 'logoHash' | 'products' | 'teamType' | 'url' | 'website'>
    )> }
  )>, templateCategories: Array<(
    { __typename: 'TemplateCategory' }
    & Pick<Types.TemplateCategory, 'key'>
  )> }
);


export const MemberHomeRoutePreloaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberHomeRoutePreloader"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claimable"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"starred"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"idChecklist"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameData"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"descData"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"teamType"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"website"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"templateCategories"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberHomeRoutePreloaderQuery__
 *
 * To run a query within a React component, call `useMemberHomeRoutePreloaderQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberHomeRoutePreloaderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberHomeRoutePreloaderQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMemberHomeRoutePreloaderQuery(baseOptions: Apollo.QueryHookOptions<MemberHomeRoutePreloaderQuery, MemberHomeRoutePreloaderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberHomeRoutePreloaderQuery, MemberHomeRoutePreloaderQueryVariables>(MemberHomeRoutePreloaderDocument, options);
      }
export function useMemberHomeRoutePreloaderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberHomeRoutePreloaderQuery, MemberHomeRoutePreloaderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberHomeRoutePreloaderQuery, MemberHomeRoutePreloaderQueryVariables>(MemberHomeRoutePreloaderDocument, options);
        }
export type MemberHomeRoutePreloaderQueryHookResult = ReturnType<typeof useMemberHomeRoutePreloaderQuery>;
export type MemberHomeRoutePreloaderLazyQueryHookResult = ReturnType<typeof useMemberHomeRoutePreloaderLazyQuery>;
export type MemberHomeRoutePreloaderQueryResult = Apollo.QueryResult<MemberHomeRoutePreloaderQuery, MemberHomeRoutePreloaderQueryVariables>;