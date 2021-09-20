import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"EmailHygieneChangeEmail"}}
export type EmailHygieneChangeEmailMutationVariables = Types.Exact<{
  loginId: Types.Scalars['ID'];
  email: Types.Scalars['String'];
  dismissMessage?: Types.Maybe<Types.Scalars['String']>;
}>;


export type EmailHygieneChangeEmailMutation = (
  { __typename: 'Mutation' }
  & { changeMemberEmail?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'email'>
  )> }
);


export const EmailHygieneChangeEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EmailHygieneChangeEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loginId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dismissMessage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeMemberEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loginId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loginId"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"primary"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"dismissMessage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dismissMessage"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode;
export type EmailHygieneChangeEmailMutationFn = Apollo.MutationFunction<EmailHygieneChangeEmailMutation, EmailHygieneChangeEmailMutationVariables>;

/**
 * __useEmailHygieneChangeEmailMutation__
 *
 * To run a mutation, you first call `useEmailHygieneChangeEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailHygieneChangeEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailHygieneChangeEmailMutation, { data, loading, error }] = useEmailHygieneChangeEmailMutation({
 *   variables: {
 *      loginId: // value for 'loginId'
 *      email: // value for 'email'
 *      dismissMessage: // value for 'dismissMessage'
 *   },
 * });
 */
export function useEmailHygieneChangeEmailMutation(baseOptions?: Apollo.MutationHookOptions<EmailHygieneChangeEmailMutation, EmailHygieneChangeEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EmailHygieneChangeEmailMutation, EmailHygieneChangeEmailMutationVariables>(EmailHygieneChangeEmailDocument, options);
      }
export type EmailHygieneChangeEmailMutationHookResult = ReturnType<typeof useEmailHygieneChangeEmailMutation>;
export type EmailHygieneChangeEmailMutationResult = Apollo.MutationResult<EmailHygieneChangeEmailMutation>;
export type EmailHygieneChangeEmailMutationOptions = Apollo.BaseMutationOptions<EmailHygieneChangeEmailMutation, EmailHygieneChangeEmailMutationVariables>;