import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberPopover"}}
export type MemberPopoverQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type MemberPopoverQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'email'>
  )> }
);


export const MemberPopoverDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberPopover"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberPopoverQuery__
 *
 * To run a query within a React component, call `useMemberPopoverQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberPopoverQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberPopoverQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMemberPopoverQuery(baseOptions: Apollo.QueryHookOptions<MemberPopoverQuery, MemberPopoverQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberPopoverQuery, MemberPopoverQueryVariables>(MemberPopoverDocument, options);
      }
export function useMemberPopoverLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberPopoverQuery, MemberPopoverQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberPopoverQuery, MemberPopoverQueryVariables>(MemberPopoverDocument, options);
        }
export type MemberPopoverQueryHookResult = ReturnType<typeof useMemberPopoverQuery>;
export type MemberPopoverLazyQueryHookResult = ReturnType<typeof useMemberPopoverLazyQuery>;
export type MemberPopoverQueryResult = Apollo.QueryResult<MemberPopoverQuery, MemberPopoverQueryVariables>;