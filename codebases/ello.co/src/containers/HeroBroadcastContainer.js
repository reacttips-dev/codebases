import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DISCOVER, FOLLOWING } from '../constants/locales/en'
import {
  setLastDiscoverBeaconVersion,
  setLastFollowingBeaconVersion,
} from '../actions/gui'
import { selectViewNameFromRoute } from '../selectors/routing'
import { selectBroadcast } from '../selectors/gui'
import { HeroBroadcast } from '../components/heros/HeroRenderables'

function mapStateToProps(state, props) {
  return {
    broadcast: selectBroadcast(state, props),
    viewName: selectViewNameFromRoute(state, props),
  }
}

class HeroBroadcastContainer extends Component {
  static propTypes = {
    broadcast: PropTypes.string,
    viewName: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    broadcast: null,
  }

  onDismissBroadcast = () => {
    const { dispatch, viewName } = this.props
    if (viewName === 'discover') {
      dispatch(setLastDiscoverBeaconVersion({ version: DISCOVER.BEACON_VERSION }))
    } else if (viewName === 'following') {
      dispatch(setLastFollowingBeaconVersion({ version: FOLLOWING.BEACON_VERSION }))
    }
  }

  render() {
    const { broadcast } = this.props
    if (!broadcast) { return null }
    return (
      <HeroBroadcast broadcast={broadcast} onDismiss={this.onDismissBroadcast} />
    )
  }
}

export default connect(mapStateToProps)(HeroBroadcastContainer)
