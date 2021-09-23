import React, { useMemo } from 'react'

import { useRouter } from 'next/router'

import { PermissionContext } from 'tribe-api'
import { SkeletonProvider } from 'tribe-components'

import { useSpace } from 'hooks/space/useSpace'

import AppsSidebar from './AppsSidebar'
import { FILTERED_APPS_SET } from './TabContent/SettingsContent/DefaultApps'
import useGetSpaceAppInstallations, {
  DEFAULT_APP_INSTALLATIONS_LIMIT,
} from './TabContent/SettingsContent/hooks/useGetSpaceAppInstallations'

function SpaceAppsSidebar() {
  const { query } = useRouter()
  const { space } = useSpace({
    variables: {
      slug: query['space-slug'] ? String(query['space-slug']) : undefined,
    },
  })
  const {
    appInstallations,
    isInitialLoading: aiLoading,
  } = useGetSpaceAppInstallations({
    spaceId: space?.id,
    limit: DEFAULT_APP_INSTALLATIONS_LIMIT,
  })
  const apps = useMemo(
    () =>
      appInstallations.filter(
        ai =>
          ai.app &&
          ai.app.enabledContexts.includes(PermissionContext.SPACE) &&
          !FILTERED_APPS_SET.has(ai.app.slug),
      ),
    [appInstallations],
  )

  return (
    <SkeletonProvider loading={aiLoading}>
      <AppsSidebar appInstallations={apps} space={space} />
    </SkeletonProvider>
  )
}

export default SpaceAppsSidebar
