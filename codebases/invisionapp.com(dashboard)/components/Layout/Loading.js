import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { CompactSpace, DocumentSVG, SpaceSVG, BatchDocuments } from '../../img/loading'
import styles from '../../css/loading.css'

class Loading extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isIEorEdgeBrowser: false
    }
  }

  componentWillMount () {
    this.detectBrowser()
  }

  detectBrowser () {
    const ua = window.navigator.userAgent
    const msie = ua.indexOf('MSIE ')
    const trident = ua.indexOf('Trident/')
    const edge = ua.indexOf('Edge/')
    if (msie > 0 || trident > 0 || edge > 0) {
      this.setState({ isIEorEdgeBrowser: true })
    }
  }

  renderIEFallback (type) {
    switch (type) {
      case 'batchDocuments':
        return <BatchDocuments />
      case 'documents':
        return <DocumentSVG />
      case 'spaces' :
        return <SpaceSVG />
      case 'compactSpaces':
        return <CompactSpace />
      default:
        return <DocumentSVG />
    }
  }

  render () {
    const { top, type } = this.props
    // Because Internet Explorers, EDGE and its family does not support clippath, we are rendering the pure svg as a fallback.
    if (this.state.isIEorEdgeBrowser) {
      return this.renderIEFallback(type)
    } else {
      return (
        <div
          className={cx(styles.root, styles[type], styles.withSidebar)}
          style={{
            marginTop: top || 0
          }}
        >
          <div className={styles.tiles} />
        </div>
      )
    }
  }
}

Loading.propTypes = {
  top: PropTypes.number,
  type: PropTypes.oneOf(['documents', 'spaces', 'compactSpaces', 'batchDocuments'])
}

Loading.defaultProps = {
  top: 0,
  type: 'documents'
}

export default Loading
