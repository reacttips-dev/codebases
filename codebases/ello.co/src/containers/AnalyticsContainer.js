import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isElloAndroid } from '../lib/jello'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectAllowsAnalytics,
  selectAnalyticsId,
  selectCreatedAt,
  selectCreatorTypes,
  selectIsNabaroo,
  selectProfileIsFeatured,
} from '../selectors/profile'
import * as ENV from '../../env'

const agent = isElloAndroid() ? 'android' : 'webapp'

export function addSegment({ createdAt, creatorTypes, hasAccount, isFeatured, isNabaroo, uid }) {
  /* eslint-disable */
  !function(){const analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){const e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(let t=0;t<analytics.methods.length;t++){const e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){const e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";const n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};
    /* eslint-enable */
    analytics.SNIPPET_VERSION = '3.1.0'
    analytics.load(ENV.SEGMENT_WRITE_KEY)
    if (uid) {
      analytics.identify(uid, {
        agent,
        createdAt,
        creatorTypes,
        hasAccount,
        isFeatured,
        isNabaroo,
      })
    }
  }
  }();
}

export function doesAllowTracking() {
  return !(
    window.navigator.doNotTrack === '1' ||
    window.navigator.msDoNotTrack === '1' ||
    window.doNotTrack === '1' ||
    window.msDoNotTrack === '1'
  )
}

function mapStateToProps(state) {
  const creatorTypes = selectCreatorTypes(state)
  return {
    allowsAnalytics: doesAllowTracking() && selectAllowsAnalytics(state),
    analyticsId: selectAnalyticsId(state),
    createdAt: selectCreatedAt(state),
    creatorTypes: creatorTypes.toArray(),
    isFeatured: selectProfileIsFeatured(state),
    isLoggedIn: selectIsLoggedIn(state),
    isNabaroo: selectIsNabaroo(state),
  }
}

class AnalyticsContainer extends Component {

  static propTypes = {
    allowsAnalytics: PropTypes.bool,
    analyticsId: PropTypes.string,
    createdAt: PropTypes.string,
    creatorTypes: PropTypes.array.isRequired,
    isFeatured: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isNabaroo: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    allowsAnalytics: null,
    analyticsId: null,
    createdAt: null,
  }

  componentWillMount() {
    this.hasLoadedTracking = false
  }

  componentDidMount() {
    const { analyticsId, allowsAnalytics, createdAt,
      isFeatured, isLoggedIn, creatorTypes, isNabaroo } = this.props
    if (this.hasLoadedTracking) { return }
    if (!isLoggedIn && doesAllowTracking()) {
      this.hasLoadedTracking = true
      addSegment({})
    } else if (analyticsId && allowsAnalytics) {
      this.hasLoadedTracking = true
      addSegment({ createdAt,
        hasAccount: isLoggedIn,
        isFeatured,
        creatorTypes,
        isNabaroo,
        uid: analyticsId })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { allowsAnalytics, analyticsId, createdAt,
      isFeatured, isLoggedIn, creatorTypes, isNabaroo } = nextProps
    if (this.hasLoadedTracking) {
      // identify the user if they didn't previously have an id to identify with
      if (!this.props.analyticsId && analyticsId) {
        const props = { agent,
          createdAt,
          hasAccount: isLoggedIn,
          isFeatured,
          creatorTypes,
          isNabaroo }
        window.analytics.identify(analyticsId, props)
      }
    } else if (this.props.analyticsId && analyticsId && allowsAnalytics) {
      this.hasLoadedTracking = true
      addSegment({ createdAt,
        hasAccount: isLoggedIn,
        isFeatured,
        isNabaroo,
        creatorTypes,
        uid: analyticsId })
    }
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return null
  }
}

export default connect(mapStateToProps)(AnalyticsContainer)

