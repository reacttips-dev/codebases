/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import React, { Component, Fragment } from 'react'
import cx from 'classnames'
import moment from 'moment'

import { ProfileState } from '../../../../types'

import { detectAdBlocker } from '../../../../lib/detectAdBlocker'

import intercom from '../../../../files/intercom.svg'

import './intercomChat.scss'

interface Props {
  profile?: ProfileState
  intercomChatUrl: string
  fetchIntercomData: () => void
  intercomExperimentDates?: {
    start: string
    end: string
  }
}

interface State {
  intercomInitialized: boolean
  intercomClass: string
  iconClass: string
}

const chatIframeLarge = `chat-iframe-large`
const chatIframeSmall = `chat-iframe-small`
const chatIframeDelay = 1000

class IntercomChat extends Component<Props, State> {
  state: State = {
    intercomInitialized: false,
    intercomClass: chatIframeSmall,
    iconClass: `shown`,
  }

  componentDidMount() {
    const { fetchIntercomData } = this.props
    fetchIntercomData()
    window.addEventListener('message', this.onMessage, false)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage, false)
  }

  render() {
    const { profile, intercomChatUrl } = this.props
    const intercomEnabled = this.getIntercomAvailability()

    if (!intercomEnabled) {
      return null
    }

    if (!profile) {
      return null
    }

    if (!profile.inTrial && !profile.hasExpiredTrial) {
      return null
    }

    if (detectAdBlocker()) {
      return null
    }

    return (
      <Fragment>
        <img
          data-test-id='intercom-chat-img'
          src={intercom}
          onClick={() => this.toggleChat()}
          className={cx(`chat-iframe-toggleBtn`, this.state.iconClass)}
        />

        <iframe
          id='chat-iframe'
          className={cx(`chat-iframe`, this.state.intercomClass)}
          sandbox='allow-same-origin allow-scripts'
          src={intercomChatUrl}
        />
      </Fragment>
    )
  }

  toggleChat() {
    const iframe = document.getElementById(`chat-iframe`)!

    if (!this.state.intercomInitialized) {
      // they've clicked the iframe for the first time, let's send some user deets
      this.initializeIntercom(iframe)
    }

    if (this.state.intercomClass === chatIframeSmall) {
      this.setState({
        intercomClass: chatIframeLarge,
        iconClass: `chat-iframe-iconHidden`,
      })

      setTimeout(() => {
        // @ts-ignore contentWindow does exist...
        iframe.contentWindow.postMessage({ type: `openChat` }, `*`)
      }, chatIframeDelay)
    }
  }

  initializeIntercom(iframe) {
    const { profile } = this.props

    this.setState({
      intercomInitialized: true,
    })

    /* The first time the user clicks into the chat, we hydrate Intercom
     * with their user id so that our sales people can identify the user
     */

    iframe.contentWindow.postMessage({ type: `hydrate`, user_id: profile!.user_id }, `*`)
  }

  onMessage = (event) => {
    if (event.data === `chatClosed`) {
      setTimeout(() => {
        this.setState({
          intercomClass: chatIframeSmall,
          iconClass: `chat-iframe-iconShown`,
        })
      }, chatIframeDelay)
    }
  }

  getIntercomAvailability = () => {
    const { intercomExperimentDates, profile } = this.props

    if (!profile) {
      return false
    }

    if (!intercomExperimentDates) {
      return false
    }

    const creationDate = moment(profile.created)
    const startDate = intercomExperimentDates.start
    const endDate = intercomExperimentDates.end

    return (
      creationDate.isBetween(startDate, endDate) ||
      creationDate.isSame(startDate) ||
      creationDate.isSame(endDate)
    )
  }
}

export default IntercomChat
