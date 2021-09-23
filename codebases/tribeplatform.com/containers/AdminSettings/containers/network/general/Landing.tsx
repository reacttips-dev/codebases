import React, { useCallback, useRef, useState } from 'react'

import { HStack, VStack } from '@chakra-ui/react'

import { NetworkLandingPage } from 'tribe-api/interfaces'
import {
  Accordion,
  Button,
  Text,
  Select,
  Checkbox,
  useToast,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import useUpdateNetwork from 'hooks/useUpdateNetwork'

import { logger } from 'lib/logger'

const capitalize = (str: string) =>
  `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`

const LANDING_PAGE_OPTIONS = Object.keys(NetworkLandingPage).map(key => ({
  label: capitalize(key),
  value: {
    id: key as NetworkLandingPage,
  },
}))

const NetworkLandingPageSettings = () => {
  const selectRef = useRef<HTMLDivElement>(null)
  const { network } = useGetNetwork()
  const { updateNetwork, loading } = useUpdateNetwork()
  const { landingPageForGuest, landingPageForMember } =
    network.landingPages || {}
  const [memberLandingPage, setMemberLandingPage] = useState<
    NetworkLandingPage
  >(landingPageForMember || NetworkLandingPage.EXPLORE)
  const [guestLandingPage, setGuestLandingPage] = useState<NetworkLandingPage>(
    landingPageForGuest || NetworkLandingPage.EXPLORE,
  )
  const [useDifferentLandingPages, setUseDifferentLandingPages] = useState(
    memberLandingPage !== guestLandingPage,
  )
  const toast = useToast()
  const { t } = useTranslation()
  const [isDirty, setIsDirty] = useState(false)

  const onUpdate = useCallback(async () => {
    const updateInput = useDifferentLandingPages
      ? {
          landingPages: {
            landingPageForMember: memberLandingPage,
            landingPageForNewMember: guestLandingPage,
            landingPageForGuest: guestLandingPage,
          },
        }
      : {
          landingPages: {
            landingPageForMember: memberLandingPage,
            landingPageForNewMember: memberLandingPage,
            landingPageForGuest: memberLandingPage,
          },
        }
    try {
      await updateNetwork(updateInput)
      toast({
        title: t('admin:general.landingPage.done', 'Done'),
        description: t(
          'admin:general.landingPage.successful',
          'Landing page has been changed',
        ),
        status: 'success',
        isClosable: true,
        position: 'top-right',
      })
      setIsDirty(false)
    } catch (e) {
      logger.error(e)
      toast({
        title: t('admin:general.landingPage.failed', 'Failed'),
        description: t(
          'admin:general.landingPage.unsucessful',
          'Something went wrong. Please try again.',
        ),
        status: 'error',
        isClosable: true,
        position: 'top-right',
      })
    }
  }, [
    guestLandingPage,
    memberLandingPage,
    t,
    toast,
    updateNetwork,
    useDifferentLandingPages,
  ])

  return (
    <Accordion
      title="Landing Page"
      subtitle={capitalize(String(memberLandingPage))}
      defaultIndex={0}
      textTransform="capitalize"
      borderTopLeftRadius="0 !important"
      borderTopRightRadius="0 !important"
      groupProps={{
        boxShadow: 'none !important',
      }}
    >
      <VStack spacing={6} alignItems="flex-start" w="100%">
        <VStack spacing={2} alignItems="flex-start" w="100%" ref={selectRef}>
          <Text variant="regular/medium" color="label.primary">
            <Trans
              i18nKey="admin:general.pickLandingPage"
              defaults="Pick a landing page"
            />
          </Text>
          <Select
            autoSelect={false}
            listProps={{
              width: selectRef.current ? selectRef.current.clientWidth : 'auto',
            }}
            placement="bottom-start"
            onChange={val => {
              if (val) {
                if (!isDirty) setIsDirty(true)
                setMemberLandingPage(val?.id)
              }
            }}
            options={LANDING_PAGE_OPTIONS}
            value={{ id: memberLandingPage }}
          />
        </VStack>
        <HStack spacing={2}>
          <Checkbox
            checked={useDifferentLandingPages}
            defaultChecked={useDifferentLandingPages}
            onChange={e => setUseDifferentLandingPages(e.currentTarget.checked)}
          >
            <Text variant="regular/medium">
              <Trans
                i18nKey="admin:general.guestLanding"
                defaults="Use a different landing page for guests"
              />
            </Text>
          </Checkbox>
        </HStack>
        {useDifferentLandingPages && (
          <Select
            autoSelect={false}
            listProps={{
              width: selectRef.current ? selectRef.current.clientWidth : 'auto',
            }}
            onChange={val => {
              if (val) {
                if (!isDirty) setIsDirty(true)
                setGuestLandingPage(val?.id)
              }
            }}
            options={LANDING_PAGE_OPTIONS}
            value={{ id: guestLandingPage }}
          />
        )}
        <Button
          isLoading={loading}
          data-testid="landing-page-update-btn"
          buttonType="primary"
          isDisabled={loading || !isDirty}
          alignSelf="flex-end"
          onClick={onUpdate}
        >
          <Trans i18nKey="admin:update" defaults="Update" />
        </Button>
      </VStack>
    </Accordion>
  )
}

export default NetworkLandingPageSettings
