import React, { Component } from 'react'

import { Toast, Link } from '@invisionapp/helios'

import { trackEvent } from '../../utils/analytics'
import { sanitize } from '../../utils/sanitize'

import * as AppRoutes from '../../constants/AppRoutes'
import { APP_PROJECT_OPENED, APP_SPACE_OPENED } from '../../constants/TrackingEvents'

import styles from '../../css/common/alerts.css'
import { storeRef } from '../../store/store'

function getUrlParameter (name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(window.location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

const reloadPage = () => window.location.reload()

class Alerts extends Component {
  constructor (props) {
    super(props)

    this.state = {
      alertMessage: '',
      alertType: 'info',
      fromURL: false
    }

    this.timeout = null
  }

  handleSpaceClick = () => {
    const { id, type, isPublic } = this.props.alert

    if (type === 'space-success') {
      trackEvent(APP_SPACE_OPENED, {
        spaceId: id,
        spaceType: isPublic ? 'team' : 'invite-only',
        spaceContext: 'banner_notification'
      })
    } else if (type === 'project-success') {
      trackEvent(APP_PROJECT_OPENED, {
        projectID: id,
        projectContext: 'banner_notification'
      })
    }
  }

  clearAlertTimeout () {
    if (!this.timeout) {
      return
    }

    clearTimeout(this.timeout)
    this.timeout = null
  }

  setAlertTimeout (callback, timeout) {
    this.clearAlertTimeout()
    this.timeout = setTimeout(callback, timeout)
  }

  componentDidMount () {
    const alertType = getUrlParameter('alertType')
    const alertMessage = getUrlParameter('alertMessage')
    if (
      !alertType ||
      !alertMessage ||
      ['info', 'success', 'warning', 'danger', 'system-light', 'system-dark'].indexOf(alertType) === -1
    ) {
      return
    }

    this.setState({
      alertType,
      alertMessage,
      fromURL: true
    }, () => {
      // clear out the query string
      if (window.location.pathname.indexOf(AppRoutes.ROUTE_DOCUMENTS) >= 0) {
        storeRef.history.replace(AppRoutes.ROUTE_DOCUMENTS)
      } else {
        storeRef.history.replace(AppRoutes.ROUTE_HOME)
      }
    })
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.alert.message && nextProps.alert.message !== this.state.alertMessage) {
      this.setState({
        alertMessage: nextProps.alert.message,
        alertType: nextProps.alert.type,
        fromURL: false
      }, () => {
        if (nextProps.alert.timeout > 0) {
          this.setAlertTimeout(() => {
            nextProps.actions.showAlert('info', '')
          }, nextProps.alert.timeout + 100)
        } else {
          this.clearAlertTimeout()
        }
      })
    } else if (!nextProps.alert.message && this.state.alertMessage) {
      if (this.state.fromURL) {
        this.setAlertTimeout(() => {
          this.setState({
            alertMessage: '',
            alertType: 'info',
            fromURL: false
          })
        }, 5100)
      } else {
        this.setState({
          alertMessage: '',
          alertType: 'info',
          fromURL: false
        })
      }
    }
  }

  render () {
    const { alertMessage, alertType } = this.state
    const { alert: { retryLink } } = this.props

    if (!alertMessage || !alertType) {
      return null
    }

    return (
      <Toast
        className={styles.root}
        status={alertType === 'space-success' || alertType === 'project-success' ? 'success' : alertType}
        placement='top-center'
        withTimeout={false}>
        {sanitize(`${alertMessage}${retryLink || alertType === 'space-success' || alertType === 'project-success' ? ' ' : ''}`)}

        {(alertType === 'space-success' || alertType === 'project-success') &&
          <Link onClick={this.handleSpaceClick} href={this.props.alert.url}>
            {this.props.alert.title}
          </Link>
        }

        {retryLink &&
          <Link onClick={reloadPage}>Try again</Link>
        }
      </Toast>
    )
  }
}

export default Alerts
