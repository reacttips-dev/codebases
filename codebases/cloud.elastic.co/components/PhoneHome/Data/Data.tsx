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

import { Component } from 'react'

import { RootConfig } from '../../../types'

type Props = {
  root: RootConfig
  runPhoneHomeIfNeeded: (root: RootConfig, baseTelemetryUrl: string) => void
  phoneHomeActivated: boolean
  baseTelemetryUrl: string
  isPhoneHomeDisabled: boolean
}

class PhoneHomeData extends Component<Props> {
  componentDidMount() {
    this.phoneHome()
  }

  componentDidUpdate() {
    this.phoneHome()
  }

  render() {
    return null
  }

  phoneHome() {
    const {
      root,
      runPhoneHomeIfNeeded,
      phoneHomeActivated,
      baseTelemetryUrl,
      isPhoneHomeDisabled,
    } = this.props

    if (phoneHomeActivated && !isPhoneHomeDisabled) {
      runPhoneHomeIfNeeded(root, baseTelemetryUrl)
    }
  }
}

export default PhoneHomeData
