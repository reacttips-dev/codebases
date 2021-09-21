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

import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiCallOut,
  EuiCallOutProps,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiText,
} from '@elastic/eui'

import DocLink from '../DocLink'

import LocalStorageKey from '../../constants/localStorageKeys'

type Props = {
  message: ReactNode
  color?: EuiCallOutProps['color']
  persistent?: boolean
  storageKey?: string
}

type State = {
  isDismissed: boolean
}

class AppSearchNotice extends Component<Props, State> {
  state: State = {
    isDismissed: localStorage.getItem(this.getLocalStorageKey()) === 'true',
  }

  render() {
    const { message, color = 'warning', persistent = false } = this.props
    const { isDismissed } = this.state

    if (!persistent && isDismissed) {
      return null
    }

    return (
      <EuiCallOut
        title={
          <EuiFlexGroup>
            <EuiFlexItem>{message}</EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiText>
                <DocLink link='upgradeAppSearchDocLink'>
                  <FormattedMessage
                    id='deprecationNotice.appsearch.learnmore'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              </EuiText>
            </EuiFlexItem>

            {persistent ? null : (
              <EuiFlexItem grow={false}>
                <EuiText>
                  <EuiLink onClick={() => this.dismissCallout()}>
                    <FormattedMessage
                      id='deprecationNotice.appsearch.dismiss'
                      defaultMessage='Dismiss'
                    />
                  </EuiLink>
                </EuiText>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        }
        color={color}
      />
    )
  }

  dismissCallout() {
    localStorage.setItem(this.getLocalStorageKey(), `true`)
    this.setState({ isDismissed: true })
  }

  getLocalStorageKey() {
    const { storageKey } = this.props
    const key = LocalStorageKey.appsearchCalloutDismissed

    return storageKey ? `${key}_${storageKey.toUpperCase()}` : key
  }
}

export default AppSearchNotice
