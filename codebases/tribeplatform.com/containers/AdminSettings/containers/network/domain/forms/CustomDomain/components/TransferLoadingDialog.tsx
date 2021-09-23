import React from 'react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/modal'

import { Network } from 'tribe-api'
import { Trans } from 'tribe-translation'

const TransferLoadingDialog = ({
  newDomain,
}: {
  newDomain: Network['newDomain']
}) => (
  <AlertDialog
    data-testid="transfer-loading-dialog"
    leastDestructiveRef={undefined}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose={() => {}}
    isOpen
    isCentered
    motionPreset="slideInBottom"
    closeOnEsc={false}
    closeOnOverlayClick={false}
  >
    <AlertDialogOverlay>
      <AlertDialogContent bg="bg.base">
        <AlertDialogHeader>
          <Trans
            i18nKey="admin:domain.domainTransferDialog.title"
            defaults="Domain transfer in progress ⏳"
          />
        </AlertDialogHeader>
        <AlertDialogBody>
          <Trans
            i18nKey="admin:domain.domainTransferDialog.body"
            defaults="Please wait, this won’t take too long. If after 3 minutes you are not redirected to your community at the new domain <bold>{{ newDomain }}</bold>, please contact support "
            values={{
              newDomain,
            }}
            components={{
              bold: <strong />,
            }}
          />
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialogOverlay>
  </AlertDialog>
)

export default TransferLoadingDialog
