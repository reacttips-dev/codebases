import React from 'react'

import { Box, Flex } from '@chakra-ui/layout'
import NextLink from 'next/link'

import { Button, EmptyCard, Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

const TrendingPostsEmptyState = () => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      py={6}
      px={3}
      maxW="md"
      textAlign="center"
      mx="auto"
    >
      <Box mx="auto">
        <EmptyCard width="239px" height="auto" />
      </Box>
      <Text textStyle="semibold/xlarge" color="label.primary" mt={6}>
        <Trans
          i18nKey="explore:trendingPosts.emptyState.title"
          defaults="No trending posts"
        />
      </Text>
      <Text color="label.secondary" textStyle="regular/medium" mt={3}>
        <Trans
          i18nKey="explore:trendingPosts.emptyState.description"
          defaults="This section displays the 10 most popular posts within the past month across your spaces."
        />
      </Text>
      <Box>
        <NextLink href="/spaces" passHref>
          <Button buttonType="primary" as={Link} mt={4}>
            <Trans
              i18nKey="explore:trendingPosts.emptyState.exploreSpacesBtn"
              defaults="Explore spaces"
            />
          </Button>
        </NextLink>
      </Box>
    </Flex>
  )
}

export default TrendingPostsEmptyState
