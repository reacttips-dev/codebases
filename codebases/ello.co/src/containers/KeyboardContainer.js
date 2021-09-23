import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Mousetrap from 'mousetrap'
import { openModal, closeModal } from '../actions/modals'
import HelpDialog from '../components/dialogs/HelpDialog'
import { SET_LAYOUT_MODE } from '../constants/action_types'
import { SHORTCUT_KEYS } from '../constants/application_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDiscoverKeyType, selectIsGridMode } from '../selectors/gui'
import { selectIsModalActive } from '../selectors/modal'

function mapStateToProps(state) {
  return {
    discoverKeyType: selectDiscoverKeyType(state),
    isGridMode: selectIsGridMode(state),
    isLoggedIn: selectIsLoggedIn(state),
    isModalActive: selectIsModalActive(state),
  }
}

class KeyboardContainer extends Component {
  static propTypes = {
    discoverKeyType: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isModalActive: PropTypes.bool.isRequired,
    shortcuts: PropTypes.object,
  }

  static defaultProps = {
    discoverKeyType: null,
    shortcuts: {
      [SHORTCUT_KEYS.ARTIST_INVITES]: '/creative-briefs',
      [SHORTCUT_KEYS.DISCOVER]: '/discover',
      [SHORTCUT_KEYS.EDITORIAL]: '/',
      [SHORTCUT_KEYS.FOLLOWING]: '/following',
      [SHORTCUT_KEYS.SEARCH]: '/search',
      [SHORTCUT_KEYS.NOTIFICATIONS]: '/notifications',
    },
  }

  componentDidMount() {
    this.bindMousetrap()
    Mousetrap.bind(SHORTCUT_KEYS.TOGGLE_LAYOUT, () => {
      const { dispatch, isGridMode } = this.props
      const newMode = isGridMode ? 'list' : 'grid'
      dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
    })
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidUpdate() {
    this.bindMousetrap()
  }

  componentWillUnmount() {
    this.unbindMousetrap()
    Mousetrap.unbind(SHORTCUT_KEYS.TOGGLE_LAYOUT)
  }

  bindMousetrap() {
    const { isLoggedIn, shortcuts, dispatch } = this.props
    if (isLoggedIn && !this.mousetrapBound) {
      this.mousetrapBound = true

      Mousetrap.bind(Object.keys(shortcuts), (event, shortcut) => {
        if (shortcut === SHORTCUT_KEYS.DISCOVER) {
          const { discoverKeyType } = this.props
          const location = discoverKeyType || '/discover'
          dispatch(push(location))
        } else {
          dispatch(push(shortcuts[shortcut]))
        }
      })

      Mousetrap.bind(SHORTCUT_KEYS.HELP, () => {
        const { isModalActive } = this.props
        if (isModalActive) {
          dispatch(closeModal())
          return
        }
        dispatch(openModal(<HelpDialog />))
      })
    }
  }

  unbindMousetrap() {
    const { isLoggedIn, shortcuts } = this.props
    if (isLoggedIn && this.mousetrapBound) {
      this.mousetrapBound = false
      Mousetrap.unbind(Object.keys(shortcuts))
      Mousetrap.unbind(SHORTCUT_KEYS.HELP)
    }
  }

  render() {
    return null
  }

}

export default connect(mapStateToProps)(KeyboardContainer)

