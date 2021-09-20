import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"PrepMemberForAtlassianAccountOnboarding"}}
export type PrepMemberForAtlassianAccountOnboardingMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  aaLoginId: Types.Scalars['ID'];
  nonAaLoginIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type PrepMemberForAtlassianAccountOnboardingMutation = (
  { __typename: 'Mutation' }
  & { prepMemberForAtlassianAccountOnboarding?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'aaId' | 'email' | 'aaEmail' | 'isAaMastered'>
    & { logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'id' | 'primary' | 'email'>
    )> }
  )> }
);


export const PrepMemberForAtlassianAccountOnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PrepMemberForAtlassianAccountOnboarding"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"aaLoginId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nonAaLoginIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prepMemberForAtlassianAccountOnboarding"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"aaLoginId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"aaLoginId"}}},{"kind":"Argument","name":{"kind":"Name","value":"nonAaLoginIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nonAaLoginIds"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aaId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"aaEmail"}},{"kind":"Field","name":{"kind":"Name","value":"isAaMastered"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode;
export type PrepMemberForAtlassianAccountOnboardingMutationFn = Apollo.MutationFunction<PrepMemberForAtlassianAccountOnboardingMutation, PrepMemberForAtlassianAccountOnboardingMutationVariables>;

/**
 * __usePrepMemberForAtlassianAccountOnboardingMutation__
 *
 * To run a mutation, you first call `usePrepMemberForAtlassianAccountOnboardingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePrepMemberForAtlassianAccountOnboardingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [prepMemberForAtlassianAccountOnboardingMutation, { data, loading, error }] = usePrepMemberForAtlassianAccountOnboardingMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      aaLoginId: // value for 'aaLoginId'
 *      nonAaLoginIds: // value for 'nonAaLoginIds'
 *   },
 * });
 */
export function usePrepMemberForAtlassianAccountOnboardingMutation(baseOptions?: Apollo.MutationHookOptions<PrepMemberForAtlassianAccountOnboardingMutation, PrepMemberForAtlassianAccountOnboardingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PrepMemberForAtlassianAccountOnboardingMutation, PrepMemberForAtlassianAccountOnboardingMutationVariables>(PrepMemberForAtlassianAccountOnboardingDocument, options);
      }
export type PrepMemberForAtlassianAccountOnboardingMutationHookResult = ReturnType<typeof usePrepMemberForAtlassianAccountOnboardingMutation>;
export type PrepMemberForAtlassianAccountOnboardingMutationResult = Apollo.MutationResult<PrepMemberForAtlassianAccountOnboardingMutation>;
export type PrepMemberForAtlassianAccountOnboardingMutationOptions = Apollo.BaseMutationOptions<PrepMemberForAtlassianAccountOnboardingMutation, PrepMemberForAtlassianAccountOnboardingMutationVariables>;