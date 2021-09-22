import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Alert, Text, Button } from '@invisionapp/helios'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import ModalContent from '../Modal/ModalContent'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import { selectInvitationStatus, sendInvitations } from '../../stores/invitations'
import { selectInvitePeople, invitePeople, resetInvitePeople } from '../../stores/inviteModal'
import { selectTeam } from '../../stores/team'
import { showFlash } from '../../stores/flash'
import { selectLocationQuery } from '../../stores/location'
import {
  selectAllowedRoles,
  getRoleNameById,
  selectAllRoles,
  roleTypes
} from '../../stores/roles'
import bffRequest from '../../utils/bffRequest'
import Wrapper from './components/Wrapper'
import InviteModalRow from '../tables/InviteModalRow'
import Loading from '../Loading'
import {
  trackPeopleInviteBack,
  trackPeopleInviteFailed,
  trackPeopleInviteConfirmClosed,
  trackPeopleInviteConfirmSubmitted,
  trackPeopleInviteRemoved,
  trackPeopleInviteRoleToAdmin,
  trackPeopleInviteRoleToGuest,
  trackPeopleInviteRoleToOwner
} from '../../helpers/analytics'
import { SUCCESS_ANIMATION_DURATION } from '../../constants'

function renderRow({ person, roles, onRoleChange, onRemoveInvite, roleName }) {
  return (
    <InviteModalRow
      key={person.email}
      onRemoveInvite={onRemoveInvite}
      onRoleChange={onRoleChange}
      person={person}
      roleName={roleName}
      roles={roles}
    />
  )
}

const getUnsentInvitations = (invitations, invites) => {
  // all people invited
  if (Object.keys(invitations).length === invites.length) {
    return []
  }

  // nobody was invited
  if (invites.length === 0) {
    return Object.keys(invitations)
  }

  // someone was already invited or a team member
  // return an array with their emails
  const notInvited = []
  Object.keys(invitations).forEach(key => {
    const isInvited = invites.some(el => {
      return el.email === key
    })
    if (!isInvited) {
      notInvited.push(key)
    }
  })

  return notInvited
}

class InviteConfirmModal extends PureComponent {
  state = {
    justSentSuccessfully: false,
    invitationsUnsent: [],
    hasSentAnyInvites: false
  }

  componentDidMount() {
    if (this.props.token) {
      bffRequest
        .get('/teams/api/request-access', {
          params: {
            token: this.props.token
          }
        })
        .then(response => {
          const { email } = response.data
          return this.props.confirmInvites({
            emails: email,
            roleKey: 'member'
          })
        })
        .catch(() =>
          this.props.showFlash({
            message: 'There was a problem loading the invites. Please try again.',
            status: 'danger'
          })
        )
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const wasSending = this.props.invitations.isSending
    const notIsSending = !nextProps.invitations.isSending
    const { sendSuccess } = nextProps.invitations
    const totalSuccess = wasSending && notIsSending && sendSuccess
    const failed = wasSending && notIsSending && nextProps.invitations.sendFailure

    if (totalSuccess) {
      const unsent = getUnsentInvitations(
        this.props.people,
        nextProps.invitations.invitesToSend
      )
      this.setState({
        justSentSuccessfully: true,
        invitationsUnsent: unsent,
        hasSentAnyInvites:
          unsent.length > 0 && unsent.length === Object.keys(this.props.people).length
      })

      const invitesSent = Object.keys(this.props.people).length - unsent.length
      // hasSentAnyInvites: tracks if all the people to invite were already team members or invited
      // in other words, if teams-api hasn't sent any invites

      // if all invitations are sent correctly
      // success and autoclose the modal
      if (unsent.length === 0) {
        setTimeout(() => {
          const flashMessage =
            invitesSent > 1
              ? `Your ${invitesSent} invites have been added to the list below`
              : 'Your invite has been added to the list below'

          this.props.closePortal('/teams/people/invitations')
          this.props.showFlash({
            message: flashMessage,
            status: 'success'
          })
        }, SUCCESS_ANIMATION_DURATION)
      }
    } else if (failed) {
      trackPeopleInviteFailed()
    }
  }

  handleRemovePerson = person => {
    trackPeopleInviteRemoved()

    this.props.deleteInvite(person)
    this.props.showFlash({
      message: `Your invitation to ${person.email} has been removed.`,
      status: 'success'
    })
    // removing the last person in the list,
    // will redirect the user to the first step of the invite modal
    if (Object.keys(this.props.people).length === 1) {
      browserHistory.push(this.props.backTo)
    }
  }

  handleClosePortal = closePortal => {
    trackPeopleInviteConfirmClosed()
    closePortal()
    this.props.resetInvites()
  }

  // 'Back' is available only in /confirm
  handleOnBack = () => {
    trackPeopleInviteBack()
    browserHistory.push(this.props.backTo)
    this.props.resetInvites()
  }

  render() {
    const {
      allRoles,
      changeRole,
      closePortal,
      invitations,
      isVisible,
      people,
      roles,
      team
    } = this.props

    const { isSending, sendSuccess, sendFailure } = invitations
    const { justSentSuccessfully, invitationsUnsent, hasSentAnyInvites } = this.state
    const sendInvites = () => {
      trackPeopleInviteConfirmSubmitted()

      const invitesToSend = Object.keys(people).map(key => people[key])

      // NOTE: this code will be removed soon, onDone and onError are not used here,
      // but they are required by the sendInvitations
      return this.props.sendInvites({
        invites: invitesToSend,
        onDone: () => {},
        onError: () => {}
      })
    }

    return (
      <StyledModal
        closePortal={() => this.handleClosePortal(closePortal)}
        closeWarning={<ModalCloseWarning />}
        showWarning
        isVisible={isVisible}
        onBack={this.handleOnBack}
        backButton={!isSending && !justSentSuccessfully}
        closeButton={!isSending && !justSentSuccessfully}
      >
        <StyledWrapper>
          {isSending || justSentSuccessfully ? (
            <div>
              <LoadingContainer>
                <Loading
                  success={sendSuccess}
                  warning={hasSentAnyInvites}
                  textLoading="Spreading the word"
                  textSuccess="Sent! Get ready to design better together"
                  textWarning="Great Minds!"
                  showLogo
                  visible
                />
              </LoadingContainer>

              {/* TODO: This can be passed as subtitleSuccess prop in <Loading> */}
              {sendSuccess && invitationsUnsent.length > 0 && (
                <Info>
                  <Text>
                    {invitationsUnsent.join(', ')}{' '}
                    {invitationsUnsent.length === 1 ? 'has' : 'have'} already been invited or{' '}
                    added to this team.
                  </Text>
                  <SuccessButton size="larger" onClick={closePortal}>
                    Got it
                  </SuccessButton>
                </Info>
              )}
            </div>
          ) : (
            <div>
              <HeadingWrapper>
                <Text
                  order="title"
                  size="smaller"
                  color="text-darker"
                  data-component="invite-confirmation-heading"
                >
                  Invite {Object.keys(people).length}{' '}
                  {Object.keys(people).length === 1 ? 'person' : 'people'} to {team.name}{' '}
                </Text>
              </HeadingWrapper>

              {sendFailure && (
                <Alert status="danger">
                  There was a problem sending your invitations. Please try again.
                </Alert>
              )}
              <InviteTable>
                <TransitionGroup component={React.Fragment}>
                  {people && Object.keys(people).length > 0 ? (
                    Object.keys(people)
                      .filter(key => !!people[key])
                      .map(key => {
                        const person = people[key]

                        return (
                          <CSSTransition
                            classNames="invite-row"
                            timeout={300}
                            key={person.email}
                            data-component="invite-row"
                          >
                            {renderRow({
                              onRemoveInvite: this.handleRemovePerson,
                              onRoleChange: changeRole,
                              person,
                              roles,
                              roleName: getRoleNameById(allRoles, person?.roleID)
                            })}
                          </CSSTransition>
                        )
                      })
                  ) : (
                    <CSSTransition
                      classNames="no-results-row"
                      timeout={0}
                      key="no-results"
                      data-component="no-results-row"
                    >
                      <NoResults colSpan="2">
                        <Text color="text-lightest">No results</Text>
                      </NoResults>
                    </CSSTransition>
                  )}
                </TransitionGroup>
              </InviteTable>
              <Description order="body" size="smaller" color="text-lighter">
                Members can preview and join every open document and space.
                <br />
                Guests can only access the ones they&apos;re invited to.
              </Description>
              <StyledButton
                onClick={sendInvites}
                order="primary"
                size="larger"
                disabled={isSending}
                data-component="invite-confirmation-submit"
              >
                {isSending ? 'Sending...' : 'Invite'}
              </StyledButton>
            </div>
          )}
        </StyledWrapper>
      </StyledModal>
    )
  }
}

const fadeAndCollapseOut = keyframes`
  from {
    max-height: 200px;
    opacity: 1;
    visibility: visible;
  }
  to {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    opacity: 0;
    visibility: hidden;
  }
`

const InviteTable = styled.div`
  .invite-row-exit-active {
    overflow: hidden;
    animation-duration: 300ms;
    animation-name: ${fadeAndCollapseOut};
    animation-timing-function: ${({ theme }) => theme.beziers.inOut};
  }
`

const StyledWrapper = styled(Wrapper)`
  padding-bottom: ${({ theme }) => theme.spacing.xl};
`

const HeadingWrapper = styled.div`
  padding-top: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.l};
  text-align: center;
`

const StyledModal = styled(ModalContent)`
  .modal-content {
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const StyledButton = styled(Button)`
  display: block;
  margin: ${({ theme }) => theme.spacing.l} auto 0;
`

const SuccessButton = styled(Button)`
  display: block;
  margin: ${({ theme }) => theme.spacing.l} auto;
`

const Description = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.l};
  text-align: center;
`

const NoResults = styled.div`
  padding: 12px 0;
  text-align: center;
`

const Info = styled.div`
  position: absolute;
  top: 152px;
  width: 100%;
  text-align: center;
`

const mapStateToProps = state => ({
  backTo: selectLocationQuery('backTo')(state) || '/teams/invite',
  invitations: selectInvitationStatus(state),
  people: selectInvitePeople(state),
  roles: selectAllowedRoles(state),
  allRoles: selectAllRoles(state),
  team: selectTeam(state),
  token: selectLocationQuery('token')(state)
})

const mapDispatchToProps = dispatch => {
  return {
    changeRole: (person, role) => {
      const newPerson = person
      newPerson.role = role

      dispatch(invitePeople.changeRole(newPerson))

      switch (role.id) {
        case roleTypes.ADMIN:
          return trackPeopleInviteRoleToAdmin()
        case roleTypes.GUEST:
          return trackPeopleInviteRoleToGuest()
        case roleTypes.OWNER:
          return trackPeopleInviteRoleToOwner()
        default:
          return null
      }
    },
    confirmInvites: invites => {
      dispatch(invitePeople.updatePeople(invites))
    },
    deleteInvite: person => {
      dispatch(invitePeople.removePerson(person))
    },
    sendInvites: params => {
      dispatch(sendInvitations(params))
    },
    resetInvites() {
      dispatch(resetInvitePeople())
    },
    showFlash: ({ message, status }) => dispatch(showFlash({ message, status }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteConfirmModal)
