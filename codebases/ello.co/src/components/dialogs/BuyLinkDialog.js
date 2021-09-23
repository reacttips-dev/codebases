import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { trackEvent } from '../../actions/analytics'
import { dialogStyle as baseDialogStyle } from './Dialog'
import TextControl from '../forms/TextControl'
import { isValidURL } from '../forms/Validators'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { css, disabled, focus, hover, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const dialogStyle = css(s.fullWidth, { maxWidth: 440 })
const headingStyle = css(s.mb30, s.fontSize24)
const buttonHighlightStyle = css(s.colorWhite, s.bgc6, { borderColor: '#666' })
const buttonStyle = css(
  {
    width: 100,
    height: 50,
    lineHeight: '50px',
    padding: '0 20px',
    borderRadius: 5,
  },
  s.fontSize14,
  s.colorA,
  s.center,
  { transition: `background-color 0.2s ${s.ease}, border-color 0.2s ${s.ease}, color 0.2s ${s.ease}, width 0.2s ${s.ease}` },
  disabled(s.pointerNone, s.color6, s.bgcA),
  focus(buttonHighlightStyle),
  hover(buttonHighlightStyle),
)
const submitButtonStyle = css(s.mr10, s.colorWhite, s.bgcGreen)
const removeButtonStyle = css(s.mr10, s.colorWhite, s.bgcA)


// TODO: Move this out to FormControls
const controlStyle = css(
  select('& .FormControlInput.isBoxControl', { height: 50, padding: '0 35px 0 10px' }),
  select('& .FormControlStatus.isBoxControl', { top: 11 }),
)

export default class BuyLinkDialog extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
    editorType: PropTypes.string.isRequired,
    text: PropTypes.string,
  }

  static defaultProps = {
    dispatch: null,
    text: null,
  }

  componentWillMount() {
    this.value = this.props.text
    this.state = { status: STATUS.INDETERMINATE }
    this.updateStatus({ buyLink: this.value || '' })
  }

  onClickSubmit = () => {
    if (this.value.indexOf('http') !== 0) {
      this.value = `http://${this.value}`
    }
    if (this.props.editorType === 'Comment') {
      this.props.dispatch(trackEvent('buy-link-added-to-comment'))
    }
    this.props.onConfirm({ value: this.value })
  }

  onClickReset = () => {
    if (this.props.editorType === 'Comment') {
      this.props.dispatch(trackEvent('buy-link-removed-from-comment'))
    }
    this.props.onConfirm({ value: null })
  }

  onChangeControl = ({ buyLink }) => {
    this.updateStatus({ buyLink })
    this.value = buyLink
  }

  updateStatus({ buyLink }) {
    const isValid = isValidURL(buyLink)
    const { urlStatus } = this.state
    if (isValid && urlStatus !== STATUS.SUCCESS) {
      this.setState({ urlStatus: STATUS.SUCCESS })
    } else if (!isValid && urlStatus !== STATUS.INDETERMINATE) {
      this.setState({ urlStatus: STATUS.INDETERMINATE })
    }
  }

  render() {
    const { onDismiss, text } = this.props
    const { urlStatus } = this.state
    return (
      <div className={`${baseDialogStyle} ${dialogStyle}`}>
        <h2 className={headingStyle}>Sell your work</h2>
        <TextControl
          autoFocus
          classList={`isBoxControl ${controlStyle}`}
          id="buyLink"
          name="buy[productDetail]"
          onChange={this.onChangeControl}
          placeholder="Product detail URL"
          status={urlStatus}
          tabIndex="1"
          text={text}
        />
        <button
          className={`${buttonStyle} ${submitButtonStyle}`}
          onClick={this.onClickSubmit}
          disabled={!(urlStatus === STATUS.SUCCESS)}
        >
          {text && text.length ? 'Update' : 'Submit'}

        </button>
        {text && text.length ?
          <button
            className={`${buttonStyle} ${removeButtonStyle}`}
            onClick={this.onClickReset}
          >
            Remove
          </button> :
          null
        }
        <button className={buttonStyle} onClick={onDismiss}>Cancel</button>
      </div>
    )
  }
}

