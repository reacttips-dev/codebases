import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Avatar, LoadingDots, Radio, Spaced, Text, Tooltip } from '@invisionapp/helios'
import Check from '@invisionapp/helios/icons/Check'
import { selectSeats } from '../../stores/billing'
import { Member } from '../../stores/members'

import useToast from '../../hooks/useToast'
import { LoadingStatus } from '../../stores/utils/loadingStatus'
import { CustomDialog } from '../CustomDialog'
import { Invitation } from '../../stores/invitations'

type ChangeSeatTypeDialogProps = {
  item?: Member | Invitation
  type?: string
  onSubmit: (item: Member | Invitation, selectedSeatTypeId: number) => void
  onClose: () => void
}

export const seatTypesDictionary: { [key: string]: { label: string; description: string } } = {
  Creator: {
    label: 'Creator',
    description:
      'Can create all document types, including prototypes and boards. Think designers and other power users.'
  },
  Collaborator: {
    label: 'Collaborator',
    description:
      'Can edit and inspect prototypes, as well as create freehands, specs, spaces, and design systems. Think developers, product managers, and other content consumers.'
  },
  Freehand: {
    label: 'Freehand Creator',
    description:
      'Can create only freehands. Has access to view or edit other document types. Great for anyone in an organization.'
  }
}

export const ChangeSeatTypeDialog = (props: ChangeSeatTypeDialogProps) => {
  const { item, type, onSubmit, onClose } = props

  const seats = useSelector(selectSeats)

  const [selectedSeatTypeId, setSelectedSeatTypeId] = useState<number | undefined>()
  const [loadingState, setLoadingState] = useState<LoadingStatus>('initial')

  const { errorToast } = useToast()

  useEffect(() => {
    setSelectedSeatTypeId(item?.seatTypeID)
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
        return 'Change seat type'
      }
    }
  }

  const handleClose = () => {
    // Let animation finish before reseting everything
    setTimeout(() => onClose(), 300)
  }

  const onSeatTypeChange = useCallback(() => {
    setLoadingState('loading')

    if (item === undefined || selectedSeatTypeId === undefined) {
      errorToast('Something went wrong, please try again')
      return
    }

    onSubmit(item, selectedSeatTypeId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingState, selectedSeatTypeId])

  // disable button when:
  // - loading / loaded
  // - same member's role
  const shouldBlockAction = useMemo(
    () =>
      loadingState === 'loading' ||
      loadingState === 'loaded' ||
      selectedSeatTypeId === item?.seatTypeID,
    [item, loadingState, selectedSeatTypeId]
  )

  const renderSeatTypes = () =>
    seats.map(seat => (
      <Radio
        id={`change-seat-type-${seat.seatTypeId}`}
        key={`change-seat-type-${seat.seatTypeId}`}
        name={`change-seat-type-to-${seat.seatTypeId}`}
        unstyled
        onChange={() => {
          setSelectedSeatTypeId(seat.seatTypeId)
        }}
        checked={selectedSeatTypeId === seat.seatTypeId}
      >
        <Spaced left="xs">
          <Text order="subtitle" size="smallest">
            {seatTypesDictionary[seat.seatTypeName].label}
          </Text>
        </Spaced>
        <Spaced left="xs" bottom="m">
          <Text order="body" size="smallest" color="text-lightest">
            {seatTypesDictionary[seat.seatTypeName].description}
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
      aria-label={`Update ${type}'s role"`}
      maxWidth={510}
      closeOnEsc
      closeOnOverlay
      negativeText="Back"
      onRequestClose={() => handleClose()}
      onRequestNegative={() => handleClose()}
      onRequestPositive={onSeatTypeChange}
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
            Change seat type
          </Text>
        </Spaced>

        <StyledForm>{renderSeatTypes()}</StyledForm>
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
