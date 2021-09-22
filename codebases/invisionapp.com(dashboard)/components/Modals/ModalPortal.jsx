import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { HeliosProvider } from '@invisionapp/helios'
import { ThemeProvider } from '@invisionapp/helios-one-web'

import styles from '../../css/modal-portal.css'

// Render into subtree is necessary for parent contexts to transfer over
// For example, for react-router
var renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer

// track if home as a feature is unmounting. In that scenario,
// the delayed unmount transition should be omitted.
let homeUnmountListenerAdded = false

class ModalPortal extends React.Component {
  constructor (props) {
    super(props)
    this.renderChildren = this.renderChildren.bind(this)
    this.cleanUpPortalAfterTransition = this.cleanUpPortalAfterTransition.bind(this)
  }
  componentDidMount () {
    // When we are unmounting home at the app-shell level, we need to immediately clean up the
    // portal elements to avoid them becoming unstyled as the next feature comes into focus
    if (!homeUnmountListenerAdded && window.inGlobalContext && window.inGlobalContext.appShell) {
      homeUnmountListenerAdded = true
      window.inGlobalContext.appShell.getFeatureContext('home').once('before:unmount', () => {
        this.cleanUpPortalAfterTransition()
        // reset the listener so the next mount of home will establish a new listener
        homeUnmountListenerAdded = false
      })
    }

    document.body.classList.add(styles.open)

    // Create a div and append it to the body
    var target = document.createElement('div')
    target.className = styles.portal
    this._target = document.body.appendChild(target)

    if (document.documentElement.classList) {
      document.documentElement.classList.add(styles.open)

      if (this.props.noScroll) {
        document.documentElement.classList.add(styles.noScroll)
      }
    }

    // Mount a component on that div
    this._component = this.renderChildren()
  }

  cleanUpPortalAfterTransition () {
    if (!this._target) {
      return
    }

    if (document.documentElement.classList) {
      document.documentElement.classList.remove(styles.open)

      if (this.props.noScroll) {
        document.documentElement.classList.remove(styles.noScroll)
      }
    }

    // Remove the node and clean up after the target
    ReactDOM.unmountComponentAtNode(this._target)
    document.body.removeChild(this._target)
    this._target = null
    this._component = null
  }

  componentWillUnmount () {
    document.body.classList.remove(styles.open)

    var unmountTime = this.props.transitionTime ? this.props.transitionTime + 10 : 0

    this._component = this.renderChildren(true)

    // A similar API to react-transition-group
    if (this._component && typeof this._component.componentWillLeave === 'function') {
      // Pass the callback to be called on completion
      this._component.componentWillLeave(this.cleanUpPortalAfterTransition)
    } else {
      setTimeout(this.cleanUpPortalAfterTransition, unmountTime)
    }
  }

  componentDidUpdate () {
    // When the child component updates, we have to make sure the content rendered to the DOM is updated to
    this._component = this.renderChildren()
  }

  renderChildren (willUnmount) {
    var children = React.Children.only(this.props.children)

    var clonedChildren = React.cloneElement(children, {
      willUnmount: willUnmount || false
    })

    const wrapper = (
      <HeliosProvider>
        <ThemeProvider theme='light'>
          {clonedChildren}
        </ThemeProvider>
      </HeliosProvider>
    )

    return renderSubtreeIntoContainer(this, wrapper, this._target)
  }

  render () {
    return null
  }
}

ModalPortal.propTypes = {
  children: PropTypes.object.isRequired,
  // TODO: It'd be lovely to change this, or add, a selector
  // to listen to transitionEnd event to know when it's
  // actually done animating instead of being hardcoded.
  transitionTime: PropTypes.number,
  noScroll: PropTypes.bool
}

export default ModalPortal
