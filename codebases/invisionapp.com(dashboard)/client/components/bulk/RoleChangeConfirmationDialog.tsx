import React from 'react'

import { Spaced, Text } from '@invisionapp/helios'

import { CustomDialog } from '../CustomDialog'

type RoleChangeConfirmationDialog = {
  onCancel: () => void
  onConfirm: () => void
  open?: boolean
}

const RoleChangeConfirmationDialog = (props: RoleChangeConfirmationDialog) => {
  const { open, onCancel, onConfirm } = props
  return (
    <CustomDialog
      aria-label="Confirmation before changing roles"
      closeOnEsc
      closeOnOverlay
      negativeText="Cancel"
      onRequestClose={() => {}}
      onRequestNegative={onCancel}
      onRequestPositive={onConfirm}
      positiveText="Change roles"
      open={open}
      disableAutofocus
      maxWidth={500}
    >
      <>
        <Text order="subtitle" size="larger" element="h2">
          Are you sure?
        </Text>
        <Spaced bottom="xl">
          <Text order="body" element="p" prose>
            Changing roles can grant or revoke a number of user permissions and affect project
            visibility.{' '}
            <a
              href="https://support.invisionapp.com/hc/en-us/articles/360017859292#invision-v7-user-roles"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </Text>
        </Spaced>
      </>
    </CustomDialog>
  )
}

export default RoleChangeConfirmationDialog
