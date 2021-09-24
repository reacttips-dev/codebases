import React from 'react'

import { Center } from '@chakra-ui/layout'
import { useRouter } from 'next/router'

import { EmptyCard, Link } from 'tribe-components'
import { Trans } from 'tribe-translation'

import EmptyFeedSubtitle from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedSubtitle'
import EmptyFeedTitle from 'containers/LatestFeed/EmptyFeed/components/EmptyFeedTitle'
import useGetSpaces from 'containers/Space/useGetSpaces'

const EmptyFeedMakeFirstPost: React.FC = () => {
  const { push } = useRouter()
  const { spaces, loading } = useGetSpaces()

  return (
    <>
      <EmptyFeedTitle>
        {loading ? (
          <Trans i18nKey="home:feed.emptyFeed.makeYourFirstPost">
            3. Make your first post
          </Trans>
        ) : (
          <Trans i18nKey="home:feed.emptyFeed.makeYourFirstPostWithLink">
            3. Make your first{' '}
            <Link
              color="accent.base"
              variant="unstyled"
              onClick={() => push(`/${spaces[0]?.slug}/posts`)}
            >
              post
            </Link>
          </Trans>
        )}
      </EmptyFeedTitle>

      <EmptyFeedSubtitle>
        <Trans
          i18nKey="home:feed.emptyFeed.sparkYourFirstDiscussion"
          defaults="Spark your first discussion "
        />
      </EmptyFeedSubtitle>
      <Center maxW="xs" margin="auto">
        <EmptyCard width="100%" height="auto" />
      </Center>
    </>
  )
}

export default EmptyFeedMakeFirstPost
