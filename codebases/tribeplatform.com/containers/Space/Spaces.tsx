import React, { useEffect } from 'react'

import { Box, HStack } from '@chakra-ui/react'

import { Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { FeedLayout, FeedLayoutMain, LayoutHeader } from 'components/Layout'

import { useSearch } from 'containers/Search/hooks/useSearchModal'
import { JoinNetworkButton, NewSpaceButton } from 'containers/Space/components'
import { AllSpaces } from 'containers/Space/Spaces/AllSpaces'

import useAuthMember from 'hooks/useAuthMember'
import { useResponsive } from 'hooks/useResponsive'

import { AuthSpaces } from './Spaces/AuthSpaces'

const staticProps = {
  feedLayout: {
    templateColumns: {
      base: '0 auto 0',
      sm: '1fr auto 1fr',
    },
  },
}

const ActionButtons = () => {
  const { authUser } = useAuthMember()
  const { isMobile } = useResponsive()

  if (authUser) {
    return <NewSpaceButton />
  }

  if (!isMobile) {
    return <JoinNetworkButton />
  }

  return null
}

const Spaces = () => {
  const { isMobile, mobileHeader, isSidebarOpen } = useResponsive()
  const { isSearchModalOpen } = useSearch()
  const { authUser } = useAuthMember()

  useEffect(() => {
    if (isSidebarOpen || isSearchModalOpen) return

    mobileHeader.setRight(<ActionButtons />)
  }, [mobileHeader, isSidebarOpen, isSearchModalOpen])
  return (
    <FeedLayout {...staticProps.feedLayout}>
      <FeedLayoutMain size="xl">
        <Box>
          {/* Page header */}
          <div>
            {!isMobile && (
              <LayoutHeader pb={0} pl={0}>
                <HStack w="full" justify="space-between">
                  <Text textStyle="bold/2xlarge" data-testid="page-title">
                    <Trans
                      i18nKey="common:space.spaces.title"
                      defaults="Spaces"
                    />
                  </Text>
                  <ActionButtons />
                </HStack>
              </LayoutHeader>
            )}
          </div>
          {authUser ? <AuthSpaces memberId={authUser?.id} /> : <AllSpaces />}
        </Box>
      </FeedLayoutMain>
    </FeedLayout>
  )
}

export default Spaces
