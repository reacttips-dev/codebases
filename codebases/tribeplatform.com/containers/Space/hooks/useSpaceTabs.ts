import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'

import { ActionPermissions, SpaceSeoQuery } from 'tribe-api'
import { hasActionPermission } from 'tribe-api/permissions'
import { Features, useTribeFeature } from 'tribe-feature-flag'

export type SpaceTab = 'posts' | 'questions' | 'about' | 'members'

export type UseSpaceTabsResult = {
  availableTabs: SpaceTab[]
  activeTabIndex: number
  handleTabsChange: (index: number) => void
}

export const useSpaceTabs = ({
  space,
  preview = false,
}: {
  space: SpaceSeoQuery['space']
  preview?: boolean
}): UseSpaceTabsResult => {
  const { query } = useRouter()
  const { section } = query
  const router = useRouter()
  const { isEnabled: isQAEnabled } = useTribeFeature(Features.QuestionAndAnswer)
  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]
  const { authorized: canViewMembers } = hasActionPermission(
    permissions || [],
    'getSpaceMembers',
  )

  const availableTabs = useMemo(() => {
    const result: SpaceTab[] = []
    if (!space) {
      return result
    }

    if (
      space?.spaceType?.availablePostTypes?.find(it => it.name === 'Discussion')
    ) {
      result.push('posts')
    }
    if (
      isQAEnabled &&
      space?.spaceType?.availablePostTypes?.find(it => it.name === 'Question')
    ) {
      result.push('questions')
    }
    result.push('about')
    if (preview || canViewMembers) {
      result.push('members')
    }
    return result
  }, [space, canViewMembers, isQAEnabled, preview])

  const findIndex = useCallback(
    (section: string) => {
      const index = availableTabs.findIndex(it => it === section)
      if (index !== -1) {
        return index
      }
      return 0
    },
    [availableTabs],
  )

  const [activeTabIndex, setActiveTabIndex] = useState(() =>
    findIndex(String(section)),
  )

  useEffect(() => {
    if (section && activeTabIndex === 0) {
      // Section is always discussion.
      setActiveTabIndex(findIndex(String(section)))
    }
  }, [section, findIndex])

  const handleTabsChange = useCallback(
    index => {
      setActiveTabIndex(index)
      if (!preview) {
        router.push(
          {
            pathname: `/${space?.slug}/${availableTabs[index]}`,
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [space, availableTabs, setActiveTabIndex, preview, router],
  )

  return {
    activeTabIndex,
    handleTabsChange,
    availableTabs,
  }
}
