import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UseCreateTeamAndMoveBoardsCreateTeam"}}
export type UseCreateTeamAndMoveBoardsCreateTeamMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type UseCreateTeamAndMoveBoardsCreateTeamMutation = (
  { __typename: 'Mutation' }
  & { createOrganization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
  )> }
);


export const UseCreateTeamAndMoveBoardsCreateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UseCreateTeamAndMoveBoardsCreateTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"displayName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"StringValue","value":"default","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"teamType"},"value":{"kind":"StringValue","value":"other","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"creationMethod"},"value":{"kind":"StringValue","value":"teamify-wizard","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"StringValue","value":"","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type UseCreateTeamAndMoveBoardsCreateTeamMutationFn = Apollo.MutationFunction<UseCreateTeamAndMoveBoardsCreateTeamMutation, UseCreateTeamAndMoveBoardsCreateTeamMutationVariables>;

/**
 * __useUseCreateTeamAndMoveBoardsCreateTeamMutation__
 *
 * To run a mutation, you first call `useUseCreateTeamAndMoveBoardsCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUseCreateTeamAndMoveBoardsCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [useCreateTeamAndMoveBoardsCreateTeamMutation, { data, loading, error }] = useUseCreateTeamAndMoveBoardsCreateTeamMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUseCreateTeamAndMoveBoardsCreateTeamMutation(baseOptions?: Apollo.MutationHookOptions<UseCreateTeamAndMoveBoardsCreateTeamMutation, UseCreateTeamAndMoveBoardsCreateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UseCreateTeamAndMoveBoardsCreateTeamMutation, UseCreateTeamAndMoveBoardsCreateTeamMutationVariables>(UseCreateTeamAndMoveBoardsCreateTeamDocument, options);
      }
export type UseCreateTeamAndMoveBoardsCreateTeamMutationHookResult = ReturnType<typeof useUseCreateTeamAndMoveBoardsCreateTeamMutation>;
export type UseCreateTeamAndMoveBoardsCreateTeamMutationResult = Apollo.MutationResult<UseCreateTeamAndMoveBoardsCreateTeamMutation>;
export type UseCreateTeamAndMoveBoardsCreateTeamMutationOptions = Apollo.BaseMutationOptions<UseCreateTeamAndMoveBoardsCreateTeamMutation, UseCreateTeamAndMoveBoardsCreateTeamMutationVariables>;