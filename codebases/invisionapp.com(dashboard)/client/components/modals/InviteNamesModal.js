import React, { Component } from 'react'
import styled from 'styled-components'
import validate from 'validate.js'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import { Text, Button } from '@invisionapp/helios'
import ModalContent from '../Modal/ModalContent'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import Wrapper from './components/Wrapper'
import { invitePeople } from '../../stores/inviteModal'
import { selectTeam } from '../../stores/team'
import {
  trackPeopleInviteViewed,
  trackPeopleInviteClosed,
  trackPeopleInviteSelected
} from '../../helpers/analytics'

import FormInput from '../forms/FormInput'

const validateForm = emailString => {
  const errors = {}
  const constraints = { email: { email: true } }
  let hasInvalidEmail = false

  const emails = emailString
    .split(',')
    .map(s => s.trim())
    .filter(email => !!email)

  emails.forEach(email => {
    const result = validate({ email: email.trim() }, constraints)
    if (result) {
      hasInvalidEmail = email
    }
  })

  if (emails.length < 1) {
    errors.emails = 'Provide a list of collaborators to invite.'
  }

  if (hasInvalidEmail) {
    errors.emails = `Looks like ${hasInvalidEmail} is not a valid email.`
  }

  return errors
}

const EMAIL_VALIDATE_TIMEOUT = 1000

class InviteNamesModal extends Component {
  state = {
    emails: '',
    errors: {},
    touched: false
  }

  componentDidMount() {
    trackPeopleInviteViewed()
  }

  validate = () => {
    this.setState(state => ({ errors: validateForm(state.emails) }))
  }

  debouncedValidate = debounce(() => this.validate(), EMAIL_VALIDATE_TIMEOUT)

  canSubmit() {
    return this.state.emails.length > 0 && Object.keys(this.state.errors).length === 0
  }

  handleSubmit = e => {
    e.preventDefault()

    if (!this.canSubmit()) {
      return
    }

    this.debouncedValidate.cancel()

    this.props.updatePeopleInvitation({
      emails: this.state.emails,
      roleKey: 'member'
    })

    trackPeopleInviteSelected()
    browserHistory.push('/teams/invite/confirm')
  }

  handleBlur = () => {
    this.validate()
  }

  handleChange = e => {
    // NOTE: if the email is valid we want to immediately update the UI. If it's invalid, the
    // validation continues as debounced in the UI

    // Immediate email validation
    const errors = validateForm(e.target.value)
    const isValid = errors.emails === undefined

    if (isValid) {
      this.setState({ errors })
    }

    this.setState({ emails: e.target.value })
    this.debouncedValidate()
  }

  handleClosePortal = () => {
    trackPeopleInviteClosed()
    this.props.closePortal()
  }

  render() {
    const { isVisible, team } = this.props

    return (
      <ModalContent
        closePortal={this.handleClosePortal}
        closeWarning={<ModalCloseWarning />}
        showWarning={!this.canSubmit()}
        isVisible={isVisible}
        backButton={false}
      >
        <Wrapper>
          <StyledHeading
            order="title"
            size="smaller"
            color="text-darker"
            data-component="invite-names-heading"
          >
            Invite people to {team.name}
          </StyledHeading>
          {/* <form onSubmit={handleSubmit(submit.bind(this))}> */}
          <form onSubmit={this.handleSubmit} method="POST">
            <FormInput
              placeholder="terry@widgetco.com, suzie@widgetco.com"
              rows="8"
              tag="textarea"
              hideStatusIcon
              autoFocus
              value={this.state.emails}
              onChange={this.handleChange}
              onFocus={() => this.setState({ touched: true })}
              onBlur={this.handleBlur}
              id="invite-emails"
              meta={{
                error: this.state.errors.emails,
                touched: this.state.touched
              }}
              data-component="invite-names-input"
            />
            <Actions>
              <Button
                type="submit"
                order="primary"
                size="larger"
                disabled={!this.canSubmit()}
                data-component="invite-names-submit"
              >
                Next
              </Button>
            </Actions>
          </form>
        </Wrapper>
      </ModalContent>
    )
  }
}

const StyledHeading = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.l};
  text-align: center;
`

const Actions = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.l};
`

const mapStateToProps = state => ({
  team: selectTeam(state),
  initialValues: {
    emails: ''
  }
})

const mapDisptachToProps = dispatch => ({
  updatePeopleInvitation(payload) {
    dispatch(invitePeople.updatePeople(payload))
  }
})

export default connect(mapStateToProps, mapDisptachToProps)(InviteNamesModal)
