import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Alert, Text, Button, Toggle, Spaced, LoadingDots } from '@invisionapp/helios'
import ModalContent from '../Modal/ModalContent'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import NumericSelect from '../forms/NumericSelect'
import Heading from '../modals/Heading'
import SubHeading from '../modals/SubHeading'
import Wrapper from '../modals/Wrapper'
import { showFlash } from '../../stores/flash'
import { teamSettingsUpdate, selectSettings } from '../../stores/team'
import api from '../../api/index'
import { REQUEST_FAILED } from '../../helpers/errorMessages'
import { DEFAULT_PASSWORD_LENGTH } from '../../constants'
import {
  trackSettingsPasswordsClosed,
  trackSettingsPasswordsFailed,
  trackSettingsPasswordsUpdated
} from '../../helpers/analytics'

class PasswordRequirementsModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false,
      isPristine: true,
      isUpdating: false,
      enablePasswordComplexity: false,
      enablePasswordExpiration: false,
      enablePreventPasswordReuse: false,
      minimumPasswordLength: '',
      passwordExpirationDays: '',
      rememberNumPasswords: '',
      errorMessage: null,
      ...props.initialState,
      initialState: { ...props.initialState }
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    // New way to track initial state
    this.setState(state => ({
      initialState: { ...props.initialState },
      ...(state.isPristine ? { ...props.initialState } : {})
    }))

    if (!this.state.isLoaded) {
      return this.setState({
        isLoaded: props.data.isLoaded
      })
    }
    if (props.data.isUpdating !== this.props.data.isUpdating) {
      return this.setState(state => ({
        ...state,
        isUpdating: props.data.isUpdating
      }))
    }
    return null
  }

  setError = error => {
    let errorMessage

    switch (error.response?.status) {
      case 403: {
        errorMessage = 'You do not have permission to change this setting'
        break
      }
      default: {
        errorMessage = REQUEST_FAILED
      }
    }

    this.setState({ errorMessage })
  }

  toggleComplexity = () => {
    this.setState(state => ({
      enablePasswordComplexity: !state.enablePasswordComplexity,
      isPristine: false
    }))
  }

  toggleExpiration = () => {
    this.setState(state => ({
      enablePasswordExpiration: !state.enablePasswordExpiration,
      isPristine: false
    }))
  }

  toggleRemember = () => {
    this.setState(state => ({
      enablePreventPasswordReuse: !state.enablePreventPasswordReuse,
      isPristine: false
    }))
  }

  activeStateChanged() {
    const { initialState } = this.state

    return (
      this.state.enablePasswordComplexity !== initialState.enablePasswordComplexity ||
      this.state.enablePasswordExpiration !== !!initialState.enablePasswordExpiration ||
      this.state.enablePreventPasswordReuse !== !!initialState.enablePreventPasswordReuse ||
      this.state.minimumPasswordLength !== initialState.minimumPasswordLength ||
      this.state.passwordExpirationDays !== initialState.passwordExpirationDays ||
      this.state.rememberNumPasswords !== initialState.rememberNumPasswords
    )
  }

  isFormDisabled = () => {
    if (this.state.isUpdating || this.state.isPristine) {
      return true
    }

    return !this.activeStateChanged()
  }

  editField = (fieldName, fieldValue) => {
    const newState = {}
    newState[fieldName] = fieldValue
    this.setState({
      ...newState,
      isPristine: false
    })
  }

  handleClosePortal = () => {
    trackSettingsPasswordsClosed()
    this.props.closePortal()
  }

  handleSubmit = e => {
    const {
      enablePasswordComplexity,
      enablePasswordExpiration,
      enablePreventPasswordReuse,
      minimumPasswordLength,
      passwordExpirationDays,
      rememberNumPasswords
    } = this.state
    e.preventDefault()

    if (!this.isFormDisabled()) {
      const settings = {
        enablePasswordComplexity,
        enablePasswordExpiration,
        enablePreventPasswordReuse,
        minimumPasswordLength,
        passwordExpirationDays,
        rememberNumPasswords
      }

      this.props
        .save(settings)
        .then(() => {
          trackSettingsPasswordsUpdated(this.props.initialState, settings)
          this.props.teamSettingsUpdate(settings)
          this.props.notifySuccess('Your password requirements settings have been saved.')
          this.props.closePortal()
        })
        .catch(error => {
          trackSettingsPasswordsFailed()
          this.props.notifyError('There was a problem saving your settings. Please try again.')
          this.setError(error)
        })
    }
  }

  render() {
    const { isVisible, data } = this.props

    return (
      <ModalContent
        closePortal={this.handleClosePortal}
        closeWarning={<ModalCloseWarning />}
        isVisible={isVisible}
        showWarning={!this.isFormDisabled()}
      >
        <Wrapper>
          <Heading order="title" size="smaller" color="text-darker">
            Password requirements
          </Heading>
          <SubHeading order="subtitle">
            Set and manage your teamʼs policy requirements
          </SubHeading>

          {data.updateFailure && (
            <NotificationWrapper status="danger">{REQUEST_FAILED}</NotificationWrapper>
          )}

          <FormContainer onSubmit={this.handleSubmit}>
            <Row border>
              <Text order="subtitle" size="smaller">
                Minimum password length
              </Text>
              <NumericSelect
                id="minimumPasswordLength"
                value={this.state.minimumPasswordLength || ''}
                min={DEFAULT_PASSWORD_LENGTH}
                max={32}
                onChange={value => this.editField('minimumPasswordLength', value)}
              />
            </Row>
            <Row border>
              <Toggle
                id="complexity"
                className="toggle"
                checked={!!this.state.enablePasswordComplexity}
                onChange={this.toggleComplexity}
              >
                <Text order="subtitle" size="smaller">
                  Enforce password complexity
                  <Text order="body" size="smaller">
                    Require an uppercase, lowercase, and numerical character.
                  </Text>
                </Text>
              </Toggle>
            </Row>
            <Row border>
              <Toggle
                id="expiration"
                className="toggle"
                onChange={this.toggleExpiration}
                checked={!!this.state.enablePasswordExpiration}
              >
                <Text order="subtitle" size="smaller">
                  Enable password expiration
                </Text>
              </Toggle>
            </Row>
            <Row
              data-test-selector="expirationDays"
              disabled={!this.state.enablePasswordExpiration}
            >
              <Text order="subtitle" size="smaller">
                Specify number of days
              </Text>
              <NumericSelect
                id="passwordExpirationDays"
                value={this.state.passwordExpirationDays || ''}
                placeholder={90}
                min={1}
                max={90}
                onChange={value => this.editField('passwordExpirationDays', value)}
              />
            </Row>
            <Row border>
              <Toggle
                id="isrememberNumPasswords"
                className="toggle"
                onChange={this.toggleRemember}
                checked={!!this.state.enablePreventPasswordReuse}
              >
                <Text order="subtitle" size="smaller">
                  Prevent password reuse
                </Text>
              </Toggle>
            </Row>
            <Row disabled={!this.state.enablePreventPasswordReuse}>
              <Text order="subtitle" size="smaller">
                Number of passwords to remember
              </Text>
              <NumericSelect
                id="rememberNumPasswords"
                value={this.state.rememberNumPasswords || ''}
                min={1}
                max={5}
                onChange={value => this.editField('rememberNumPasswords', value)}
              />
            </Row>

            <Row border centered>
              <Spaced top="l">
                <Button
                  type="submit"
                  order="primary"
                  size="larger"
                  disabled={this.isFormDisabled()}
                >
                  {this.state.isUpdating ? <CenteredLoadingDots color="white" /> : 'Update'}
                </Button>
              </Spaced>
            </Row>
          </FormContainer>
        </Wrapper>
      </ModalContent>
    )
  }
}

const CenteredLoadingDots = styled(LoadingDots)`
  margin: 0 auto;
`

const NotificationWrapper = styled(Alert)`
  margin-top: ${props => props.theme.spacing.xl};
  margin-bottom: -20px;
`

const FormContainer = styled.form`
  width: 97%;
  max-width: 540px;
  margin: ${({ theme }) => theme.spacing.xl} auto 0;

  .Select-value-label {
    padding-left: 6px; /* this is 6 pixels to make up for the 10px padding in element */
  }

  .Select-option {
    padding-left: 16px;
  }
`

const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${props => (props.centered ? 'center' : ' space-between')};
  padding: ${({ theme }) => theme.spacing.s};
  border-top: ${props =>
    props.border ? `1px solid ${props.theme.palette.structure.lighter}` : 'none'};
  cursor: pointer;
  ${props =>
    props.disabled
      ? `::after {
      background: white;
      opacity: .5;
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      cursor: not-allowed;
    }
  `
      : ''};
`

const mapStateToProps = state => {
  const settings = selectSettings(state)

  return {
    data: {
      isLoaded: settings.isLoaded,
      isUpdating: settings.isUpdating,
      updateFailure: settings.updateFailure
    },
    initialState: {
      enablePasswordComplexity: settings.data.enablePasswordComplexity,
      enablePasswordExpiration: settings.data.enablePasswordExpiration,
      enablePreventPasswordReuse: settings.data.enablePreventPasswordReuse,
      minimumPasswordLength: settings.data.minimumPasswordLength,
      passwordExpirationDays: settings.data.passwordExpirationDays,
      rememberNumPasswords: settings.data.rememberNumPasswords
    },
    save(settings) {
      return api.post('team/settings/password', null, settings)
    }
  }
}

const mapDispatchToProps = dispatch => ({
  teamSettingsUpdate: settings => dispatch(teamSettingsUpdate(settings)),
  notifySuccess(message) {
    dispatch(showFlash({ message, status: 'success' }))
  },
  notifyError(message) {
    dispatch(showFlash({ message, status: 'danger' }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PasswordRequirementsModal)
