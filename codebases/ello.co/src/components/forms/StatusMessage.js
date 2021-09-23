// StatusMessage --------------------------------------------------------------------------

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const statusMessageStyle = css(
  s.colorGreen,
  s.transitionOpacity,
  { opacity: 1 },

  select('&.transition',
    s.transitionOpacity,
  ),
  select('&.hide',
    { opacity: 0 },
  ),
)

const propTypes = {
  children: PropTypes.node.isRequired,
  onHideCallback: PropTypes.func,
}

const defaultProps = {
  onHideCallback: null,
}

class StatusMessage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      enter: false,
      hide: false,
    }
    this.showMessage = this.showMessage.bind(this)
    this.hideMessage = this.hideMessage.bind(this)
  }

  componentDidMount() {
    if (!this.state.enter) {
      this.showMessageTimeout = setTimeout(this.showMessage, 10)
    }

    this.hideMessageTimeout = setTimeout(this.hideMessage, 1750)
  }

  componentWillUnmount() {
    if (this.showMessageTimeout) { clearTimeout(this.showMessageTimeout) }
    if (this.hideMessageTimeout) { clearTimeout(this.hideMessageTimeout) }
    if (this.messageCompletionTimeout) { clearTimeout(this.messageCompletionTimeout) }
  }

  showMessage() {
    this.setState({
      enter: true,
    })
  }

  hideMessage() {
    this.setState({
      hide: true,
    })

    if (this.props.onHideCallback) {
      // tell the parent the message is done
      this.messageCompletionTimeout = setTimeout(() => this.props.onHideCallback(), 550)
    }
  }

  render() {
    const { hide, reset } = this.state
    const fadeOut = hide && !reset
    const hidden = hide && reset

    const classNames = `status-msg${fadeOut ? ' hide transition' : ''}${hidden ? ' hide' : ''} ${statusMessageStyle}`

    return (
      <p className={classNames}>
        {this.props.children}
      </p>
    )
  }
}

StatusMessage.propTypes = propTypes
StatusMessage.defaultProps = defaultProps

export default StatusMessage
