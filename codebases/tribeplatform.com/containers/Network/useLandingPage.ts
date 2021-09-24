import { NetworkLandingPage } from 'tribe-api'
import { Features, useTribeFeature } from 'tribe-feature-flag'

import useAuthMember from 'hooks/useAuthMember'

import useGetNetwork from './useGetNetwork'

const useLandingPage = () => {
  const { isGuest } = useAuthMember()
  const { network } = useGetNetwork()

  const { isEnabled: isCustomLandingPagesEnabled } = useTribeFeature(
    Features.CustomLandingPages,
  )
  if (!isCustomLandingPagesEnabled) {
    return { landingPage: NetworkLandingPage.FEED }
  }

  const { landingPageForMember, landingPageForGuest } =
    network?.landingPages || {}

  const landingPage = isGuest ? landingPageForGuest : landingPageForMember

  return { landingPage }
}

export default useLandingPage
