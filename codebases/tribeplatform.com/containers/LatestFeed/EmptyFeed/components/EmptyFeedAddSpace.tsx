import React from 'react'

import { useRouter } from 'next/router'

import { Link } from 'tribe-components'
import { Trans } from 'tribe-translation'

import EmptyFeedSpaces from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedSpaces'
import EmptyFeedSubtitle from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedSubtitle'
import EmptyFeedTitle from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedTitle'

const EmptyFeedAddSpace: React.FC = () => {
  const { push } = useRouter()

  return (
    <>
      <EmptyFeedTitle>
        <Trans i18nKey="home:feed.emptyFeed.addASpaceToYourCollection">
          2. Add a{' '}
          <Link
            color="accent.base"
            variant="unstyled"
            onClick={() => push(`/space/create`)}
          >
            space
          </Link>{' '}
          to your collection
        </Trans>
      </EmptyFeedTitle>

      <EmptyFeedSubtitle>
        <Trans
          i18nKey="home:feed.emptyFeed.theseLiveWithinYourCollections"
          defaults="These live within your collections as spaces for your members"
        />
      </EmptyFeedSubtitle>

      <EmptyFeedSpaces />
    </>
  )
}

export default EmptyFeedAddSpace
