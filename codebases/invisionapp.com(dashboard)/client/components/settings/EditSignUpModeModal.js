import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Text, Button, Radio, Checkbox, LoadingDots } from '@invisionapp/helios'
import Wrapper from '../modals/components/Wrapper'
import ModalContent from '../Modal/ModalContent'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import { fetchSettings } from '../../stores/team'
import { showFlash, hideFlash } from '../../stores/flash'
import Heading from '../modals/Heading'
import SubHeading from '../modals/SubHeading'
import Tooltip from '../Tooltip'
import bffRequest from '../../utils/bffRequest'
import { trackSettingsOpenEnrollmentUpdated } from '../../helpers/analytics'

const SignUpModeInviteOnly = {
  id: 1,
  mode: 'Invite Only'
}
const SignUpModeOpenEnrollment = {
  id: 2,
  mode: 'Open Enrollment'
}

class EditSignUpModeModal extends Component {
  constructor(props) {
    super(props)

    const {
      data: { signUpModeId, approvedDomains }
    } = props

    this.state = {
      hasUnsavedChanges: false,
      signUpMode: signUpModeId,
      approvedDomains,
      loading: false
    }
  }

  // Handle cases where the modal is loaded directly and settinsg haven't been fetched yet
  UNSAFE_componentWillMount() {
    const {
      fetchSettings,
      data: { isLoading, isLoaded }
    } = this.props

    if (!isLoading && !isLoaded) {
      fetchSettings()
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    const {
      data: { signUpModeId, approvedDomains }
    } = props

    if (!this.state.hasUnsavedChanges) {
      this.setState({
        hasUnsavedChanges: false,
        signUpMode: signUpModeId,
        approvedDomains
      })
    }
  }

  handleSignUpModeChange = event => {
    this.setState({
      hasUnsavedChanges: true,
      signUpMode: +event.target.value
    })
  }

  handleApprovedDomainChange = event => {
    this.state.approvedDomains[event.target.value].isActive = event.target.checked
    this.setState(state => ({
      hasUnsavedChanges: true,
      approvedDomains: state.approvedDomains
    }))
  }

  saveSettings = event => {
    event.preventDefault()

    this.setState({ loading: true })
    this.props.hideNotification()

    return this.props
      .updateSettings({
        signUpModeID: this.state.signUpMode,
        approvedDomains: this.state.approvedDomains
      })
      .then(() => {
        this.setState({ loading: false })
        // tracking event
        const oldSetting =
          this.props.data.signUpModeId === 1 ? 'only invited user' : 'everyone'
        const newSetting = this.state.signUpMode === 1 ? 'only invited user' : 'everyone'
        trackSettingsOpenEnrollmentUpdated(oldSetting, newSetting)

        this.props.notifySuccess('Your new members settings have been saved.')
        this.handleClose()
      })
      .catch(() => {
        this.setState({ loading: false })
        this.props.notifyError('There was a problem saving your settings. Please try again.')
      })
  }

  handleClose = () => {
    this.props.fetchSettings()
    this.props.closePortal()
  }

  render() {
    const { closePortal, isVisible, onBack, data } = this.props
    const { signUpMode, approvedDomains } = this.state

    const isSignUpModeInviteOnly = signUpMode === SignUpModeInviteOnly.id
    const isSignUpModeOpenEnrollment = signUpMode === SignUpModeOpenEnrollment.id

    let approvedDomainsSection
    if (isSignUpModeOpenEnrollment) {
      const approvedDomainCheckboxes = []
      for (let i = 0; i < approvedDomains.length; i++) {
        const { domain, isActive } = approvedDomains[i]

        approvedDomainCheckboxes.push(
          <InputWrapper key={domain}>
            <Checkbox
              id={domain}
              checked={isActive}
              value={i}
              onChange={this.handleApprovedDomainChange}
              fullWidth={false}
              unstyled
            >
              {domain}
            </Checkbox>
          </InputWrapper>
        )
      }

      approvedDomainsSection = (
        <div>
          <Text order="subtitle">Approved Domains</Text>
          {approvedDomainCheckboxes}
        </div>
      )
    }

    return (
      <ModalContent
        closePortal={closePortal}
        closeWarning={<ModalCloseWarning />}
        isVisible={isVisible}
        onBack={onBack}
        showWarning={this.state.hasUnsavedChanges}
      >
        <Wrapper>
          <Heading order="title" size="smaller" color="text-darker">
            New Members
          </Heading>
          <SubHeading order="subtitle">Who can join {data.teamName}?</SubHeading>
          <FormContainer>
            <InputWrapper>
              <Radio
                name="signUpMode"
                id="signUpModeInvite"
                value={SignUpModeInviteOnly.id}
                checked={isSignUpModeInviteOnly}
                onChange={this.handleSignUpModeChange}
                fullWidth={false}
                unstyled
              >
                Only people who are invited
              </Radio>
            </InputWrapper>

            <InputWrapper>
              <Radio
                name="signUpMode"
                id="signUpModeEmail"
                value={SignUpModeOpenEnrollment.id}
                checked={isSignUpModeOpenEnrollment}
                onChange={this.handleSignUpModeChange}
                fullWidth={false}
                unstyled
              >
                Anyone with an email address from your team’s selected{' '}
                <Tooltip
                  text="When a new person is invited, we'll add their
                  email domain to your team's approved list, but
                  won't select it"
                  width={190}
                >
                  <UnderlinedText>approved domains</UnderlinedText>
                </Tooltip>
              </Radio>
            </InputWrapper>

            {approvedDomainsSection}

            <ButtonWrapper>
              <Button
                type="submit"
                order="primary"
                size="larger"
                disabled={!this.state.hasUnsavedChanges || this.state.loading}
                onClick={this.saveSettings}
              >
                {this.state.loading ? <StyledLoadingDots color="white" /> : 'Update'}
              </Button>
            </ButtonWrapper>
          </FormContainer>
        </Wrapper>
      </ModalContent>
    )
  }
}

const StyledLoadingDots = styled(LoadingDots)`
  margin: 0 auto;
`
const FormContainer = styled.form`
  width: 97%;
  max-width: 540px;
  margin: 0 auto;
`

const ButtonWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} auto 0;
  text-align: center;
`

const UnderlinedText = styled.span`
  text-decoration: underline;
`

const InputWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.m} 0;
`

const mapStateToProps = ({ team }) => {
  const { settings, name } = team

  return {
    data: {
      signUpModeId: settings.data.signupModeID,
      approvedDomains: settings.data.approvedDomains,
      isLoading: settings.isLoading,
      isLoaded: settings.isLoaded,
      teamName: name
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchSettings: () => {
      dispatch(fetchSettings.request())
    },
    updateSettings(settings) {
      return bffRequest.patch('/teams/api/team/settings', settings)
    },
    notifySuccess(message) {
      dispatch(showFlash({ message, status: 'success' }))
    },
    notifyError(message) {
      dispatch(showFlash({ message, status: 'danger' }))
    },
    hideNotification() {
      dispatch(hideFlash())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSignUpModeModal)
