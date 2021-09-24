import React, { FC, useEffect, useState } from 'react'

import { Flex, VStack } from '@chakra-ui/react'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  useResponsive,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import {
  disableCookie,
  disableCookies,
  enableCookie,
  getCookieSettings,
} from 'lib/cookies'
import { CookieKind } from 'lib/cookies/@types'

import CookiesBox from './CookiesBox'

type CookieConsentPreferencesModalProps = {
  isOpen: boolean
  onClose: () => void
}

const mobileModalStyles = {
  position: 'fixed',
  bottom: 0,
  minW: '100vw',
  maxW: '100vw',
  minH: 0,
}

const CookieConsentPreferencesModal: FC<CookieConsentPreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isMobile } = useResponsive()
  const { t } = useTranslation()
  const {
    [CookieKind.ESSENTIAL]: essentialCookies,
    [CookieKind.ADVERTISING_AND_TRACKING]: adsAndTrackCookies,
    [CookieKind.ANALYTICS_AND_FUNCTIONAL]: analyticsAndFuncCookies,
  } = getCookieSettings() || {}
  const [isAnalyticsSelected, setIsAnalyticsSelected] = useState(
    analyticsAndFuncCookies?.enabled,
  )
  const [isAdvertisingSelected, setIsAdvertisingSelected] = useState(
    adsAndTrackCookies?.enabled,
  )

  useEffect(() => {
    setIsAnalyticsSelected(analyticsAndFuncCookies?.enabled)
    setIsAdvertisingSelected(adsAndTrackCookies?.enabled)
  }, [adsAndTrackCookies?.enabled, analyticsAndFuncCookies?.enabled])

  const onRequiredOnly = () => {
    disableCookies([
      CookieKind.ADVERTISING_AND_TRACKING,
      CookieKind.ANALYTICS_AND_FUNCTIONAL,
    ])
    onClose()
  }
  const onSubmit = () => {
    if (isAnalyticsSelected) enableCookie(CookieKind.ANALYTICS_AND_FUNCTIONAL)
    if (isAdvertisingSelected) enableCookie(CookieKind.ADVERTISING_AND_TRACKING)
    if (!isAnalyticsSelected) disableCookie(CookieKind.ANALYTICS_AND_FUNCTIONAL)
    if (!isAdvertisingSelected)
      disableCookie(CookieKind.ADVERTISING_AND_TRACKING)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="none"
      allowPinchZoom
      size={isMobile ? 'full' : 'xl'}
    >
      <ModalOverlay>
        <ModalContent sx={isMobile && mobileModalStyles} m={0}>
          <ModalHeader>
            <VStack spacing={4} alignItems="baseline">
              <Text textStyle="semibold/xlarge" color="label.primary">
                <Trans
                  i18nKey="apps:cookie.pref.title"
                  defaults="About the cookies on this site"
                />
              </Text>
              <Text textStyle="regular/medium" color="label.primary">
                <Trans
                  i18nKey="apps:cookie.pref.description"
                  defaults="Some cookies are required to use our services. To continue using this website, review the available cookie controls and make any optional changes you'd like before selecting accept below."
                />
              </Text>
            </VStack>{' '}
          </ModalHeader>
          {/* Not sure why, but not adding this button here causes a crash with `flushSync`. Adding it and set width to 0 to hide */}
          {/* Best guess is that this button captures focus, and if it does not, it captures the Switch element below and crashes */}
          {/* Releavnt issue: https://github.com/chakra-ui/chakra-ui/issues/3357 */}
          <Button w={0} h={0} p={0} m={0} border="none" />
          <ModalBody>
            <VStack spacing={6} alignItems="start">
              <CookiesBox
                cookies={essentialCookies?.cookies}
                description={t(
                  'apps:cookie.essential.description',
                  'These cookies are strictly necessary to provide you with the services and features available through our site.',
                )}
              >
                <Flex justifyContent="space-between" w="full">
                  <Text textStyle="semibold/large" color="label.primary">
                    <Trans
                      i18nKey="apps:cookie.pref.essential"
                      defaults="Essential website cookies"
                    />
                  </Text>
                  <Text textStyle="regular/medium" color="accent.base">
                    <Trans
                      i18nKey="apps:cookie.pref.necessary"
                      defaults="Necessary"
                    />
                  </Text>
                </Flex>
              </CookiesBox>

              <CookiesBox
                cookies={analyticsAndFuncCookies?.cookies}
                description={t(
                  'apps:cookie.analytics.description',
                  'These cookies collect information to help us understand how the site is being used and to see how visitors move around the site. ',
                )}
              >
                <Flex justifyContent="space-between" w="full">
                  <Text textStyle="semibold/large" color="label.primary">
                    <Trans
                      i18nKey="apps:cookie.pref.analytics "
                      defaults="Analytics and functional cookies"
                    />
                  </Text>
                  <Switch
                    data-testid="Cookie-analytics-switch"
                    onChange={e =>
                      setIsAnalyticsSelected(e.currentTarget.checked)
                    }
                    isChecked={isAnalyticsSelected}
                  />
                </Flex>
              </CookiesBox>

              <CookiesBox
                cookies={adsAndTrackCookies?.cookies}
                description={t(
                  'apps:cookie.pref.avertising.description',
                  'These cookies are used to make advertising messages more relevant to you and your interests. ',
                )}
              >
                <Flex justifyContent="space-between" w="full">
                  {' '}
                  <Text textStyle="semibold/large" color="label.primary">
                    <Trans
                      i18nKey="apps:cookie.pref.advertising"
                      defaults="Advertising and tracking cookies"
                    />
                  </Text>
                  <Switch
                    data-testid="Cookie-advertising-switch"
                    onChange={e =>
                      setIsAdvertisingSelected(e.currentTarget.checked)
                    }
                    defaultChecked={isAdvertisingSelected}
                    isChecked={isAdvertisingSelected}
                  />
                </Flex>
              </CookiesBox>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Flex w="full" justifyContent="space-between">
              <Button
                buttonType="secondary"
                onClick={onRequiredOnly}
                w="full"
                mr={2}
              >
                <Trans
                  i18nKey="apps:cookie.pref.requiredOnly"
                  defaults="Required cookies only"
                />
              </Button>
              <Button buttonType="primary" onClick={onSubmit} w="full">
                <Trans
                  i18nKey="apps:cookie.pref.submit"
                  defaults="Submit preferences"
                />
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

export default CookieConsentPreferencesModal
