import React, { useCallback, useEffect, useState } from 'react'

import { Box, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { ThemeTokens } from 'tribe-api'
import { confirm } from 'tribe-components'
import { useTranslation, Trans } from 'tribe-translation'

import { CustomDomainFormValues } from 'containers/AdminSettings/containers/network/domain/forms/CustomDomain/@types'
import FormButtons from 'containers/AdminSettings/containers/network/domain/forms/CustomDomain/components/FormButtons'
import FormInput from 'containers/AdminSettings/containers/network/domain/forms/CustomDomain/components/FormInput'
import FormTable from 'containers/AdminSettings/containers/network/domain/forms/CustomDomain/components/FormTable'
import TransferLoadingDialog from 'containers/AdminSettings/containers/network/domain/forms/CustomDomain/components/TransferLoadingDialog'
import useAddNewDomain from 'containers/AdminSettings/containers/network/domain/hooks/useAddNewDomain'
import useCheckNewDomainStatus from 'containers/AdminSettings/containers/network/domain/hooks/useCheckNewDomainStatus'
import useClearNewDomain from 'containers/AdminSettings/containers/network/domain/hooks/useClearNewDomain'
import useTransferToNewDomain from 'containers/AdminSettings/containers/network/domain/hooks/useTransferToNewDomain'
import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import useGetNetwork from 'containers/Network/useGetNetwork'

function CustomDomainForm(): JSX.Element {
  const [canShowTransferPrompt, setCanShowTransferPrompt] = useState<boolean>(
    false,
  )
  const { network } = useGetNetwork()
  const { themeSettings } = useThemeSettings()
  const { t } = useTranslation()
  const newDomain = network?.newDomain
  const networkDomain = network?.domain

  const {
    addNewDomain,
    error: apolloError,
    loading: isAddingNewDomain,
  } = useAddNewDomain()
  const {
    checkNewDomainStatus,
    domainStatus,
    loading: isCheckingNewDomain,
  } = useCheckNewDomainStatus(newDomain)
  const { clearNewDomain, loading: isClearingNewDomain } = useClearNewDomain()
  const {
    transfer,
    loading: isTransferringToNewDomain,
  } = useTransferToNewDomain()

  const isSettingUpNewDomain = !!(newDomain && newDomain !== '')
  const canTransfer = domainStatus?.success === true

  const { handleSubmit, control, errors, setValue } = useForm<
    CustomDomainFormValues
  >({
    mode: 'onTouched',
    defaultValues: {
      domain: newDomain || '',
    },
  })

  const handleCheckNewDomainStatus = useCallback(() => {
    setCanShowTransferPrompt(true)

    checkNewDomainStatus()
  }, [checkNewDomainStatus])

  const handleClearNewDomain = useCallback(() => {
    setCanShowTransferPrompt(false)

    clearNewDomain()
  }, [clearNewDomain])

  const promptForTransfer = useCallback(async () => {
    const transferConfirmation = await confirm({
      title: t('admin:domain.confirmDomainChangeDialog.title', {
        defaultValue: 'Everything looks good 👍',
      }),
      body: (
        <Trans
          i18nKey="admin:domain.confirmDomainChangeDialog.body"
          defaults="By clicking on “Move community” you will change the location of your community from <bold>{{ oldDomain }}</bold> to <bold>{{ newDomain }}</bold> and the traffic on your domain will be redirected to the new domain."
          values={{
            newDomain,
            oldDomain: networkDomain,
          }}
          components={{
            bold: <strong />,
          }}
        />
      ),
      hideCloseIcon: true,
      hideHeaderDivider: true,
      cancelButtonProps: {
        variant: 'solid',
      },
      themeSettings: themeSettings as ThemeTokens,
    })

    setCanShowTransferPrompt(false)

    if (transferConfirmation) {
      transfer()
    }

    return transferConfirmation
  }, [t, networkDomain, newDomain, themeSettings, transfer])

  useEffect(() => {
    if (newDomain) setValue('domain', newDomain)
  }, [newDomain, setValue])

  useEffect(() => {
    if (canTransfer && canShowTransferPrompt) {
      promptForTransfer()
    }
  }, [
    canTransfer,
    promptForTransfer,
    isTransferringToNewDomain,
    canShowTransferPrompt,
  ])

  return (
    <Box
      data-testid="custom-domain-form"
      as="form"
      flex="1"
      w="full"
      onSubmit={handleSubmit(args => {
        if (canTransfer) {
          promptForTransfer()
        } else {
          addNewDomain(args)
          setCanShowTransferPrompt(true)
        }
      })}
    >
      <VStack align="stretch" spacing={6}>
        <FormInput
          apolloError={apolloError}
          control={control}
          formErrors={errors}
          isDisabled={isSettingUpNewDomain}
        />

        <FormButtons
          canTransfer={canTransfer}
          isAddingNewDomain={isAddingNewDomain}
          isCheckingNewDomain={isCheckingNewDomain}
          isClearingNewDomain={isClearingNewDomain}
          isSettingUpNewDomain={isSettingUpNewDomain}
          isTransferringToNewDomain={isTransferringToNewDomain}
          onCheckNewDomainStatus={handleCheckNewDomainStatus}
          onClearNewDomain={handleClearNewDomain}
        />

        {domainStatus?.domain && (
          <FormTable
            domainStatus={domainStatus}
            isLoading={isAddingNewDomain || isCheckingNewDomain}
          />
        )}
        {isTransferringToNewDomain && (
          <TransferLoadingDialog newDomain={newDomain} />
        )}
      </VStack>
    </Box>
  )
}

export default CustomDomainForm
