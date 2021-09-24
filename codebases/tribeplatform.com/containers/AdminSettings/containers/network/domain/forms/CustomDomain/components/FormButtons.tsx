import React from 'react'

import { HStack } from '@chakra-ui/layout'

import { Button } from 'tribe-components'
import { Trans } from 'tribe-translation'

interface FormButtonProps {
  canTransfer: boolean
  isAddingNewDomain?: boolean
  isCheckingNewDomain?: boolean
  isClearingNewDomain?: boolean
  isSettingUpNewDomain?: boolean
  isTransferringToNewDomain?: boolean
  onCheckNewDomainStatus: () => void
  onClearNewDomain: () => void
}

const FormButton: React.FC<FormButtonProps> = ({
  canTransfer,
  isAddingNewDomain = false,
  isCheckingNewDomain = false,
  isClearingNewDomain = false,
  isSettingUpNewDomain = false,
  isTransferringToNewDomain = false,
  onCheckNewDomainStatus,
  onClearNewDomain,
}) => {
  const canCancel = isSettingUpNewDomain
  const showRecheckBtn = isSettingUpNewDomain && !canTransfer
  const areButtonsDisabled =
    isAddingNewDomain ||
    isCheckingNewDomain ||
    isClearingNewDomain ||
    isTransferringToNewDomain

  return (
    <HStack alignItems="flex-start" justifyContent="flex-end">
      {(!isSettingUpNewDomain || canTransfer) && (
        <Button
          buttonType="primary"
          data-testid="form-add-new-custom-domain-button"
          isDisabled={areButtonsDisabled}
          isLoading={isAddingNewDomain || isTransferringToNewDomain}
          mr={2}
          type="submit"
        >
          <Trans
            i18nKey="admin:domain.general.moveCommunity"
            defaults="Move community"
          />
        </Button>
      )}
      {showRecheckBtn && (
        <Button
          buttonType="base"
          type="button"
          data-testid="recheck-domain-transfer-button"
          isDisabled={areButtonsDisabled}
          isLoading={isCheckingNewDomain}
          mr={2}
          onClick={onCheckNewDomainStatus}
        >
          <Trans
            i18nKey="admin:domain.general.recheck"
            defaults="Recheck settings"
          />
        </Button>
      )}
      {canCancel && (
        <Button
          buttonType="base"
          type="button"
          data-testid="cancel-domain-transfer-button"
          isDisabled={areButtonsDisabled}
          isLoading={isClearingNewDomain}
          onClick={onClearNewDomain}
        >
          <Trans i18nKey="admin:domain.general.cancel" defaults="Cancel" />
        </Button>
      )}
    </HStack>
  )
}

export default FormButton
