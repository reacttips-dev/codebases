import { useCurrentUserQuery } from "@modules/auth/queries.generated"

export default function useCurrentUser(fetchPolicy = "cache-only") {
  const { data, ...rest } = useCurrentUserQuery({
    fetchPolicy,
  })

  return {
    currentUser: data && data.currentUser,
    ...rest,
  }
}
