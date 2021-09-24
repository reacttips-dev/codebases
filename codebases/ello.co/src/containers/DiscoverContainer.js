import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  bindDiscoverKey,
  loadGlobalPostStream,
  loadSubscribedPostStream,
  loadCategoryPostStream,
  loadCategoryDetails,
} from '../actions/discover'
import { Discover } from '../components/views/Discover'
import {
  selectPropsPathname,
  selectDiscoverStream,
  selectDiscoverStreamKind,
  selectPropsQueryBefore,
} from '../selectors/routing'

export function getStreamAction(stream, kind, before) {
  switch (stream) {
    case 'global':
      return loadGlobalPostStream(kind, before)
    case 'subscribed':
      return loadSubscribedPostStream(kind, before)
    default:
      return loadCategoryPostStream(stream, kind, before)
  }
}

function mapStateToProps(state, props) {
  return {
    stream: selectDiscoverStream(state, props),
    kind: selectDiscoverStreamKind(state, props),
    pathname: selectPropsPathname(state, props),
    before: selectPropsQueryBefore(state, props),
  }
}

class DiscoverContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    stream: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    before: PropTypes.string,
  }

  static defaultProps = {
    before: null,
  }

  componentWillMount() {
    const { dispatch, pathname, stream } = this.props
    if (stream !== 'global' && stream !== 'subscribed') {
      dispatch(loadCategoryDetails(stream))
    }
    dispatch(bindDiscoverKey(pathname))
  }

  componentDidUpdate(prevProps) {
    const { dispatch, pathname, stream } = this.props
    if (prevProps.pathname !== pathname) {
      if (stream !== 'global' && stream !== 'subscribed') {
        dispatch(loadCategoryDetails(stream))
      }
      dispatch(bindDiscoverKey(pathname))
    }
  }

  render() {
    const { stream, kind, before } = this.props
    return (
      <Discover
        stream={stream}
        kind={kind}
        key={`discover_${stream}_${kind}`}
        streamAction={getStreamAction(stream, kind, before)}
      />
    )
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

