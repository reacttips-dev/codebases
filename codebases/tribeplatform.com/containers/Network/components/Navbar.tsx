import React, { ReactElement } from 'react'

import { HStack, Box } from '@chakra-ui/layout'
import { Flex } from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { NavigationItemType, UpdateNavigationItem } from 'tribe-api/interfaces'
import { Link, Logo, SIDEBAR_VISIBLE, Text, Button } from 'tribe-components'

import {
  EmailVerificationBanner,
  EMAIL_VERIFICATION_BANNER_HEIGHT,
} from 'components/common/EmailVerificationBanner'
import {
  MembershipLimitBanner,
  MEMBERSHIP_LIMIT_BANNER_HEIGHT,
} from 'components/common/MembershipLimitBanner'

import useAuthMember from 'hooks/useAuthMember'
import useAuthToken from 'hooks/useAuthToken'
import useMemberCapacity from 'hooks/useMemberCapacity'

import { isAdminEmailNotConfirmed, isUrlPointsWithinApp } from 'utils/auth'

import useNavbar from '../hooks/useNavbar'
import useGetNetwork from '../useGetNetwork'

const NAVBAR_HEIGHT_NUMERIC = 64
export const NAVBAR_HEIGHT = `${NAVBAR_HEIGHT_NUMERIC}px`

export const useNavbarHeight = () => {
  const { hasNavbar } = useNavbar()
  const { authUser, isNetworkAdmin, isNetworkModerator } = useAuthMember()
  const { isLoading, didReachLimit, isApproachingLimit } = useMemberCapacity({
    skip:
      typeof window === 'undefined' || !(isNetworkAdmin || isNetworkModerator),
  })
  const router = useRouter()

  let navbarHeight = hasNavbar ? NAVBAR_HEIGHT_NUMERIC : 0

  if (isAdminEmailNotConfirmed(authUser)) {
    navbarHeight += EMAIL_VERIFICATION_BANNER_HEIGHT
  }

  if (
    !isLoading &&
    (didReachLimit || isApproachingLimit) &&
    router?.pathname?.includes('admin')
  ) {
    navbarHeight += MEMBERSHIP_LIMIT_BANNER_HEIGHT
  }

  return `${navbarHeight}px`
}

interface NavbarProps {
  // Sent on the theme page.
  isPreview?: boolean
  previewItems?: Array<UpdateNavigationItem>
}

const withNextLink = (
  Component: ReactElement,
  menuItem: UpdateNavigationItem,
  isErrorPage: boolean,
) => {
  if (
    typeof menuItem?.link === 'string' &&
    menuItem.link.length > 0 &&
    menuItem?.link?.indexOf('http') === -1 &&
    !isErrorPage
  ) {
    return (
      <NextLink href={menuItem.link} key={`${menuItem?.text}-${nanoid(5)}`}>
        {Component}
      </NextLink>
    )
  }

  return Component
}

const Navbar = ({ isPreview = false, previewItems }: NavbarProps) => {
  const { hasNavbar, loading } = useNavbar()
  const { authToken } = useAuthToken()
  const { network } = useGetNetwork()
  const networkPublicInfo = authToken?.networkPublicInfo
  const { isNetworkAdmin, isNetworkModerator } = useAuthMember()

  const router = useRouter()

  const isNavbarDisabled = !isPreview && !hasNavbar && !loading

  const menuItems = previewItems || network?.topNavigation?.items || []

  const isErrorPage =
    router.pathname === '/404' || router.pathname === '/_error'

  const logoElement = isErrorPage ? (
    <Logo
      as={Link}
      src={networkPublicInfo?.logo}
      size="small"
      name={networkPublicInfo?.name || ''}
      pl={1}
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }}
    />
  ) : (
    <NextLink href="/">
      <Logo
        as={Link}
        src={networkPublicInfo?.logo}
        size="small"
        name={networkPublicInfo?.name || ''}
        pl={1}
      />
    </NextLink>
  )

  const shouldShowAppNavbars =
    !isPreview &&
    (isNetworkModerator || isNetworkAdmin) &&
    typeof window !== 'undefined' &&
    isUrlPointsWithinApp(window.location.pathname)

  return (
    <Flex
      display={{ base: 'none', [SIDEBAR_VISIBLE]: 'flex' }}
      position="sticky"
      // On the preview zindex should be confined.
      zIndex={isPreview ? 'auto' : 'banner'}
      top={0}
      direction="column"
    >
      {shouldShowAppNavbars && (
        <>
          <MembershipLimitBanner />
          <EmailVerificationBanner />
        </>
      )}
      {!isNavbarDisabled && (
        <HStack
          px={4}
          overflow="hidden"
          pr={2}
          spacing={8}
          height={NAVBAR_HEIGHT}
          alignItems="center"
          bg="bg.base"
          borderBottom="1px solid"
          borderColor="border.base"
        >
          <Box flexShrink={0}>{logoElement}</Box>

          {menuItems &&
            menuItems.map((menuItem: UpdateNavigationItem) => {
              return withNextLink(
                <Link
                  href={menuItem?.link?.toString()}
                  key={`${menuItem?.text}-${nanoid(5)}`}
                  target={menuItem?.openInNewWindow ? '_blank' : ''}
                >
                  {menuItem?.type === NavigationItemType.TEXT_LINK && (
                    <Text
                      maxWidth="400px"
                      isTruncated
                      textStyle="semibold/xsmall"
                      cursor="pointer"
                    >
                      {menuItem.text}
                    </Text>
                  )}
                  {menuItem?.type === NavigationItemType.PRIMARY_LINK && (
                    <Text
                      color="accent.base"
                      maxWidth="400px"
                      isTruncated
                      textStyle="semibold/xsmall"
                      cursor="pointer"
                    >
                      {menuItem.text}
                    </Text>
                  )}

                  {menuItem?.type === NavigationItemType.PRIMARY_BUTTON && (
                    <Button size="xs" buttonType="primary" cursor="pointer">
                      {menuItem.text}
                    </Button>
                  )}
                  {menuItem?.type === NavigationItemType.SECONDARY_BUTTON && (
                    <Button size="xs" cursor="pointer">
                      {menuItem.text}
                    </Button>
                  )}
                </Link>,
                menuItem,
                isErrorPage,
              )
            })}
        </HStack>
      )}
    </Flex>
  )
}

export default Navbar
