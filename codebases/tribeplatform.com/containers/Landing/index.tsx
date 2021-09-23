import React, { useEffect } from 'react'

import { useRouter } from 'next/router'

import { NetworkLandingPage } from 'tribe-api'

import Explore from 'containers/Explore/Explore'
import LatestFeed from 'containers/LatestFeed'
import useLandingPage from 'containers/Network/useLandingPage'
import Spaces from 'containers/Space/Spaces'

const LandingContainer = () => {
  const { landingPage } = useLandingPage()
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      // Prefetch the space page
      router.prefetch('/[space-slug]/[section]')
    }, 3000)
  }, [])

  switch (landingPage) {
    case NetworkLandingPage.EXPLORE:
      return <Explore />
    case NetworkLandingPage.SPACES:
      return <Spaces />
    case NetworkLandingPage.FEED:
    default:
      return <LatestFeed />
  }
}

export default LandingContainer
