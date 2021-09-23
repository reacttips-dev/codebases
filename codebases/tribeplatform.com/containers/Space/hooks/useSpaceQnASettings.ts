import { SpaceQuery } from 'tribe-api'

import { DefaultApps } from 'containers/Apps/components/TabContent/SettingsContent/DefaultApps'
import useGetAppSpaceSettings from 'containers/Apps/components/TabContent/SettingsContent/hooks/useGetAppSpaceSettings'
import { useAppBySlug } from 'containers/Apps/hooks/useAppBySlug'
import { PostLayoutVariant } from 'containers/Post/components'

import { logger } from 'lib/logger'

const useSpaceQnASettings = (space?: SpaceQuery['space'] | null) => {
  const { app: qnaApp } = useAppBySlug({
    slug: DefaultApps.QA,
  })
  const spaceAppSetting = useGetAppSpaceSettings({
    appId: qnaApp?.id || '',
    spaceId: space?.id || '',
  })

  let qnaLayout = PostLayoutVariant.LIST
  if (spaceAppSetting?.settings) {
    try {
      qnaLayout = JSON?.parse(spaceAppSetting.settings).layout
    } catch (err) {
      logger.error(err)
    }
  }

  return {
    qnaLayout,
  }
}

export default useSpaceQnASettings
