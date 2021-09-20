import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"PlanSelectionOverlay"}}
export type PlanSelectionOverlayQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type PlanSelectionOverlayQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'name' | 'standardVariation'>
    & { memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
    )> }
  )> }
);


export const PlanSelectionOverlayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlanSelectionOverlay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"standardVariation"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __usePlanSelectionOverlayQuery__
 *
 * To run a query within a React component, call `usePlanSelectionOverlayQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlanSelectionOverlayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlanSelectionOverlayQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function usePlanSelectionOverlayQuery(baseOptions: Apollo.QueryHookOptions<PlanSelectionOverlayQuery, PlanSelectionOverlayQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlanSelectionOverlayQuery, PlanSelectionOverlayQueryVariables>(PlanSelectionOverlayDocument, options);
      }
export function usePlanSelectionOverlayLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlanSelectionOverlayQuery, PlanSelectionOverlayQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlanSelectionOverlayQuery, PlanSelectionOverlayQueryVariables>(PlanSelectionOverlayDocument, options);
        }
export type PlanSelectionOverlayQueryHookResult = ReturnType<typeof usePlanSelectionOverlayQuery>;
export type PlanSelectionOverlayLazyQueryHookResult = ReturnType<typeof usePlanSelectionOverlayLazyQuery>;
export type PlanSelectionOverlayQueryResult = Apollo.QueryResult<PlanSelectionOverlayQuery, PlanSelectionOverlayQueryVariables>;