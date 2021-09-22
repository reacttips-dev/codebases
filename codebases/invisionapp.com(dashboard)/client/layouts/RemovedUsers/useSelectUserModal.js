import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import pluralize from 'pluralize'
import useToast from '../../hooks/useToast'
import { lockBodyScroll, unlockBodyScroll } from '../../stores/app'
import {
  getAllMembersForDocTransfers,
  selectMembersAndGuestsArray
} from '../../stores/members'
import { transferDocsToUser, transferCounts } from '../../stores/bulkTransfer'
import { load as loadRemovedUsers } from '../../stores/removedUsers'

export const useSelectUserModal = () => {
  const dispatch = useDispatch()
  const { successToast, errorToast } = useToast()
  const allMembers = useSelector(selectMembersAndGuestsArray)

  const [selectUserModal, setSelectUserModal] = useState({
    selectUserModalOpen: false,
    userIdToTransferTo: null,
    fromUserId: null,
    transferToUserStatus: 'disabled',
    selectedDocumentCount: 0,
    possibleDocOwners: {
      status: 'initial', // initial | loaded | laoded
      members: []
    }
  })

  React.useEffect(() => {
    setSelectUserModal({
      ...selectUserModal,
      possibleDocOwners: {
        ...selectUserModal.possibleDocOwners,
        status: 'loading'
      }
    })

    getAllMembersForDocTransfers()
      .then(response => {
        const members = response.data

        setSelectUserModal({
          ...selectUserModal,
          possibleDocOwners: {
            ...selectUserModal.possibleDocOwners,
            status: 'loaded',
            members
          }
        })
      })
      .catch(() => {
        /*
            If there's an error getting these users, it'll just show all members
            This is ok, because it will still check permissions on the next
            request.
          */
        setSelectUserModal({
          ...selectUserModal,
          possibleDocOwners: {
            ...selectUserModal.possibleDocOwners,
            status: 'loaded',
            members: allMembers
          }
        })
      })
  }, [])

  const openSelectUserModal = (fromUserId, selectedDocumentCount = 0) => {
    setSelectUserModal({
      ...selectUserModal,
      selectedDocumentCount,
      selectUserModalOpen: true,
      fromUserId
    })
    dispatch(lockBodyScroll())
  }

  const closeSelectUserModal = () => {
    setSelectUserModal({
      ...selectUserModal,
      selectUserModalOpen: false,
      formUserId: null,
      selectedDocumentCount: 0
    })
    dispatch(unlockBodyScroll())
  }

  const setTransferToUserStatus = transferToUserStatus =>
    setSelectUserModal({ ...selectUserModal, transferToUserStatus })

  const setUserIdToTransferTo = userIdToTransferTo => {
    setSelectUserModal({
      ...selectUserModal,
      userIdToTransferTo,
      transferToUserStatus: userIdToTransferTo ? 'default' : 'disabled'
    })
  }

  const startTransforUser = () => {
    if (selectUserModal.userIdToTransferTo === null) {
      return
    }

    setTransferToUserStatus('loading')

    transferDocsToUser(selectUserModal.fromUserId, selectUserModal.userIdToTransferTo)
      .then(response => {
        dispatch(loadRemovedUsers())
        closeSelectUserModal()

        const body = response.data

        switch (body.status) {
          case 'Failed': {
            const { failed, succeeded } = transferCounts(body)

            return errorToast(
              <>
                {succeeded.length} {pluralize('documents', succeeded.length)} were successfully
                transferred to their new owner, however
                <br />
                {failed.length} {pluralize('documents', failed.length)} were not transferred.
                Please try again later or contact support.
              </>
            )
          }
          // Succeeded
          default: {
            return successToast(
              `The document ownership has been successfully transferred and the new owner will be notified`
            )
          }
        }
      })
      .catch(() => {
        setTransferToUserStatus('default')
        errorToast('There was an error transferring the documents. Please try again.')
      })
  }

  return {
    ...selectUserModal,
    openSelectUserModal,
    closeSelectUserModal,
    setUserIdToTransferTo,
    startTransforUser
  }
}
