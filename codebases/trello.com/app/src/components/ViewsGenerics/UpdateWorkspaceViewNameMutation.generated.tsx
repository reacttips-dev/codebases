import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateWorkspaceViewName"}}
export type UpdateWorkspaceViewNameMutationVariables = Types.Exact<{
  idOrganizationView: Types.Scalars['ID'];
  name: Types.Scalars['String'];
}>;


export type UpdateWorkspaceViewNameMutation = (
  { __typename: 'Mutation' }
  & { updateOrganizationView?: Types.Maybe<(
    { __typename: 'OrganizationView' }
    & Pick<Types.OrganizationView, 'id' | 'name' | 'shortLink' | 'idOrganization' | 'idMemberCreator'>
    & { prefs: (
      { __typename: 'OrganizationView_Prefs' }
      & Pick<Types.OrganizationView_Prefs, 'permissionLevel'>
    ) }
  )> }
);


export const UpdateWorkspaceViewNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorkspaceViewName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganizationView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idOrganizationView"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}}},{"kind":"Argument","name":{"kind":"Name","value":"organizationView"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}}]}}]}}]} as unknown as DocumentNode;
export type UpdateWorkspaceViewNameMutationFn = Apollo.MutationFunction<UpdateWorkspaceViewNameMutation, UpdateWorkspaceViewNameMutationVariables>;

/**
 * __useUpdateWorkspaceViewNameMutation__
 *
 * To run a mutation, you first call `useUpdateWorkspaceViewNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkspaceViewNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkspaceViewNameMutation, { data, loading, error }] = useUpdateWorkspaceViewNameMutation({
 *   variables: {
 *      idOrganizationView: // value for 'idOrganizationView'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateWorkspaceViewNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWorkspaceViewNameMutation, UpdateWorkspaceViewNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWorkspaceViewNameMutation, UpdateWorkspaceViewNameMutationVariables>(UpdateWorkspaceViewNameDocument, options);
      }
export type UpdateWorkspaceViewNameMutationHookResult = ReturnType<typeof useUpdateWorkspaceViewNameMutation>;
export type UpdateWorkspaceViewNameMutationResult = Apollo.MutationResult<UpdateWorkspaceViewNameMutation>;
export type UpdateWorkspaceViewNameMutationOptions = Apollo.BaseMutationOptions<UpdateWorkspaceViewNameMutation, UpdateWorkspaceViewNameMutationVariables>;