import { useCallback, useMemo } from 'react'

import { useRouter } from 'next/router'

import { Role, RoleType, SpaceRole } from 'tribe-api/interfaces'

const useDisplayMember = (
  memberId?: string | null,
  role?: SpaceRole | Role | null,
) => {
  const router = useRouter()

  const userLink = useMemo(
    () => ({
      href: '/member/[memberId]',
      as: `/member/${memberId}`,
    }),
    [memberId],
  )

  const showMember = useCallback(() => {
    if (!memberId && (!role || role?.type === RoleType.GUEST)) return null
    router.push(userLink.href, userLink.as)
  }, [memberId, role, router, userLink])

  return {
    showMember,
    userLink,
  }
}

export default useDisplayMember
