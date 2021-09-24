import React, { memo, ReactNode, useCallback, useEffect } from 'react'

import { Box, BoxProps, Flex, Grid, HStack, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import MenuLineIcon from 'remixicon-react/MenuLineIcon'

import { hasActionPermission } from 'tribe-api/permissions'
import {
  Button,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  Link,
  SIDEBAR_VISIBLE,
  Text,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { ErrorBoundary } from 'components/common'

import { useNavbarHeight } from 'containers/Network/components/Navbar'
import useGetNetwork from 'containers/Network/useGetNetwork'
import { useSearch } from 'containers/Search/hooks/useSearchModal'
import { MODAL_ID as COMPOSER_MODAL_ID } from 'containers/Space/Composer'
import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'

import useAuthMember from 'hooks/useAuthMember'
import useDevMode from 'hooks/useDevMode'
import { useResponsive } from 'hooks/useResponsive'

import PoweredByTribe from 'icons/svg/PoweredByTribe'

import DrawerFooter from './DrawerFooter'
import { MOBILE_HEADER_HEIGHT } from './MobileHeader'

export const SIDEBAR_WIDTH = '17rem'

const sidebarLayout = {
  columns: {
    base: '1fr',
    [SIDEBAR_VISIBLE]: `${SIDEBAR_WIDTH} auto`,
  },
  areas: {
    base: `
    'content'
    `,
    [SIDEBAR_VISIBLE]: `
    'sidebar content'
    `,
  },
}

export const SidebarLayout: React.FC = ({ children }) => {
  const navbarHeight = useNavbarHeight()

  return (
    <Grid
      templateColumns={sidebarLayout.columns}
      templateAreas={sidebarLayout.areas}
      minH={{
        base: `calc(100vh - ${MOBILE_HEADER_HEIGHT})`,
        [SIDEBAR_VISIBLE]: `calc(100vh - ${navbarHeight})`,
      }}
    >
      {children}
    </Grid>
  )
}

const sidebar = {
  display: { base: 'none', [SIDEBAR_VISIBLE]: 'block' },
  drawerBodyPadding: { base: 0, [SIDEBAR_VISIBLE]: 4 },
  togglerDisplay: { base: 'block', [SIDEBAR_VISIBLE]: 'none' },
}

export const SidebarOpenButton = () => {
  const { t } = useTranslation()
  const { toggleSidebar } = useResponsive()

  return (
    <IconButton
      icon={<MenuLineIcon size="15px" />}
      onClick={toggleSidebar}
      aria-label={t('common:sidebar.toggle.text', 'Toggle sidebar')}
      buttonType="secondary"
      bgColor="bg.secondary"
      borderRadius="base"
      px={2}
    />
  )
}

interface SidebarProps {
  sidebarCloserType?: 'arrow'
  isPreview?: boolean
  footer?: ReactNode
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  sidebarCloserType,
  isPreview,
  footer = null,
}) => {
  const router = useRouter()
  const {
    isMobile,
    mobileHeader,
    toggleSidebar,
    isSidebarOpen,
  } = useResponsive()
  const navbarHeight = useNavbarHeight()

  const { isSearchModalOpen } = useSearch()
  const { onDevPlaceholderClick, enabled } = useDevMode()
  const { isOpen: isComposerOpen } = useSpaceModal(COMPOSER_MODAL_ID)

  // Close sidebar when route changes
  useEffect(() => {
    const closeSidebarOnRouteChange = () => {
      if (isSidebarOpen) {
        toggleSidebar?.()
      }
    }

    router.events.on('routeChangeComplete', closeSidebarOnRouteChange)

    return () => {
      router.events.off('routeChangeComplete', closeSidebarOnRouteChange)
    }
  }, [isSidebarOpen, router.events, toggleSidebar])

  const sidebarOpenButton = <SidebarOpenButton />

  const sidebarCloseButton =
    sidebarCloserType === 'arrow' ? (
      <IconButton
        icon={<ArrowLeftLineIcon size="20" />}
        aria-label="Back"
        buttonType="secondary"
        backgroundColor="bg.secondary"
        borderRadius="base"
        p={0}
        onClick={toggleSidebar}
      />
    ) : (
      <CloseButton
        size={isMobile ? 'sm' : 'lg'}
        w={10}
        h={10}
        onClick={toggleSidebar}
        background="bg.secondary"
        borderRadius="base"
      />
    )

  const sidebarFooter = footer || <DrawerFooter />

  useEffect(() => {
    if (isSearchModalOpen || isComposerOpen) return

    if (isSidebarOpen) {
      mobileHeader.setLeft(sidebarCloseButton)
    } else {
      mobileHeader.setLeft(sidebarOpenButton)
    }

    // sidebarOpenButton causes rerender each time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mobileHeader,
    isSidebarOpen,
    isComposerOpen,
    router.pathname,
    isSearchModalOpen,
  ])

  if (isSidebarOpen) {
    return (
      <Drawer
        size="full"
        placement="left"
        isOpen={isSidebarOpen}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClose={toggleSidebar || (() => {})}
      >
        <DrawerOverlay zIndex="overlay">
          <DrawerContent>
            {!isMobile && (
              <Box position="absolute" top="4" right="2">
                {sidebarCloseButton}
              </Box>
            )}
            <DrawerBody
              display="flex"
              flexDir="column"
              justifyContent="space-between"
              p={sidebar.drawerBodyPadding}
              height="100vh"
            >
              <Box h="full">{children}</Box>
              {sidebarFooter}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    )
  }

  return (
    <>
      <Box
        gridArea="sidebar"
        as="aside"
        maxW="md"
        borderRight="1px solid"
        borderColor="border.base"
        display={sidebar.display}
        w={SIDEBAR_WIDTH}
        pos={isPreview ? 'inherit' : 'fixed'}
        bottom={0}
        left={0}
        top={navbarHeight}
        bg="bg.base"
        pointerEvents={isPreview ? 'none' : 'auto'}
        zIndex={isPreview ? 'base' : 'second'}
      >
        <Flex
          flexDir="column"
          justifyContent="space-between"
          height="100%"
          width="100%"
        >
          {children}
          {sidebarFooter}
        </Flex>
        {!enabled && !isMobile && (
          <Box
            p="75px"
            m="-25px"
            zIndex="99999"
            position="fixed"
            right={0}
            bottom={0}
            onClick={onDevPlaceholderClick}
          />
        )}
      </Box>
    </>
  )
}

export const Content: React.FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box gridArea="content" bg="bg.secondary" {...rest}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Box>
  )
}

export const SidebarHeader: React.FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <HStack
      pb={{ base: 3, [SIDEBAR_VISIBLE]: 6 }}
      justifyContent="space-between"
      shouldWrapChildren
      {...rest}
    >
      {children}
    </HStack>
  )
}

const sidebarFooter = {
  t: { base: 3, [SIDEBAR_VISIBLE]: 4 },
  l: { base: 5, [SIDEBAR_VISIBLE]: 4 },
  r: { base: 5, [SIDEBAR_VISIBLE]: 4 },
  b: 3,
}

const sidebarFooterButtons = {
  t: 6,
  l: { base: 5, [SIDEBAR_VISIBLE]: 4 },
  r: { base: 5, [SIDEBAR_VISIBLE]: 4 },
  b: 6,
}
export interface SidebarFooterProps {
  forceShowBranding?: boolean
}
export const SidebarFooter: React.FC<SidebarFooterProps> = memo(
  ({ forceShowBranding }) => {
    const currentYear = new Date().getFullYear()
    const { isGuest, loading } = useAuthMember()
    const { network } = useGetNetwork()
    const { authorized: canLogin } = hasActionPermission(
      network?.authMemberProps?.permissions || [],
      'loginNetwork',
    )
    const { authorized: canJoin } = hasActionPermission(
      network?.authMemberProps?.permissions || [],
      'joinNetwork',
    )

    const shouldDisplayBranding =
      typeof forceShowBranding !== 'undefined'
        ? forceShowBranding
        : network?.tribeBranding

    const loginButtons = useCallback(
      () =>
        isGuest &&
        !loading && (
          <VStack
            alignSelf="flex-end"
            borderTop="1px solid"
            borderColor="border.base"
            pt={sidebarFooterButtons.t}
            pb={sidebarFooterButtons.b}
            pl={sidebarFooterButtons.l}
            pr={sidebarFooterButtons.r}
            mr="auto"
            spacing={3}
            width="full"
          >
            {canLogin && (
              <Button
                buttonType="primary"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login'
                  }
                }}
                isFullWidth
                data-testid="network-login-di"
              >
                <Trans i18nKey="common:login" defaults="Log in" />
              </Button>
            )}
            {canJoin && (
              <Button
                buttonType="secondary"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/auth/signup'
                  }
                }}
                isFullWidth
                data-testid="network-signup-di"
              >
                <Trans
                  i18nKey="common:join.community"
                  defaults="Join community"
                />
              </Button>
            )}
          </VStack>
        ),
      [canJoin, canLogin, isGuest, loading],
    )

    const borderTopProps = {
      borderTop: '1px solid',
      borderColor: 'border.base',
    }

    return (
      <VStack
        {...((!isGuest || loading) && borderTopProps)}
        bgColor="bg.base"
        bottom="0"
        spacing={0}
        zIndex="docked"
      >
        {loginButtons()}

        <VStack
          {...(isGuest && !loading && borderTopProps)}
          pt={sidebarFooter.t}
          pb={sidebarFooter.b}
          pl={sidebarFooter.l}
          pr={sidebarFooter.r}
          data-testid="sidebar-footer"
          align="flex-start"
          width="full"
        >
          {(network?.termsOfServiceUrl || network?.privacyPolicyUrl) && (
            <HStack>
              {network?.termsOfServiceUrl && (
                <Link
                  fontWeight="regular"
                  isExternal
                  fontSize="xs"
                  href={network?.termsOfServiceUrl}
                  color="label.primary"
                >
                  <Trans
                    i18nKey="common:sidebar.footer.terms"
                    defaults="Terms of Service"
                  />
                </Link>
              )}

              {network?.privacyPolicyUrl && (
                <Link
                  fontSize="xs"
                  fontWeight="regular"
                  isExternal
                  href={network?.privacyPolicyUrl}
                  color="label.primary"
                >
                  <Trans
                    i18nKey="common:sidebar.footer.policy"
                    defaults="Privacy Policy"
                  />
                </Link>
              )}
            </HStack>
          )}
          <Text fontSize="xs">
            <Trans
              i18nKey="common:sidebar.footer.copyright"
              defaults="© Copyright {{ currentYear }}, {{ communityName }}"
              values={{ currentYear, communityName: network?.name }}
            />
          </Text>

          {shouldDisplayBranding && (
            <Link
              aria-label="Copyright"
              isExternal
              href={`https://tribe.so/?utm_campaign=powered-by&utm_medium=referral&utm_source=${network?.domain}&utm_term=${network?.name}`}
              target="_blank"
            >
              <PoweredByTribe />
            </Link>
          )}
        </VStack>
      </VStack>
    )
  },
)
