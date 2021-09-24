import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { trackEvent } from '../actions/analytics'
import { inviteUsers } from '../actions/invitations'
import BatchEmailControl from '../components/forms/BatchEmailControl'
import FormButton from '../components/forms/FormButton'
import { getBatchEmailState } from '../components/forms/Validators'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'
import { invite } from '../networking/api'
import { selectPathname } from '../selectors/routing'
import * as s from '../styles/jso'
import { css, parent } from '../styles/jss'

const suggestionStyle = css(
  s.colorA,
  { maxWidth: 'calc(100% - 120px)' },
  parent('.Editorial .InvitationForm', { height: 42 }),
)

function mapStateToProps(state) {
  return {
    pathname: selectPathname(state),
  }
}

class InvitationFormContainer extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    inEditorial: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
  }

  static defaultProps = {
    inEditorial: false,
  }

  componentWillMount() {
    this.state = {
      formStatus: STATUS.INDETERMINATE,
      batchEmailState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.batchEmailValue = []
  }

  onChangeControl = ({ emails }) => {
    this.batchEmailValue = emails.split(/[,\s]+/)
    const { batchEmailState } = this.state
    const currentStatus = batchEmailState.status
    const newState = getBatchEmailState({ value: emails, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ batchEmailState: newState })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { batchEmailState } = this.state
    if (batchEmailState.status !== STATUS.SUCCESS) {
      this.setState({ formStatus: STATUS.FAILURE })
      return
    }
    const { dispatch, pathname } = this.props
    this.control.clear()
    dispatch(inviteUsers(this.batchEmailValue))
    this.setState({ formStatus: STATUS.SUBMITTED })
    if (/\/onboarding\/invitations/.test(pathname) &&
        this.batchEmailValue.every(email => email.length > 0)) {
      dispatch(trackEvent('Onboarding.Invitations.Emails.Completed',
        { emails: this.batchEmailValue.length }))
    }
    // set form back to initial state
    setTimeout(() => {
      this.setState({ formStatus: STATUS.INDETERMINATE })
    }, 2000)
  }

  renderMessage() {
    const { formStatus } = this.state
    switch (formStatus) {
      case STATUS.SUBMITTED:
        return 'Your invitations have been sent.'
      case STATUS.FAILURE:
        return 'There was an error submitting that form. Please contact support.'
      case STATUS.SUCCESS:
      case STATUS.INDETERMINATE:
      default:
        return (
          'Invite as many people as you want, just separate their email addresses with commas.'
        )
    }
  }

  render() {
    const { inEditorial } = this.props
    const { batchEmailState } = this.state
    const isValid = batchEmailState.status === STATUS.SUCCESS
    const buttonClassNames = inEditorial ?
      'FormButton isRounded isGreen' :
      'FormButton isAutoSize isOutlined isRounded'

    return (
      <div className="InvitationsForm">
        <form
          action={invite().path}
          method="POST"
          noValidate="novalidate"
          onSubmit={this.onSubmit}
        >
          <BatchEmailControl
            classList="isBoxControl onGrey"
            label={`Emails ${batchEmailState.message}`}
            onChange={this.onChangeControl}
            tabIndex="1"
            ref={(comp) => { this.control = comp }}
          />
          <p className={suggestionStyle}>
            {this.renderMessage()}
          </p>
          <FormButton
            className={buttonClassNames}
            disabled={!isValid}
            tabIndex="2"
          >
            Invite
          </FormButton>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps)(InvitationFormContainer)

