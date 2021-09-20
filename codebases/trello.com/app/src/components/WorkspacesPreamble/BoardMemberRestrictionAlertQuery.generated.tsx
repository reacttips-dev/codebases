import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardMemberRestrictionAlert"}}
export type BoardMemberRestrictionAlertQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type BoardMemberRestrictionAlertQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'displayName'>
  )> }
);


export const BoardMemberRestrictionAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardMemberRestrictionAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardMemberRestrictionAlertQuery__
 *
 * To run a query within a React component, call `useBoardMemberRestrictionAlertQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardMemberRestrictionAlertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardMemberRestrictionAlertQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useBoardMemberRestrictionAlertQuery(baseOptions: Apollo.QueryHookOptions<BoardMemberRestrictionAlertQuery, BoardMemberRestrictionAlertQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardMemberRestrictionAlertQuery, BoardMemberRestrictionAlertQueryVariables>(BoardMemberRestrictionAlertDocument, options);
      }
export function useBoardMemberRestrictionAlertLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardMemberRestrictionAlertQuery, BoardMemberRestrictionAlertQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardMemberRestrictionAlertQuery, BoardMemberRestrictionAlertQueryVariables>(BoardMemberRestrictionAlertDocument, options);
        }
export type BoardMemberRestrictionAlertQueryHookResult = ReturnType<typeof useBoardMemberRestrictionAlertQuery>;
export type BoardMemberRestrictionAlertLazyQueryHookResult = ReturnType<typeof useBoardMemberRestrictionAlertLazyQuery>;
export type BoardMemberRestrictionAlertQueryResult = Apollo.QueryResult<BoardMemberRestrictionAlertQuery, BoardMemberRestrictionAlertQueryVariables>;