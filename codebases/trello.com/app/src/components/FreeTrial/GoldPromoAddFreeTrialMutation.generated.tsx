import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"GoldPromoAddFreeTrial"}}
export type GoldPromoAddFreeTrialMutationVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
  count: Types.Scalars['Int'];
  via: Types.Scalars['String'];
}>;


export type GoldPromoAddFreeTrialMutation = (
  { __typename: 'Mutation' }
  & { addFreeTrial?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
  )> }
);


export const GoldPromoAddFreeTrialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GoldPromoAddFreeTrial"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"via"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFreeTrial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}},{"kind":"Argument","name":{"kind":"Name","value":"via"},"value":{"kind":"Variable","name":{"kind":"Name","value":"via"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type GoldPromoAddFreeTrialMutationFn = Apollo.MutationFunction<GoldPromoAddFreeTrialMutation, GoldPromoAddFreeTrialMutationVariables>;

/**
 * __useGoldPromoAddFreeTrialMutation__
 *
 * To run a mutation, you first call `useGoldPromoAddFreeTrialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoldPromoAddFreeTrialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [goldPromoAddFreeTrialMutation, { data, loading, error }] = useGoldPromoAddFreeTrialMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      count: // value for 'count'
 *      via: // value for 'via'
 *   },
 * });
 */
export function useGoldPromoAddFreeTrialMutation(baseOptions?: Apollo.MutationHookOptions<GoldPromoAddFreeTrialMutation, GoldPromoAddFreeTrialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoldPromoAddFreeTrialMutation, GoldPromoAddFreeTrialMutationVariables>(GoldPromoAddFreeTrialDocument, options);
      }
export type GoldPromoAddFreeTrialMutationHookResult = ReturnType<typeof useGoldPromoAddFreeTrialMutation>;
export type GoldPromoAddFreeTrialMutationResult = Apollo.MutationResult<GoldPromoAddFreeTrialMutation>;
export type GoldPromoAddFreeTrialMutationOptions = Apollo.BaseMutationOptions<GoldPromoAddFreeTrialMutation, GoldPromoAddFreeTrialMutationVariables>;