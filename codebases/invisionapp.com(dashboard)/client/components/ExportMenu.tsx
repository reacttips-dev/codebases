import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import {
  Align,
  Button,
  IconButton,
  List,
  Modal,
  Padded,
  Radio,
  Spaced,
  Text
} from '@invisionapp/helios'
import { Download } from '@invisionapp/helios/icons'

import {
  exportAllUsers,
  fetchPendingInvitationsExport,
  fetchRemovedUsersExport,
  fetchUsersByUserGroupsExport,
  selectAllUsersExportData,
  selectInvitationsExport,
  selectRemovedUsersExport,
  selectUsersByUserGroupsExport
} from '../stores/exports'
import { selectPermission } from '../stores/permissions'
import { selectInvitationsPagination } from '../stores/invitations'
import { selectRemovedUsersLen } from '../stores/removedUsers'
import { selectUserGroupsLength } from '../stores/userGroups'
import { AppState as State } from '../stores/index'

import { generateCsvFile } from '../helpers/exports'

type Option = 'all-users' | 'users-by-user-groups' | 'pending-invitations' | 'removed-users'
type ItemsDictionary = {
  id: Option
  label: string
  isDisabled: boolean
}

const ExportMenu = () => {
  // --- Hooks ---
  const [checked, setChecked] = useState<Option>('all-users')
  const [isOpen, setIsOpen] = useState(false)

  // --- Selectors ---
  const allUsersExportData = useSelector(selectAllUsersExportData)
  const invitationsExport = useSelector(selectInvitationsExport)
  const usersByUserGroupsExport = useSelector(selectUsersByUserGroupsExport)
  const removedUsersExport = useSelector(selectRemovedUsersExport)
  const canManageGroupsPermission = useSelector((state: State) =>
    selectPermission(state, 'People.ManageGroups')
  )
  const invitations = useSelector(selectInvitationsPagination)
  const removedUsersLen = useSelector(selectRemovedUsersLen)
  const userGroupsLen = useSelector(selectUserGroupsLength)

  // --- Dispatchers ---
  const dispatch = useDispatch()
  const exportAllUsersRequest = () => dispatch(exportAllUsers())
  const fetchAllInvitationsRequest = () => dispatch(fetchPendingInvitationsExport())
  const fetchUsersByUserGroupsRequest = () => dispatch(fetchUsersByUserGroupsExport())
  const fetchRemovedUsersRequest = () => dispatch(fetchRemovedUsersExport())

  const itemsDictionary: ItemsDictionary[] = [
    {
      id: 'all-users',
      label: 'All users (members and guests)',
      isDisabled: false
    }
  ]
  if (canManageGroupsPermission) {
    itemsDictionary.push({
      id: 'users-by-user-groups',
      label: 'Users by user groups',
      isDisabled: userGroupsLen === 0
    })
  }
  itemsDictionary.push(
    {
      id: 'pending-invitations',
      label: 'Invitations',
      isDisabled: invitations.totalCount === 0
    },
    {
      id: 'removed-users',
      label: 'Removed users',
      isDisabled: removedUsersLen === 0
    }
  )

  function getDateTime() {
    const date = new Date()
    const month = date
      .getMonth()
      .toString()
      .padStart(2, '0')
    const day = date
      .getDay()
      .toString()
      .padStart(2, '0')
    const hour = date
      .getHours()
      .toString()
      .padStart(2, '0')
    const minutes = date
      .getMinutes()
      .toString()
      .padStart(2, '0')

    return `${date.getFullYear()}-${month}-${day}-${hour}:${minutes}:${date.getSeconds()}`
  }

  const getFilename = useCallback((type: Option) => {
    return `export-${type}-${getDateTime()}.csv`
  }, [])

  useEffect(() => {
    if (allUsersExportData === null) {
      return
    }

    generateCsvFile(allUsersExportData, getFilename('all-users'))
  }, [allUsersExportData, getFilename])

  useEffect(() => {
    if (invitationsExport === null) {
      return
    }

    generateCsvFile(invitationsExport, getFilename('pending-invitations'))
  }, [invitationsExport, getFilename])

  useEffect(() => {
    if (usersByUserGroupsExport === null) {
      return
    }

    generateCsvFile(usersByUserGroupsExport, getFilename('users-by-user-groups'))
  }, [usersByUserGroupsExport, getFilename])

  useEffect(() => {
    if (removedUsersExport === null) {
      return
    }

    generateCsvFile(removedUsersExport, getFilename('removed-users'))
  }, [removedUsersExport, getFilename])

  const exportItems = useMemo(() => {
    return itemsDictionary.map((item: ItemsDictionary) => (
      <Spaced bottom="s">
        <Radio
          checked={checked === item.id}
          id={`csv-export-${item.id}`}
          name="csv-export"
          onChange={() => setChecked(item.id)}
          disabled={item.isDisabled}
          unstyled
        >
          {item.label}
        </Radio>
      </Spaced>
    ))
  }, [itemsDictionary, checked])

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    switch (checked) {
      case 'all-users':
        exportAllUsersRequest()
        break
      case 'pending-invitations':
        fetchAllInvitationsRequest()
        break
      case 'users-by-user-groups':
        fetchUsersByUserGroupsRequest()
        break
      case 'removed-users':
        fetchRemovedUsersRequest()
        break
      default:
    }

    setIsOpen(false)
  }

  return (
    <>
      <IconButton withTooltip={false}>
        <Download size={24} fill="text" onClick={() => setIsOpen(!isOpen)} />
      </IconButton>

      <StyledModal
        aria-label="Export CSV options"
        closeOnClickOutside
        maxWidth={280}
        onRequestClose={() => setIsOpen(false)}
        open={isOpen}
        passThrough
      >
        <Padded all="m">
          <div>
            <Spaced bottom="s">
              <Text order="subtitle">Export CSV</Text>
            </Spaced>
            <form>
              <StyledList items={exportItems} order="unordered" size="smallest" />
              <Align horizontal="end">
                <Button order="primary-alt" size="smaller" onClick={handleSubmit}>
                  Export
                </Button>
              </Align>
            </form>
          </div>
        </Padded>
      </StyledModal>
    </>
  )
}

const StyledModal = styled(Modal)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xl};
  right: 0;
  width: 280px;
`

const StyledList = styled(List)`
  padding: 0;
`

export default ExportMenu
