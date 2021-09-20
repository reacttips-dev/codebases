import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"EmailHygieneWizard"}}
export type EmailHygieneWizardQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type EmailHygieneWizardQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'avatarUrl' | 'email' | 'fullName' | 'id' | 'initials' | 'oneTimeMessagesDismissed' | 'username'>
    & { logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'id' | 'primary' | 'claimable' | 'email'>
    )>, prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & { twoFactor?: Types.Maybe<(
        { __typename: 'Member_Prefs_TwoFactor' }
        & Pick<Types.Member_Prefs_TwoFactor, 'enabled'>
      )> }
    )> }
  )> }
);


export const EmailHygieneWizardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EmailHygieneWizard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"claimable"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useEmailHygieneWizardQuery__
 *
 * To run a query within a React component, call `useEmailHygieneWizardQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmailHygieneWizardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmailHygieneWizardQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useEmailHygieneWizardQuery(baseOptions: Apollo.QueryHookOptions<EmailHygieneWizardQuery, EmailHygieneWizardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EmailHygieneWizardQuery, EmailHygieneWizardQueryVariables>(EmailHygieneWizardDocument, options);
      }
export function useEmailHygieneWizardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EmailHygieneWizardQuery, EmailHygieneWizardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EmailHygieneWizardQuery, EmailHygieneWizardQueryVariables>(EmailHygieneWizardDocument, options);
        }
export type EmailHygieneWizardQueryHookResult = ReturnType<typeof useEmailHygieneWizardQuery>;
export type EmailHygieneWizardLazyQueryHookResult = ReturnType<typeof useEmailHygieneWizardLazyQuery>;
export type EmailHygieneWizardQueryResult = Apollo.QueryResult<EmailHygieneWizardQuery, EmailHygieneWizardQueryVariables>;