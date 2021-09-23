import React, { useEffect } from 'react'

import { Box, VStack } from '@chakra-ui/react'

import { Trans, withTranslation } from 'tribe-translation'

import { CenterLayout } from 'components/Layout'

import useGetNetwork from 'containers/Network/useGetNetwork'
import { useSearch } from 'containers/Search/hooks/useSearchModal'

import { useResponsive } from 'hooks/useResponsive'

import RecommendedSpaces from './RecommendedSpaces'
import SearchBox from './SearchBox'
import TrendingPosts from './TrendingPosts'
import WelcomeBox from './WelcomeBox'

const WithNavbarCommunities = [
  'community.tribe.so',
  'community.tribeplatform.com',
  'localhost',
]

const Explore = ({ isPreview }: { isPreview?: boolean }) => {
  const { isSidebarOpen, mobileHeader } = useResponsive()
  const { isSearchModalOpen } = useSearch()
  const { network } = useGetNetwork()
  const hasExplore = WithNavbarCommunities.indexOf(network?.domain) > -1

  useEffect(() => {
    if (isSidebarOpen || isSearchModalOpen) return

    mobileHeader.setRight(null)
  }, [isSearchModalOpen, isSidebarOpen, mobileHeader])

  return (
    <CenterLayout
      maxW={['100vw', '100%']}
      px={[0, 12]}
      boxSizing={isPreview ? 'border-box' : 'content-box'}
    >
      <Box
        mt="0"
        ml={[5, 0]}
        textStyle="bold/xlarge"
        as="h2"
        color="label.primary"
        data-testid="explore-page-title"
      >
        <Trans i18nKey="explore:title" defaults="Explore" />
      </Box>
      {/* <PinnedPosts /> */}
      <VStack spacing={6} mt={6}>
        {hasExplore && <WelcomeBox />}
        <SearchBox />
        <RecommendedSpaces />
        <TrendingPosts />
      </VStack>
    </CenterLayout>
  )
}

export default withTranslation('explore')(Explore)
