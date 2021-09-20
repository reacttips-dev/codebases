import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"Moonshot"}}
export type MoonshotQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MoonshotQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'email' | 'fullName' | 'confirmed' | 'oneTimeMessagesDismissed' | 'idEnterprise'>
    & { nonPublic?: Types.Maybe<(
      { __typename: 'Member_NonPublic' }
      & Pick<Types.Member_NonPublic, 'fullName'>
    )>, logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'id' | 'primary'>
    )>, campaigns: Array<(
      { __typename: 'Campaign' }
      & Pick<Types.Campaign, 'id' | 'name' | 'currentStep' | 'dateDismissed'>
    )>, prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & Pick<Types.Member_Prefs, 'locale'>
    )>, enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'isRealEnterprise'>
    )>, organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'name'>
      & { memberships: Array<(
        { __typename: 'Organization_Membership' }
        & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
      )> }
    )> }
  )> }
);


export const MoonshotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Moonshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"campaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"dateDismissed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isRealEnterprise"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMoonshotQuery__
 *
 * To run a query within a React component, call `useMoonshotQuery` and pass it any options that fit your needs.
 * When your component renders, `useMoonshotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMoonshotQuery({
 *   variables: {
 *   },
 * });
 */
export function useMoonshotQuery(baseOptions?: Apollo.QueryHookOptions<MoonshotQuery, MoonshotQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MoonshotQuery, MoonshotQueryVariables>(MoonshotDocument, options);
      }
export function useMoonshotLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MoonshotQuery, MoonshotQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MoonshotQuery, MoonshotQueryVariables>(MoonshotDocument, options);
        }
export type MoonshotQueryHookResult = ReturnType<typeof useMoonshotQuery>;
export type MoonshotLazyQueryHookResult = ReturnType<typeof useMoonshotLazyQuery>;
export type MoonshotQueryResult = Apollo.QueryResult<MoonshotQuery, MoonshotQueryVariables>;