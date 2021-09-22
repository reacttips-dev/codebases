import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Avatar, LoadingDots, Radio, Spaced, Text, Tooltip } from '@invisionapp/helios'
import Check from '@invisionapp/helios/icons/Check'
import {
  Role,
  selectAllowedRolesForGuests,
  selectAllowedRoles,
  roleTypes
} from '../../stores/roles'
import { Member } from '../../stores/members'

import useToast from '../../hooks/useToast'
import { LoadingStatus } from '../../stores/utils/loadingStatus'
import { CustomDialog } from '../CustomDialog'
import { Invitation } from '../../stores/invitations'

type ChangeRoleDialogProps = {
  item?: Member | Invitation
  isGuest?: boolean
  onSubmit: (item: Member | Invitation, role: number) => void
  onClose: () => void
}

const rolesDictionary: { [key: string]: { label: string; description: string } } = {
  [roleTypes.ADMIN]: {
    label: 'Admin',
    description:
      'Admins can manage memberships and billing, as well as security, authentication, and team settings'
  },
  [roleTypes.MANAGER]: {
    label: 'Manager',
    description: 'Managers can update user roles and groups, as well as add and remove users'
  },
  [roleTypes.MEMBER]: {
    label: 'Team member',
    description: 'Members can access all open team documents and spaces'
  },
  [roleTypes.GUEST]: {
    label: 'External guest',
    description:
      'Intended for third-party stakeholders, guests can only access documents and spaces they are invited to'
  }
}

export const ChangeRoleDialog = (props: ChangeRoleDialogProps) => {
  const { isGuest, item, onSubmit, onClose } = props

  const roles = useSelector(selectAllowedRoles)
  const guestRoles = useSelector(selectAllowedRolesForGuests)
  const visibleRoles = isGuest ? guestRoles : roles

  const [selectedRole, setSelectedRole] = useState<number | undefined>()
  const [loadingState, setLoadingState] = useState<LoadingStatus>('initial')

  const { errorToast } = useToast()

  useEffect(() => {
    setSelectedRole(item?.roleID)
  }, [item])

  const positiveButtonText = () => {
    switch (loadingState) {
      case 'loading': {
        return <LoadingDots color="white" />
      }
      case 'loaded': {
        return <Check fill="white" />
      }
      default: {
        return 'Change role'
      }
    }
  }

  const handleClose = () => {
    // Let animation finish before reseting everything
    setTimeout(() => onClose(), 300)
  }

  const onRoleChange = useCallback(() => {
    setLoadingState('loading')

    if (item === undefined || selectedRole === undefined) {
      errorToast('Something went wrong, please try again')
      return
    }

    onSubmit(item, selectedRole)
  }, [selectedRole, errorToast, item, onSubmit])

  // disable button when:
  // - loading / loaded
  // - same member's role
  const shouldBlockAction = useMemo(() => {
    return (
      loadingState === 'loading' || loadingState === 'loaded' || selectedRole === item?.roleID
    )
  }, [loadingState, selectedRole, item])

  const renderRoles = () =>
    visibleRoles.map((role: Role) => (
      <Radio
        id={`change-role-${role.id}`}
        key={`change-role-${role.id}`}
        name={`change-role-to-${role.id}`}
        unstyled
        onChange={() => {
          setSelectedRole(role.id)
        }}
        checked={selectedRole === role.id}
      >
        <Spaced left="xs">
          <Text order="subtitle" size="smallest">
            {rolesDictionary[role.id].label}
          </Text>
        </Spaced>
        <Spaced left="xs" bottom="m">
          <Text order="body" size="smallest" color="text-lightest">
            {rolesDictionary[role.id].description}
          </Text>
        </Spaced>
      </Radio>
    ))

  let username = ''
  let userEmail = ''
  let avatarUrl = ''

  if (item && 'name' in item) {
    username = item.name
    userEmail = item.email
    avatarUrl = item.avatarURL
  }

  return (
    <CustomDialog
      aria-label="Update member's role"
      maxWidth={510}
      closeOnEsc
      closeOnOverlay
      negativeText="Back"
      onRequestClose={() => handleClose()}
      onRequestNegative={() => handleClose()}
      onRequestPositive={onRoleChange}
      positiveText={positiveButtonText() as string}
      open={!!item}
      disableAutofocus
      negativeDisabled={false}
      positiveDisabled={shouldBlockAction}
      onAfterClose={() => {
        // Let the animations finish before resetting everything
        setTimeout(() => {
          // Reset everything after the dialog closes
          setLoadingState('initial')
        }, 300)
      }}
    >
      <>
        <Tooltip
          placement="bottom"
          trigger={<StyledAvatar color="dark" order="user" name={username} src={avatarUrl} />}
        >
          {username}
          <br />
          {userEmail}
        </Tooltip>

        <Spaced top="xs" bottom="l">
          <Text order="subtitle" size="larger">
            Change role
          </Text>
        </Spaced>

        <StyledForm>{renderRoles()}</StyledForm>
      </>
    </CustomDialog>
  )
}

const StyledAvatar = styled(Avatar)`
  margin: 0 auto;
`

const StyledForm = styled.form`
  display: inline-block;
  padding: 0 ${props => props.theme.spacing.s};
  margin-bottom: ${props => props.theme.spacing.xs};
  text-align: left;
`
