import React, { useCallback } from 'react'

import { Container, Grid, Box } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { Link, Logo, SIDEBAR_VISIBLE } from 'tribe-components'

import useAuthToken from 'hooks/useAuthToken'
import { useResponsive } from 'hooks/useResponsive'

const styles = {
  left: {
    pl: [5, 6],
  },
}

export const MOBILE_HEADER_HEIGHT = '64px'

export default function MobileHeader() {
  const { mobileHeaderParts: mobileHeader, isSidebarOpen } = useResponsive()
  const router = useRouter()
  const { authToken } = useAuthToken()

  const networkPublicInfo = authToken?.networkPublicInfo
  const isErrorPage =
    router.pathname === '/404' || router.pathname === '/_error'

  const logoElement = useCallback(
    () =>
      isErrorPage ? (
        <Logo
          as={Link}
          src={networkPublicInfo?.logo}
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
            name={networkPublicInfo?.name || ''}
            pl={1}
          />
        </NextLink>
      ),
    [isErrorPage, networkPublicInfo?.logo, networkPublicInfo?.name],
  )

  return (
    <Container
      display={{ base: 'block', [SIDEBAR_VISIBLE]: 'none' }}
      h={MOBILE_HEADER_HEIGHT}
      w="100vw"
    >
      <Grid
        position="fixed"
        w="inherit"
        h="inherit"
        left={0}
        top={0}
        bg="bg.base"
        zIndex={isSidebarOpen ? 'popover' : 'banner'}
        borderBottom="1px solid"
        borderBottomColor="border.lite"
        templateColumns={
          !mobileHeader?.left && !mobileHeader?.right ? '1fr' : '2fr 3.5fr 2fr'
        }
        alignItems="center"
        justifyItems="center"
        data-testid="mobile-header"
        {...mobileHeader?.props}
      >
        {mobileHeader?.left && (
          <Box pl={styles.left.pl} justifySelf="start">
            {mobileHeader.left}
          </Box>
        )}

        <Box
          isTruncated
          maxW={40}
          fontSize="lg"
          fontWeight="semibold"
          overflowY="visible"
        >
          {logoElement()}
        </Box>

        {mobileHeader?.right && (
          <Box pr={styles.left.pl} justifySelf="end">
            {mobileHeader.right}
          </Box>
        )}
      </Grid>
    </Container>
  )
}
