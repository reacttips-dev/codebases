import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"PrepMemberForEmailHygiene"}}
export type PrepMemberForEmailHygieneMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  primaryLoginId: Types.Scalars['ID'];
  removeLoginIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
  dismissMessage?: Types.Maybe<Types.Scalars['String']>;
}>;


export type PrepMemberForEmailHygieneMutation = (
  { __typename: 'Mutation' }
  & { prepMemberForEmailHygiene?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'email'>
    & { logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'id' | 'primary' | 'email'>
    )> }
  )> }
);


export const PrepMemberForEmailHygieneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PrepMemberForEmailHygiene"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"primaryLoginId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"removeLoginIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dismissMessage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prepMemberForEmailHygiene"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"primaryLoginId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"primaryLoginId"}}},{"kind":"Argument","name":{"kind":"Name","value":"removeLoginIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"removeLoginIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"dismissMessage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dismissMessage"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode;
export type PrepMemberForEmailHygieneMutationFn = Apollo.MutationFunction<PrepMemberForEmailHygieneMutation, PrepMemberForEmailHygieneMutationVariables>;

/**
 * __usePrepMemberForEmailHygieneMutation__
 *
 * To run a mutation, you first call `usePrepMemberForEmailHygieneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePrepMemberForEmailHygieneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [prepMemberForEmailHygieneMutation, { data, loading, error }] = usePrepMemberForEmailHygieneMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      primaryLoginId: // value for 'primaryLoginId'
 *      removeLoginIds: // value for 'removeLoginIds'
 *      dismissMessage: // value for 'dismissMessage'
 *   },
 * });
 */
export function usePrepMemberForEmailHygieneMutation(baseOptions?: Apollo.MutationHookOptions<PrepMemberForEmailHygieneMutation, PrepMemberForEmailHygieneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PrepMemberForEmailHygieneMutation, PrepMemberForEmailHygieneMutationVariables>(PrepMemberForEmailHygieneDocument, options);
      }
export type PrepMemberForEmailHygieneMutationHookResult = ReturnType<typeof usePrepMemberForEmailHygieneMutation>;
export type PrepMemberForEmailHygieneMutationResult = Apollo.MutationResult<PrepMemberForEmailHygieneMutation>;
export type PrepMemberForEmailHygieneMutationOptions = Apollo.BaseMutationOptions<PrepMemberForEmailHygieneMutation, PrepMemberForEmailHygieneMutationVariables>;