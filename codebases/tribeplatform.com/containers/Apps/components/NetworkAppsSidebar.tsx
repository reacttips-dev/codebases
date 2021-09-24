import React, { useMemo } from 'react'

import { SkeletonProvider } from 'tribe-components'

import useGetNetworkAppInstallations from '../hooks/useGetNetworkAppInstallations'
import AppsSidebar from './AppsSidebar'
import { FILTERED_APPS_SET } from './TabContent/SettingsContent/DefaultApps'

function NetworkAppsSidebar() {
  const {
    appInstallations,
    isInitialLoading: loading,
  } = useGetNetworkAppInstallations()
  const installedApps = useMemo(
    () =>
      appInstallations.filter(
        ai => ai.app && !FILTERED_APPS_SET.has(ai.app.slug),
      ),
    [appInstallations],
  )
  return (
    <SkeletonProvider loading={loading}>
      <AppsSidebar appInstallations={installedApps} />
    </SkeletonProvider>
  )
}

export default NetworkAppsSidebar
