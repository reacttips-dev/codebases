import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardVisibilityRestrictionAlert"}}
export type BoardVisibilityRestrictionAlertQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type BoardVisibilityRestrictionAlertQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'displayName' | 'name'>
    & { memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'>
    )> }
  )> }
);


export const BoardVisibilityRestrictionAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardVisibilityRestrictionAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardVisibilityRestrictionAlertQuery__
 *
 * To run a query within a React component, call `useBoardVisibilityRestrictionAlertQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardVisibilityRestrictionAlertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardVisibilityRestrictionAlertQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useBoardVisibilityRestrictionAlertQuery(baseOptions: Apollo.QueryHookOptions<BoardVisibilityRestrictionAlertQuery, BoardVisibilityRestrictionAlertQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardVisibilityRestrictionAlertQuery, BoardVisibilityRestrictionAlertQueryVariables>(BoardVisibilityRestrictionAlertDocument, options);
      }
export function useBoardVisibilityRestrictionAlertLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardVisibilityRestrictionAlertQuery, BoardVisibilityRestrictionAlertQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardVisibilityRestrictionAlertQuery, BoardVisibilityRestrictionAlertQueryVariables>(BoardVisibilityRestrictionAlertDocument, options);
        }
export type BoardVisibilityRestrictionAlertQueryHookResult = ReturnType<typeof useBoardVisibilityRestrictionAlertQuery>;
export type BoardVisibilityRestrictionAlertLazyQueryHookResult = ReturnType<typeof useBoardVisibilityRestrictionAlertLazyQuery>;
export type BoardVisibilityRestrictionAlertQueryResult = Apollo.QueryResult<BoardVisibilityRestrictionAlertQuery, BoardVisibilityRestrictionAlertQueryVariables>;