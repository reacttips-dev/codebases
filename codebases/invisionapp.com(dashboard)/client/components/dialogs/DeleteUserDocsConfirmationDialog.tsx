import React from 'react'
import pluralize from 'pluralize'
// @ts-ignore
import deleteUserGroupSvg from '@invisionapp/helios/illustrations/spot/delete-document.svg'
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog'

type DeleteUserDocsConfirmationDialogProps = {
  open: boolean
  onCancel: () => {}
  onDelete: () => {}
  loading: boolean
  documentCount: number
}

export const DeleteUserDocsConfirmationDialog = (
  props: DeleteUserDocsConfirmationDialogProps
) => {
  const { open = false, onCancel, onDelete, loading, documentCount } = props

  return (
    <DeleteConfirmationDialog
      title="Are you sure you want to do this?"
      subtitle={
        <>
          Once deleted, nobody will be able to open these
          <br /> documents, and there’s no turning back.
        </>
      }
      extraConfirmationText={`I’m sure I want to delete ${documentCount} ${pluralize(
        'documents',
        documentCount
      )}`}
      positiveText="Delete"
      negativeText="Never mind"
      open={open}
      onBack={onCancel}
      onConfirm={onDelete}
      illustration={deleteUserGroupSvg} // TODO: get correct illustration
      loading={loading}
    />
  )
}
