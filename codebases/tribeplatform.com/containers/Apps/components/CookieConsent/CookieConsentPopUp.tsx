import React, { FC } from 'react'

import { Container, Flex } from '@chakra-ui/react'

import { Button, Card, Text, useResponsive } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { SIDEBAR_WIDTH } from 'components/Layout'

import { enableCookies } from 'lib/cookies'
import { CookieKind } from 'lib/cookies/@types'

type CookieConsentPopUpProps = {
  onManage: () => void
  onClose: () => void
  sidebarVisible?: boolean
}
const CookieConsentPopUp: FC<CookieConsentPopUpProps> = ({
  onManage,
  onClose,
  sidebarVisible = true,
}) => {
  const { isMobile } = useResponsive()
  const onAcceptAll = () => {
    enableCookies([
      CookieKind.ADVERTISING_AND_TRACKING,
      CookieKind.ANALYTICS_AND_FUNCTIONAL,
    ])
    onClose()
  }
  const sidebarOffset = sidebarVisible ? SIDEBAR_WIDTH : 0
  return (
    <Container
      position="fixed"
      bottom={0}
      zIndex={2}
      p={2}
      left={{ base: 0, lg: sidebarOffset }}
      right={0}
      w={{
        base: 'full',
        lg: 'auto',
      }}
      maxW="full"
    >
      <Card>
        <Flex
          wrap={{ base: 'wrap', lg: 'nowrap' }}
          justifyContent="end"
          alignItems="center"
        >
          <Flex
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}
            mr={{ base: 0, lg: 6 }}
            w="full"
            mb={{ base: 6, xl: 0 }}
          >
            {isMobile && (
              <Text color="label.primary" textStyle="semibold/xlarge" mb={6}>
                <Trans
                  i18nKey="apps:Cookie.acceptCookies"
                  defaults="Accept cookies?"
                />
              </Text>
            )}
            <Text color="label.primary" textStyle="regular/regular">
              <Trans
                i18nKey="apps:Cookie.message"
                defaults="This website uses cookies to help personalise and improve content and services. You can review and update your cookie settings at any time."
              />
            </Text>
          </Flex>
          <Flex
            flexWrap={{ base: 'nowrap', lg: 'wrap', xl: 'nowrap' }}
            justifyContent={{ base: 'space-between', xl: 'center' }}
            w={{ base: '100%', xl: 'auto' }}
            maxW={{ base: '100%', xl: '50%' }}
          >
            <Button
              buttonType="secondary"
              onClick={onManage}
              w={{ base: 'calc(50% - 4px)', lg: '100%' }}
              mr={{ base: 0, xl: 2 }}
            >
              <Trans
                i18nKey="apps:Cookie.manage"
                defaults="Manage preferences"
              />
            </Button>
            <Button
              buttonType="primary"
              onClick={onAcceptAll}
              w={{ base: 'calc(50% - 4px)', lg: '100%' }}
              mt={{ base: 0, lg: 2, xl: 0 }}
            >
              {isMobile ? (
                <Trans
                  i18nKey="apps:Cookie.acceptAll"
                  defaults="Accept all cookies"
                />
              ) : (
                <Trans
                  i18nKey="apps:Cookie.fine"
                  defaults="I’m fine with cookies"
                />
              )}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Container>
  )
}

export default CookieConsentPopUp
