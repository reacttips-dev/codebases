import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import { closeOmnibar } from '../actions/omnibar'
import { Omnibar } from '../components/omnibar/Omnibar'
import { SHORTCUT_KEYS } from '../constants/application_types'
import { selectAvatar } from '../selectors/profile'

export function mapStateToProps(state) {
  return {
    avatar: selectAvatar(state),
    classList: state.omnibar.get('classList'),
    isActive: state.omnibar.get('isActive'),
  }
}

class OmnibarContainer extends Component {
  static propTypes = {
    avatar: PropTypes.object,
    classList: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    avatar: null,
    classList: null,
  }

  componentWillMount() {
    this.state = {
      isFullScreen: false,
    }
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.FULLSCREEN, () => { this.onToggleFullScreen() })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(nextProps.avatar, this.props.avatar) ||
      ['classList', 'isActive'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      ['isFullScreen'].some(prop =>
        nextState[prop] !== this.state[prop],
      )
  }

  componentDidUpdate() {
    const { isActive } = this.props
    if (isActive) {
      document.body.classList.add('isOmnibarActive')
    } else if (!isActive) {
      document.body.classList.remove('isOmnibarActive')
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.FULLSCREEN)
  }

  onToggleFullScreen = () => {
    const { isFullScreen } = this.state
    this.setState({ isFullScreen: !isFullScreen })
  }

  onClickCloseOmnibar = () => {
    const { isActive, dispatch } = this.props
    if (isActive) {
      dispatch(closeOmnibar())
    }
  }

  render() {
    const { avatar, classList, isActive } = this.props
    const { isFullScreen } = this.state
    const elementProps = { avatar, classList, isActive, isFullScreen }
    return <Omnibar {...elementProps} onClickCloseOmnibar={this.onClickCloseOmnibar} />
  }
}

export default connect(mapStateToProps)(OmnibarContainer)

