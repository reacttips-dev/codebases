import React from 'react'

import { Box, VStack } from '@chakra-ui/react'

import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useMemberSpaces from 'containers/Member/hooks/useMemberSpaces'
import { SpacesGrid } from 'containers/Space/Spaces/SpacesGrid'
import useGetExploreSpaces from 'containers/Space/useGetExploreSpaces'

import { useResponsive } from 'hooks/useResponsive'

import Truthy from 'utils/truthy'

import ErrorPage from '../../../pages/_error'

type AuthSpacesProps = { memberId: string; collectionId?: string }

export const AuthSpaces = ({ memberId, collectionId }: AuthSpacesProps) => {
  const {
    spaceMembers,
    loading,
    isInitialLoading,
    error,
    isEmpty,
  } = useMemberSpaces({
    memberId,
    collectionId,
    limit: 500,
  })
  const {
    spaces: exploreSpaces,
    isInitialLoading: exploreLoading,
    isEmpty: exploreIsEmpty,
  } = useGetExploreSpaces({ limit: 500, collectionId })

  const { isPhone } = useResponsive()

  if (!loading && error) {
    return <ErrorPage err={error} />
  }

  const spaces = spaceMembers?.map(it => it.space).filter(Truthy)
  if (isPhone) {
    return (
      <Tabs isLazy bg="bg.base">
        <TabList borderBottom="1px" borderColor="border.base">
          {!isEmpty && (
            <Tab>
              <Trans
                i18nKey="common:space.spaces.tabs.personal"
                defaults="Your spaces"
              />
            </Tab>
          )}
          {!exploreIsEmpty && (
            <Tab>
              <Trans
                i18nKey="common:space.spaces.tabs.explore"
                defaults="Explore"
              />
            </Tab>
          )}
        </TabList>
        <TabPanels>
          {!isEmpty && (
            <TabPanel>
              <SpacesGrid spaces={spaces || []} loading={isInitialLoading} />
            </TabPanel>
          )}
          {!exploreIsEmpty && (
            <TabPanel>
              <SpacesGrid spaces={exploreSpaces} loading={exploreLoading} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    )
  }

  return (
    <VStack align="stretch" spacing={6}>
      {!isEmpty && (
        <>
          <Box textStyle="medium/large" as="h3" color="label.secondary">
            <Trans
              i18nKey="common:space.spaces.personal"
              defaults="Your spaces"
            />
          </Box>
          <SpacesGrid spaces={spaces || []} loading={isInitialLoading} />
        </>
      )}

      {!exploreIsEmpty && (
        <>
          <Box textStyle="medium/large" as="h3" color="label.secondary">
            <Trans
              i18nKey="common:space.spaces.explore"
              defaults="Explore other spaces"
            />
          </Box>
          <SpacesGrid spaces={exploreSpaces} loading={exploreLoading} />
        </>
      )}
    </VStack>
  )
}
