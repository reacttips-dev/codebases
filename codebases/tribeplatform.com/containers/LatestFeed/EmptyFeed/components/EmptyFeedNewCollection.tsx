import React from 'react'

import { Card, Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import EmptyFeedSpaces from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedSpaces'
import EmptyFeedSubtitle from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedSubtitle'
import EmptyFeedTitle from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedTitle'
import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'
import { EditSpaceCollectionModal } from 'containers/SpaceCollection/components'

const EmptyFeedNewCollection: React.FC = () => {
  const { close, open, isOpen } = useSpaceModal('new-collection')

  return (
    <>
      <EmptyFeedTitle>
        <Trans i18nKey="home:feed.emptyFeed.startANewCollection">
          1. Start a new{' '}
          <Link color="accent.base" variant="unstyled" onClick={open}>
            collection
          </Link>
        </Trans>
      </EmptyFeedTitle>

      <EmptyFeedSubtitle>
        <Trans
          i18nKey="home:feed.emptyFeed.collectionsAreMainCategories"
          defaults="Collections are main categories to help structure your Tribe."
        />
      </EmptyFeedSubtitle>

      <Card variant="shadow" pt={6} px={6} mb={14}>
        <Text textStyle="semibold/large" mb={6} color="label.secondary">
          <Trans
            i18nKey="home:feed.emptyFeed.yourCollectionOfSpaces"
            defaults="Your collection of spaces"
          />
        </Text>

        <EmptyFeedSpaces mb={0} size="md" />
      </Card>

      {isOpen && <EditSpaceCollectionModal onClose={close} isOpen={isOpen} />}
    </>
  )
}

export default EmptyFeedNewCollection
