import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleCreateTeamSubmit"}}
export type WorkspacesPreambleCreateTeamSubmitMutationVariables = Types.Exact<{
  displayName: Types.Scalars['String'];
  type: Types.Scalars['String'];
  teamType?: Types.Maybe<Types.Scalars['String']>;
  desc?: Types.Maybe<Types.Scalars['String']>;
  enterprise?: Types.Maybe<Types.Scalars['String']>;
  traceId?: Types.Maybe<Types.Scalars['String']>;
}>;


export type WorkspacesPreambleCreateTeamSubmitMutation = (
  { __typename: 'Mutation' }
  & { createOrganization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name'>
  )> }
);


export const WorkspacesPreambleCreateTeamSubmitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WorkspacesPreambleCreateTeamSubmit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enterprise"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"displayName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamType"}}},{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"enterprise"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enterprise"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
export type WorkspacesPreambleCreateTeamSubmitMutationFn = Apollo.MutationFunction<WorkspacesPreambleCreateTeamSubmitMutation, WorkspacesPreambleCreateTeamSubmitMutationVariables>;

/**
 * __useWorkspacesPreambleCreateTeamSubmitMutation__
 *
 * To run a mutation, you first call `useWorkspacesPreambleCreateTeamSubmitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleCreateTeamSubmitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [workspacesPreambleCreateTeamSubmitMutation, { data, loading, error }] = useWorkspacesPreambleCreateTeamSubmitMutation({
 *   variables: {
 *      displayName: // value for 'displayName'
 *      type: // value for 'type'
 *      teamType: // value for 'teamType'
 *      desc: // value for 'desc'
 *      enterprise: // value for 'enterprise'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useWorkspacesPreambleCreateTeamSubmitMutation(baseOptions?: Apollo.MutationHookOptions<WorkspacesPreambleCreateTeamSubmitMutation, WorkspacesPreambleCreateTeamSubmitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WorkspacesPreambleCreateTeamSubmitMutation, WorkspacesPreambleCreateTeamSubmitMutationVariables>(WorkspacesPreambleCreateTeamSubmitDocument, options);
      }
export type WorkspacesPreambleCreateTeamSubmitMutationHookResult = ReturnType<typeof useWorkspacesPreambleCreateTeamSubmitMutation>;
export type WorkspacesPreambleCreateTeamSubmitMutationResult = Apollo.MutationResult<WorkspacesPreambleCreateTeamSubmitMutation>;
export type WorkspacesPreambleCreateTeamSubmitMutationOptions = Apollo.BaseMutationOptions<WorkspacesPreambleCreateTeamSubmitMutation, WorkspacesPreambleCreateTeamSubmitMutationVariables>;