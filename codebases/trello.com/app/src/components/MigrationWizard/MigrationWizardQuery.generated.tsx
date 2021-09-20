import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MigrationWizard"}}
export type MigrationWizardQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MigrationWizardQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed' | 'confirmed' | 'fullName'>
    & { teamify: (
      { __typename: 'Member_Teamify' }
      & Pick<Types.Member_Teamify, 'state' | 'impact' | 'autoMigration' | 'collaborativeTeamlessBoards' | 'soloTeamlessBoards' | 'inCollaborativeOrg' | 'voluntaryDone' | 'idOrgCreated' | 'idOrgSelected'>
    ), paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'billingDates' | 'expirationDates' | 'products' | 'standing'>
    )>, nonPublic?: Types.Maybe<(
      { __typename: 'Member_NonPublic' }
      & Pick<Types.Member_NonPublic, 'fullName'>
    )> }
  )> }
);


export const MigrationWizardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MigrationWizard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"teamify"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"impact"}},{"kind":"Field","name":{"kind":"Name","value":"autoMigration"}},{"kind":"Field","name":{"kind":"Name","value":"collaborativeTeamlessBoards"}},{"kind":"Field","name":{"kind":"Name","value":"soloTeamlessBoards"}},{"kind":"Field","name":{"kind":"Name","value":"inCollaborativeOrg"}},{"kind":"Field","name":{"kind":"Name","value":"voluntaryDone"}},{"kind":"Field","name":{"kind":"Name","value":"idOrgCreated"}},{"kind":"Field","name":{"kind":"Name","value":"idOrgSelected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingDates"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDates"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMigrationWizardQuery__
 *
 * To run a query within a React component, call `useMigrationWizardQuery` and pass it any options that fit your needs.
 * When your component renders, `useMigrationWizardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMigrationWizardQuery({
 *   variables: {
 *   },
 * });
 */
export function useMigrationWizardQuery(baseOptions?: Apollo.QueryHookOptions<MigrationWizardQuery, MigrationWizardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MigrationWizardQuery, MigrationWizardQueryVariables>(MigrationWizardDocument, options);
      }
export function useMigrationWizardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MigrationWizardQuery, MigrationWizardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MigrationWizardQuery, MigrationWizardQueryVariables>(MigrationWizardDocument, options);
        }
export type MigrationWizardQueryHookResult = ReturnType<typeof useMigrationWizardQuery>;
export type MigrationWizardLazyQueryHookResult = ReturnType<typeof useMigrationWizardLazyQuery>;
export type MigrationWizardQueryResult = Apollo.QueryResult<MigrationWizardQuery, MigrationWizardQueryVariables>;