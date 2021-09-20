import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberAvatar"}}
export type MemberAvatarQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type MemberAvatarQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'username' | 'avatarSource' | 'avatarUrl' | 'initials' | 'fullName' | 'products'>
    & { nonPublic?: Types.Maybe<(
      { __typename: 'Member_NonPublic' }
      & Pick<Types.Member_NonPublic, 'initials' | 'fullName' | 'avatarUrl'>
    )> }
  )> }
);


export const MemberAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatarSource"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberAvatarQuery__
 *
 * To run a query within a React component, call `useMemberAvatarQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberAvatarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberAvatarQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMemberAvatarQuery(baseOptions: Apollo.QueryHookOptions<MemberAvatarQuery, MemberAvatarQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberAvatarQuery, MemberAvatarQueryVariables>(MemberAvatarDocument, options);
      }
export function useMemberAvatarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberAvatarQuery, MemberAvatarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberAvatarQuery, MemberAvatarQueryVariables>(MemberAvatarDocument, options);
        }
export type MemberAvatarQueryHookResult = ReturnType<typeof useMemberAvatarQuery>;
export type MemberAvatarLazyQueryHookResult = ReturnType<typeof useMemberAvatarLazyQuery>;
export type MemberAvatarQueryResult = Apollo.QueryResult<MemberAvatarQuery, MemberAvatarQueryVariables>;