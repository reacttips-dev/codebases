import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"DismissMigrationMessage"}}
export type DismissMigrationMessageMutationVariables = Types.Exact<{
  messageId: Types.Scalars['ID'];
}>;


export type DismissMigrationMessageMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const DismissMigrationMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissMigrationMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"StringValue","value":"me","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type DismissMigrationMessageMutationFn = Apollo.MutationFunction<DismissMigrationMessageMutation, DismissMigrationMessageMutationVariables>;

/**
 * __useDismissMigrationMessageMutation__
 *
 * To run a mutation, you first call `useDismissMigrationMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissMigrationMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissMigrationMessageMutation, { data, loading, error }] = useDismissMigrationMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useDismissMigrationMessageMutation(baseOptions?: Apollo.MutationHookOptions<DismissMigrationMessageMutation, DismissMigrationMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DismissMigrationMessageMutation, DismissMigrationMessageMutationVariables>(DismissMigrationMessageDocument, options);
      }
export type DismissMigrationMessageMutationHookResult = ReturnType<typeof useDismissMigrationMessageMutation>;
export type DismissMigrationMessageMutationResult = Apollo.MutationResult<DismissMigrationMessageMutation>;
export type DismissMigrationMessageMutationOptions = Apollo.BaseMutationOptions<DismissMigrationMessageMutation, DismissMigrationMessageMutationVariables>;