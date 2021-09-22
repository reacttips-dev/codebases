import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import validate from 'validate.js'
import debounce from 'lodash/debounce'
import pluralize from 'pluralize'

import styled from 'styled-components'
import { Label, LoadingDots, Text, Textarea } from '@invisionapp/helios'
import useToast from '../../hooks/useToast'

import { navigateInternally, selectLocationQuery } from '../../stores/location'
import { LoadingStatus } from '../../stores/utils/loadingStatus'
import {
  fetchAllInvitations,
  getInvitationFromToken,
  sendInvitations
} from '../../stores/invitations'
import { Member, selectMembersAndGuestsArray } from '../../stores/members'
import { selectDefaultSeatId, selectIsMultiSeatPlan } from '../../stores/billing'

import { CustomDialog } from '../CustomDialog'
import { SearchableSeatType } from '../forms/SearchableSeatType'
import { DEBOUNCE_DELAY, DIALOG_CLOSE_DELAY } from '../../constants'

import {
  trackPeopleInviteClosed,
  trackPeopleInviteSelected,
  trackPeopleInviteViewed
} from '../../helpers/analytics'
import { selectShowSeatTypeFlag, selectUseV2MembersFlag } from '../../stores/featureFlags'

type SeatType = {
  name: string
  quantity: number
  seatTypeId: number
  seatTypeName: string
  sku: string
}

type InviteDialogProps = {
  isOpen: boolean
  onClose: () => void
}

const InviteDialog = (props: InviteDialogProps) => {
  const { isOpen, onClose } = props
  const dispatch = useDispatch()
  const { successToast, errorToast } = useToast()

  // --- Selector ---
  const defaultSeatId = useSelector(selectDefaultSeatId)
  const isMultiSeatPlan = useSelector(selectIsMultiSeatPlan)
  const guestQuery = useSelector(selectLocationQuery('guest'))
  const token = useSelector(selectLocationQuery('token'))
  const members = useSelector(selectMembersAndGuestsArray)

  // --- Hooks ---
  const [emailsState, setEmailsState] = useState<string>('')
  const [errorsState, setErrorsState] = useState<string>('')
  const [loadingState, setLoadingState] = useState<LoadingStatus>('initial')
  const [seatTypeState, setSeatTypeState] = useState<number>(-1)

  // --- Feature Flags ---
  const showSeatTypeFlag = useSelector(selectShowSeatTypeFlag)
  const showPerfImprovesFlag = useSelector(selectUseV2MembersFlag)
  const showSeatType = showSeatTypeFlag && isMultiSeatPlan

  // --- Dispatchers ---
  const sendInvitationsRequest = ({
    invites,
    onDone,
    onError
  }: {
    invites: any
    onDone: () => void
    onError: () => void
  }) => dispatch(sendInvitations({ invites, onDone, onError }))
  const fetchAllInvitationsRequest = ({
    background,
    force
  }: {
    background?: boolean
    force?: boolean
  }) => dispatch(fetchAllInvitations({ background, force }))
  const getInvitation = ({
    token,
    onDone,
    onError
  }: {
    token: string
    onDone: (email: string) => void
    onError: () => void
  }) => dispatch(getInvitationFromToken({ token, onDone, onError }))
  // ------

  useEffect(() => {
    if (isOpen) {
      // reset everything
      setErrorsState('')
      setEmailsState('')

      // analytics
      trackPeopleInviteViewed()
    }

    if (isOpen && token) {
      getInvitation({
        token,
        onDone: (email: string) => {
          setEmailsState(email)
        },
        onError: () => {
          setEmailsState('')
          errorToast('There was a problem loading the invitation. Please try again.')
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const isSpaceSeparated = (emails: string) => !emails.includes(',')

  const debouncedError = useCallback(
    debounce(() => setErrorsState('Please provide a valid email.'), DEBOUNCE_DELAY),
    []
  )

  const validateForm = (emailString: string) => {
    const constraints = { email: { email: true } }
    const separator = isSpaceSeparated(emailString) ? ' ' : ','
    const emails = emailString
      .split(separator)
      .map(s => s.trim())
      .filter(email => !!email)

    if (emails.length === 0) {
      debouncedError()
      return
    }

    // @areAllValid flag used for:
    // - when typing I want to delay the error (debounce)
    // - immediately remove the (possible) error if all the emails are valid + enable the submit button
    let areAllValid = true
    const alreadyMembers: string[] = []

    emails.forEach((email: string) => {
      const trimmedEmail = email.trim()
      const result = validate({ email: trimmedEmail }, constraints)

      if (result) {
        areAllValid = false
      }

      members.forEach((member: Member) => {
        if (member === undefined) {
          return
        }
        // ff: team-management-web-accts-5535-performance-improvements
        if (showPerfImprovesFlag) {
          if (member.user?.email === trimmedEmail) {
            alreadyMembers.push(trimmedEmail)
          }
          return
        }
        // remove me when showPerfImprovesFlag goes bye bye
        if (member.email === trimmedEmail) {
          alreadyMembers.push(trimmedEmail)
        }
      })
    })

    // if one or more users are already part of the team, show immediately the error -- no need to debounce it
    const alreadyMembersLen = alreadyMembers.length
    if (alreadyMembersLen > 0) {
      setErrorsState(
        `${alreadyMembers.join(', ')} ${pluralize(
          'is',
          alreadyMembersLen
        )} already ${pluralize('member', alreadyMembersLen)} of this team.`
      )
      return
    }

    if (areAllValid) {
      setErrorsState('')
      debouncedError.cancel()
      return
    }
    debouncedError()
  }

  const sendInvites = useCallback(
    (emails: string) => {
      let emailsArray: Array<string> = emails.split(',')

      if (emailsArray.length > 0) {
        emailsArray = emailsArray.map(email => email.trim())
      }

      // send default seat type id if the dropdown is not shown
      const seatTypeId: number | undefined =
        seatTypeState === -1 ? defaultSeatId : seatTypeState
      const role = guestQuery
        ? { id: 5, key: 'guest', role: 'Guest' }
        : { id: 4, key: 'member', role: 'Member' }
      const invitesToSend = emailsArray.map((email: string) => ({
        email,
        role,
        seatTypeID: seatTypeId
      }))

      setLoadingState('loading')
      sendInvitationsRequest({
        invites: invitesToSend,
        onDone: () => {
          setLoadingState('loaded')

          const successMessage =
            emailsArray.length > 1
              ? `Your ${emailsArray.length} invites have been added to the list below`
              : 'Your invite has been added to the list below'

          fetchAllInvitationsRequest({ background: true, force: true })
          navigateInternally('/teams/people/invitations')

          // show the toast after the transition to the Invitations tab
          setTimeout(() => {
            setLoadingState('initial')
            successToast(successMessage)
          }, DIALOG_CLOSE_DELAY)
        },
        onError: () => {
          setLoadingState('initial')
          errorToast('There was a problem sending your invitations. Please try again.')
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [successToast, errorToast]
  )

  // disable button when:
  // - loading / loaded
  const shouldBlockAction = useMemo(
    () => loadingState === 'loading' || loadingState === 'loaded',
    [loadingState]
  )

  const isValid = () =>
    emailsState.length > 0 &&
    Object.keys(errorsState).length === 0 &&
    ((showSeatType && seatTypeState > 0) || !showSeatType)

  const handleSubmit = () => {
    if (!isValid()) {
      return
    }

    // if there's a blank space at the end of the string, it would replace it with a `,`
    let emails = emailsState.trim()
    // before submitting, add commas in when the emails are separated by spaces
    if (isSpaceSeparated(emails)) {
      emails = emails.replace(' ', ',')
    }

    sendInvites(emails)
    trackPeopleInviteSelected()
  }

  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { value } = e.target as HTMLInputElement

    setEmailsState(value)
    validateForm(value)
  }

  const positiveButtonText = () => {
    switch (loadingState) {
      case 'loading': {
        return <LoadingDots color="white" />
      }
      default: {
        return 'Invite'
      }
    }
  }

  const title = `Invite ${guestQuery ? 'guests' : 'members'} to your team`
  const subtitle = guestQuery
    ? 'Guests can only access documents and spaces they are invited to'
    : 'Members can view all open documents and spaces'

  return (
    <CustomDialog
      aria-label="Invite members or guests to your team"
      maxWidth={510}
      closeOnEsc
      closeOnOverlay
      onRequestClose={() => onClose()}
      onRequestNegative={() => onClose()}
      disableAutofocus
      open={isOpen}
      negativeText="Close"
      negativeDisabled={false}
      positiveText={positiveButtonText() as string}
      positiveDisabled={shouldBlockAction || !isValid()}
      onRequestPositive={() => handleSubmit()}
      onAfterClose={() => trackPeopleInviteClosed()}
    >
      <Wrapper>
        <Text className="title" order="subtitle" size="larger">
          {title}
        </Text>
        <Text
          className="subtitle"
          order="body"
          color="text-light"
          style={{ paddingLeft: '16px', paddingRight: '16px' }}
        >
          {subtitle}
        </Text>
        <StyledForm>
          <Label htmlFor="invite-emails">Emails</Label>
          <Textarea
            id="invite-emails"
            label="Emails"
            aria-label="invite-emails"
            placeholder="terry@widgetco.com, suzie@widgetco.com"
            autoFocus={!token}
            value={emailsState}
            onChange={e => handleChange(e)}
            data-component="invite-names-input"
            inputStatus={errorsState ? 'danger' : undefined}
          />

          {errorsState ? (
            <Text className="footer" order="body" color="danger" size="smallest" align="left">
              {errorsState}
            </Text>
          ) : (
            <Text
              className="footer"
              order="body"
              color="text-lightest"
              size="smallest"
              align="left"
            >
              Add one or more emails, separated by either commas or spaces
            </Text>
          )}

          {showSeatType && (
            <>
              <Label htmlFor="choose-seat-type">Seat type</Label>
              <SearchableSeatType
                id="choose-seat-type"
                onSelect={(option: SeatType) => setSeatTypeState(option?.seatTypeId)}
              />
            </>
          )}
        </StyledForm>
      </Wrapper>
    </CustomDialog>
  )
}

const Wrapper = styled.div`
  text-align: center;

  .title {
    padding-top: ${({ theme }) => theme.spacing.xs};
    padding-bottom: ${({ theme }) => theme.spacing.xs};
  }

  .subtitle {
    padding-bottom: ${({ theme }) => theme.spacing.m};
  }

  .footer {
    margin-top: ${({ theme }) => theme.spacing.xxs};
    margin-bottom: ${({ theme }) => theme.spacing.m};
  }

  textarea {
    resize: none;
  }
`

const StyledForm = styled.form`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: left;

  textarea::placeholder {
    color: #a7aab2; /* ${({ theme }) => theme.palette.structure.lighter}; */
  }
`

export default InviteDialog
