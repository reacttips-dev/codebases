import React, { useCallback, useRef, useState } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import ArrowRightLineIcon from 'remixicon-react/ArrowRightLineIcon'

import { hasActionPermission } from 'tribe-api/permissions'
import {
  Button,
  SpaceCard,
  Text,
  Link,
  SpaceCardProps,
  Card,
  CardDivider,
  IconButton,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import useGetExploreSpaces from 'containers/Space/useGetExploreSpaces'

import useAuthMember from 'hooks/useAuthMember'

const staticStyles = {
  spaces: {
    sx: {
      '::-webkit-scrollbar': {
        width: 0,
      },
    },
  },
}

const SCROLL_SIZE = 200

const SpaceCardWrapper = ({ space, join, ...rest }: SpaceCardProps) => {
  const { isGuest } = useAuthMember()
  const { authorized: hasJoinSpacePermission } = hasActionPermission(
    space?.authMemberProps?.permissions || [],
    'joinSpace',
  )
  const showJoinButton = join && (hasJoinSpacePermission || isGuest)

  return (
    <SpaceCard
      space={space}
      ml="0 !important"
      w="200px"
      size="xxs"
      showJoinButton={showJoinButton}
      cursor="pointer"
      {...rest}
    />
  )
}

const RecommendedSpaces = () => {
  const { spaces } = useGetExploreSpaces()
  const spacesContainer = useRef<HTMLDivElement>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [goingLeft, setGoingLeft] = useState(false)

  const nextSlide = useCallback(() => {
    if (!spacesContainer.current) return

    setScrollLeft(scroll => scroll - SCROLL_SIZE)
    setGoingLeft(false)
  }, [setScrollLeft, spacesContainer])

  const prevSlide = useCallback(() => {
    if (!spacesContainer.current) return

    setScrollLeft(scroll => scroll + SCROLL_SIZE)
    setGoingLeft(true)

    if (-scrollLeft === SCROLL_SIZE) {
      setGoingLeft(false)
    }
  }, [setScrollLeft, scrollLeft, spacesContainer])

  if (!spaces?.length) return null

  const scrollWidth = spacesContainer.current
    ? spacesContainer.current?.scrollWidth -
      spacesContainer.current?.offsetWidth
    : 0

  const showArrows = scrollWidth > 0
  const showLeftArrow = scrollLeft < 0
  const showRightArrow = -scrollLeft <= scrollWidth && !goingLeft

  return (
    <Card alignItems="stretch">
      <Box>
        <Text
          data-testid="recommended-title"
          textStyle="medium/large"
          color="label.primary"
        >
          <Trans
            i18nKey="explore:recommended.title"
            defaults="Recommended spaces"
          />
        </Text>
        <Text
          data-testid="recommended-description"
          textStyle="regular/small"
          color="label.secondary"
        >
          <Trans
            i18nKey="explore:recommended.description"
            defaults="Spaces you may be interested in joining"
          />
        </Text>
      </Box>
      <CardDivider />

      <Box>
        <Box position="relative" overflow="hidden">
          {showArrows && showLeftArrow && (
            <IconButton
              icon={<ArrowLeftLineIcon size="20px" />}
              aria-label="Previous Slide"
              borderRadius="full"
              p="10px"
              position="absolute"
              top="0"
              bottom="0"
              right={4}
              margin="auto"
              zIndex="docked"
              border="1px solid"
              borderColor="border.base"
              boxShadow="lightMedium"
              onClick={prevSlide}
            />
          )}
          <HStack
            spacing={4}
            p="5px"
            ref={spacesContainer}
            transition="transform 0.5s"
            transform={`translateX(${scrollLeft}px)`}
            alignItems="flex-start"
            {...staticStyles.spaces}
          >
            {spaces.map(space => (
              <NextLink key={space.id} href={`/${space.slug}/posts`} passHref>
                <Box as={Link}>
                  <SpaceCardWrapper space={space} />
                </Box>
              </NextLink>
            ))}
          </HStack>
          {showArrows && showRightArrow && (
            <IconButton
              icon={<ArrowRightLineIcon size="20px" />}
              aria-label="Next Slide"
              borderRadius="full"
              p="10px"
              position="absolute"
              top="0"
              bottom="0"
              right={4}
              margin="auto"
              zIndex="docked"
              border="1px solid"
              borderColor="border.base"
              boxShadow="lightMedium"
              onClick={nextSlide}
            />
          )}
        </Box>
        <NextLink href="/spaces" passHref>
          <Button
            data-testid="recommended-see-all"
            mt={4}
            w="full"
            border="none"
            as="a"
          >
            <Trans i18nKey="explore:recommended.seeAll" defaults="See all" />
          </Button>
        </NextLink>
      </Box>
    </Card>
  )
}

export default RecommendedSpaces
