// THIS IS A GENERATED FILE
import * as Types from "../graphql/types"

import gql from "graphql-tag"
import * as ApolloReactCommon from "@apollo/react-common"
import * as ApolloReactHooks from "@apollo/react-hooks"

export type CurrentUserQueryVariables = Types.Exact<{ [key: string]: never }>

export type CurrentUserQuery = { __typename?: "Query" } & {
  currentUser?: Types.Maybe<
    { __typename?: "User" } & Pick<
      Types.User,
      | "id"
      | "avatarUrl"
      | "email"
      | "name"
      | "firstName"
      | "lastName"
      | "banned"
      | "createdAt"
      | "experimentationUser"
    >
  >
}

export const CurrentUserDocument = gql`
  query CurrentUser {
    currentUser {
      id
      avatarUrl
      email
      name
      firstName
      lastName
      banned
      createdAt
      experimentationUser
    }
  }
`

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    baseOptions
  )
}
export function useCurrentUserLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >(CurrentUserDocument, baseOptions)
}
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>
export type CurrentUserLazyQueryHookResult = ReturnType<
  typeof useCurrentUserLazyQuery
>
export type CurrentUserQueryResult = ApolloReactCommon.QueryResult<
  CurrentUserQuery,
  CurrentUserQueryVariables
>
