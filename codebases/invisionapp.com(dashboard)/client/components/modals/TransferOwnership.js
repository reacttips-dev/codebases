import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { browserHistory } from 'react-router'
import { Button, Fullscreen, IconButton, Text } from '@invisionapp/helios'
import { Close } from '@invisionapp/helios/icons'
import Avatar from '../ProportionedAvatar'

import bffRequest from '../../utils/bffRequest'

import { selectTeam, setTransferUser } from '../../stores/team'
import { showFlash } from '../../stores/flash'
import { getRoleNameById, selectAllRoles } from '../../stores/roles'

import { SearchablePotentialOwners } from '../documents/SearchablePotentialOwners'

const TransferOwnership = props => {
  // Selectors
  const team = useSelector(selectTeam)
  const allRoles = useSelector(selectAllRoles)

  const ownerRoleName = getRoleNameById(allRoles, 1) ?? 'Owner'

  // Hooks
  const [selectedMember, setSelectedMember] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)

  //  Actions
  const dispatch = useDispatch()
  const startTransfer = toMember => {
    return bffRequest
      .post('/teams/api/user/send-code', {
        action: 'transferOwnership'
      })
      .then(response => {
        dispatch(setTransferUser(toMember))
        return response
      })
  }
  const notifyError = message => {
    dispatch(
      showFlash({
        message,
        status: 'danger'
      })
    )
  }

  let unlisten = () => {}

  useEffect(() => {
    setTimeout(() => setModalOpen(true), 0)
    unlisten = browserHistory.listen(() => setModalOpen(false))
    return () => unlisten()
  }, [])

  const handleSelect = member => {
    setSelectedMember(member)
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (selectedMember) {
      startTransfer({
        member: selectedMember
      })
        .then(() => {
          browserHistory.push('/teams/people/members/transfer-ownership/verify')
        })
        .catch(() => {
          notifyError('There was a problem sending your verification code.')
        })
    }
  }

  const handleClose = () => {
    browserHistory.push(props.route.closeTo)
  }

  const renderClose = () => (
    <IconButton tooltipPlacement="left" tooltip="close" onClick={handleClose}>
      <Close size={32} />
    </IconButton>
  )

  return (
    <Fullscreen
      closeOnEsc
      fullWidth
      open={isModalOpen}
      renderLogo={() => {}}
      renderClose={() => renderClose()}
      onRequestClose={() => {}}
      style={{ zIndex: 20 }}
    >
      <Wrapper>
        <StyledAvatar
          size="larger"
          order="team"
          color={team.logo ? 'light' : 'dark'}
          name={team.name}
          src={team.logo}
        />
        <StyledHeading color="text-darker" order="title" size="smaller" align="center">
          Select a team {ownerRoleName}
        </StyledHeading>
        <StyledSubheading color="text-lighter" order="body" size="larger" align="center">
          After the transfer, you will become a team {getRoleNameById(allRoles, 2)}
        </StyledSubheading>

        <SearchablePotentialOwners onSelect={handleSelect} />

        <ButtonWrapper>
          <Button
            order="primary"
            size="larger"
            disabled={!selectedMember}
            onClick={e => handleSubmit(e)}
          >
            Next
          </Button>
        </ButtonWrapper>
      </Wrapper>
    </Fullscreen>
  )
}

const StyledAvatar = styled(Avatar)`
  margin: 0 auto ${({ theme }) => theme.spacing.m};
`

const StyledHeading = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const StyledSubheading = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.l};
  text-align: center;
`

const Wrapper = styled.form`
  width: 540px;
  padding: 120px 0;
  margin: 0 auto;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.l};
`

export default TransferOwnership
