import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Spaced, Button, Input, LoadingDots } from '@invisionapp/helios'
import ModalContent from '../Modal/ModalContent'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import ModalNotification from '../modals/components/ModalNotification'
import Heading from '../modals/Heading'
import Wrapper from '../modals/Wrapper'
import ToggleContent from '../ToggleContent'
import api from '../../api/index'
import { teamSettingsUpdate } from '../../stores/team'
import { showFlash } from '../../stores/flash'
import { REQUEST_FAILED } from '../../helpers/errorMessages'
import {
  trackSettingsTimingoutClosed,
  trackSettingsTimingoutFailed,
  trackSettingsTimingoutSuccess
} from '../../helpers/analytics'

const DEFAULT_TIMEOUT = 30
const TIMEOUT_MIN = 15
const TIMEOUT_MAX = 9999

/*
  Sometimes the timeout is greater than the max as a result of relics left over from
  past default values. This makes sure that the user never sees that value. This isn't
  permanent, just for now as of 3/23/2018.
*/
const normalizeState = state => {
  let sessionInactivityTimeout = state.sessionInactivityTimeout || DEFAULT_TIMEOUT

  if (sessionInactivityTimeout > TIMEOUT_MAX) {
    sessionInactivityTimeout = DEFAULT_TIMEOUT
  }

  return {
    ...state,
    sessionInactivityTimeout
  }
}

class SessionTimeoutsModal extends React.Component {
  static defaultProps = {
    initialState: {
      sessionTimeoutRequired: false,
      sessionInactivityTimeout: DEFAULT_TIMEOUT
    }
  }

  constructor(props) {
    super(props)

    const initialState = normalizeState(props.initialState)

    this.state = {
      initialState: { ...initialState },
      ...{ ...initialState },
      errorMessage: null,
      saving: false
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const initialState = normalizeState(nextProps.initialState)

    this.setState({
      initialState: { ...initialState },
      // Only update internal state if the intenral state has not yet been changed
      ...(!this.didValuesChange() ? { ...initialState } : {})
    })
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

    this.setState({ errorMessage, saving: false })
  }

  timeoutInputRef = null

  handleToggle = sessionTimeoutRequired => {
    this.focusTimeoutInput(sessionTimeoutRequired)
    this.setState({ sessionTimeoutRequired })
  }

  didActiveStateChange() {
    return this.state.sessionTimeoutRequired !== this.state.initialState.sessionTimeoutRequired
  }

  didTimeoutChange() {
    return (
      this.state.sessionInactivityTimeout !== this.state.initialState.sessionInactivityTimeout
    )
  }

  didValuesChange() {
    return this.didTimeoutChange() || this.didActiveStateChange()
  }

  isTimeoutValid() {
    const timeout = this.state.sessionInactivityTimeout || 0
    return timeout >= TIMEOUT_MIN && timeout <= TIMEOUT_MAX
  }

  isFormEnabledAfterActiveChanged() {
    return this.isTimeoutValid()
  }

  isFormEnabledWithNoActiveChanged() {
    return this.state.sessionTimeoutRequired
      ? this.didTimeoutChange() && this.isTimeoutValid()
      : false
  }

  isFormEnabled() {
    return !this.state.saving && this.didActiveStateChange()
      ? this.isFormEnabledAfterActiveChanged()
      : this.isFormEnabledWithNoActiveChanged()
  }

  focusTimeoutInput(nextActive) {
    // Only focus element if it was initally inactive and then made active
    if (
      !this.state.initialState.sessionTimeoutRequired &&
      nextActive &&
      this.timeoutInputRef
    ) {
      this.timeoutInputRef.select()
    }
  }

  handleTimeoutInputChange = e => {
    this.setState({ sessionInactivityTimeout: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()

    const settings = {
      sessionTimeoutRequired: this.state.sessionTimeoutRequired,
      sessionInactivityTimeout: Number(this.state.sessionInactivityTimeout)
    }

    if (this.isFormEnabled()) {
      this.setState({ saving: true })
      this.props
        .save(settings)
        .then(() => {
          trackSettingsTimingoutSuccess()
          this.props.sessionTimeoutsUpdate(settings)
          this.props.notifySuccess('Your session timeouts settings have been saved.')
          this.props.closePortal()
        })
        .catch(error => {
          trackSettingsTimingoutFailed()
          this.props.notifyError('There was a problem saving your settings. Please try again.')
          this.setError(error)
        })
    }
  }

  handleClosePortal = () => {
    trackSettingsTimingoutClosed()
    this.props.closePortal()
  }

  render() {
    const { isVisible } = this.props

    return (
      <StyledModalContent
        closePortal={this.handleClosePortal}
        closeWarning={<ModalCloseWarning />}
        isVisible={isVisible}
        showWarning={this.isFormEnabled()}
      >
        <Wrapper>
          <StyledHeading order="title" size="smaller" color="text-darker">
            Timing out
          </StyledHeading>

          {this.state.errorMessage && (
            <ModalNotification status="danger">{this.state.errorMessage}</ModalNotification>
          )}

          <FormContainer onSubmit={this.handleSubmit}>
            <Row border>
              <ToggleContent
                label="Time out sessions when members are inactive"
                id="toggle-timeout-sessions"
                isOpen={this.state.sessionTimeoutRequired}
                onToggle={this.handleToggle}
              >
                <StyledLabel htmlFor="session-timeout-length">
                  Number of minutes until members are signed out (at least 15)
                  <StyledInput
                    id="session-timeout-length"
                    compact
                    inputRef={input => {
                      this.timeoutInputRef = input
                    }}
                    value={this.state.sessionInactivityTimeout || ''}
                    onChange={this.handleTimeoutInputChange}
                    maxLength={4}
                  />
                </StyledLabel>
              </ToggleContent>
            </Row>
            <Row centered border>
              <Spaced top="l">
                <Button
                  type="submit"
                  order="primary"
                  size="larger"
                  disabled={!this.isFormEnabled()}
                >
                  {this.state.saving ? <CenteredLoadingDots color="white" /> : 'Update'}
                </Button>
              </Spaced>
            </Row>
          </FormContainer>
        </Wrapper>
      </StyledModalContent>
    )
  }
}

const CenteredLoadingDots = styled(LoadingDots)`
  margin: 0 auto;
`

const StyledHeading = styled(Heading)`
  margin-bottom: ${props => props.theme.spacing.xl};
`

const Row = styled.div`
  ${props => (props.centered ? 'text-align: center;' : '')};
  position: relative;
  border-top: ${props =>
    props.border ? `1px solid ${props.theme.palette.structure.lighter}` : 'none'};
`

const StyledModalContent = styled(ModalContent)`
  .modal-content {
    display: block;
  }
`

const FormContainer = styled.form`
  width: 97%;
  max-width: 540px;
  margin: 0 auto;
`

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.s};
  padding-bottom: ${props => props.theme.spacing.m};
`

const StyledInput = styled(Input)`
  width: ${props => props.theme.spacing.xxl};
  text-align: center;
`

const mapStateToProps = state => ({
  initialState: {
    sessionTimeoutRequired: state.team?.settings?.sessionTimeoutRequired,
    sessionInactivityTimeout: state.team?.settings?.sessionInactivityTimeout
  },

  save(settings) {
    return api.post('team/settings/session-timeouts', null, settings)
  }
})

const mapDispatchToProps = dispatch => ({
  sessionTimeoutsUpdate: settings => dispatch(teamSettingsUpdate(settings)),
  notifySuccess(message) {
    dispatch(showFlash({ message, status: 'success' }))
  },
  notifyError(message) {
    dispatch(showFlash({ message, status: 'danger' }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SessionTimeoutsModal)
