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
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { isEmpty, difference } from 'lodash'

import {
  EuiCallOut,
  EuiCode,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiRouterLinkButton } from '../../cui'

import DocLink from '../DocLink'

import { getTopologyElementName } from '../../lib/sliders'
import { getMaxedOutCapacityTopologyElements, getVersion } from '../../lib/stackDeployments'
import { deploymentEditUrl } from '../../lib/urlBuilder'
import LocalStorageKey from '../../constants/localStorageKeys'

import { StackDeployment } from '../../types'

import './autoscalingCallout.scss'

interface Props extends WrappedComponentProps {
  stackDeployment: StackDeployment
}

type State = {
  isDismissed: boolean
}

class AutoscalingStatusCallout extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.removeFixedDismissals()
    this.state = {
      isDismissed: this.hasBeenDismissed(),
    }
  }

  render() {
    const { stackDeployment } = this.props
    const { isDismissed } = this.state
    const elementsAtAutoscalingMax = getMaxedOutCapacityTopologyElements({
      deployment: stackDeployment,
    })

    if (isEmpty(elementsAtAutoscalingMax) || isDismissed) {
      return null
    }

    const nodeNames = elementsAtAutoscalingMax
      .map<React.ReactNode>((topologyElement) => (
        <EuiCode transparentBackground={true}>
          {getTopologyElementName({
            topologyElement,
            sliderInstanceType: `elasticsearch`,
            version: getVersion({ deployment: stackDeployment }),
          })}
        </EuiCode>
      ))
      .reduce((prev, curr) => [prev, ', ', curr])

    return (
      <Fragment>
        <EuiCallOut
          data-test-id='autoscalingStatus-callout'
          className='autoscalingStatus-callout'
          title={
            <EuiFlexGroup>
              <EuiFlexItem>
                <FormattedMessage
                  id='autoscaling-status-callout.title'
                  defaultMessage='Autoscaling limits reached'
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiText>
                  <EuiLink
                    onClick={() => this.dismissCallout()}
                    data-test-id='autoscalingStatus-dismiss'
                  >
                    <FormattedMessage
                      id='autoscaling-status-callout.dismiss'
                      defaultMessage='Dismiss'
                    />
                  </EuiLink>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          }
          color='warning'
        >
          <Fragment>
            <p>
              <FormattedMessage
                id='autoscaling-status-callout.description'
                defaultMessage='To continue experiencing optimal performance, we recommend increasing your maximum size per zone for the topologies: {listOfNodes}. {learnMore}'
                values={{
                  listOfNodes: nodeNames,
                  learnMore: (
                    <DocLink link='autoscalingDocLink'>
                      <FormattedMessage
                        id='autoscaling-status-callout.description.learn-more'
                        defaultMessage='Learn more'
                      />
                    </DocLink>
                  ),
                }}
              />
            </p>
            <CuiRouterLinkButton
              to={deploymentEditUrl(stackDeployment.id)}
              data-test-id='autoscaling-status-callout-button'
              color='warning'
            >
              <FormattedMessage
                id='autoscaling-status-callout.update'
                defaultMessage='Update autoscaling settings'
              />
            </CuiRouterLinkButton>
          </Fragment>
        </EuiCallOut>
        <EuiSpacer />
      </Fragment>
    )
  }

  dismissCallout() {
    const { stackDeployment } = this.props

    const elementsAtAutoscalingMax = getMaxedOutCapacityTopologyElements({
      deployment: stackDeployment,
    })

    elementsAtAutoscalingMax.forEach((element) => {
      localStorage.setItem(this.getLocalStorageKey(element), `true`)
    })

    this.setState({ isDismissed: true })
  }

  getLocalStorageKey(element) {
    const prefix = this.getLocalStorageKeyPrefix()
    return `${prefix}${element.id}`
  }

  getLocalStorageKeyPrefix() {
    const { stackDeployment } = this.props
    return `${LocalStorageKey.autoscalingLimitReachedDismissed}-${stackDeployment.id}-`
  }

  hasBeenDismissed(): boolean {
    const { stackDeployment } = this.props
    const keyPrefix = this.getLocalStorageKeyPrefix()

    const elementsAtAutoscalingMax = getMaxedOutCapacityTopologyElements({
      deployment: stackDeployment,
    })

    if (elementsAtAutoscalingMax.length === 0) {
      // exit early - we're already not displaying the warning
      // if length === 0. this just stops us from doing
      // extra checks unnecessarily
      return true
    }

    const matchingLocalStorageKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith(keyPrefix) && localStorage.getItem(key) === 'true',
    )

    const keysToCheckFor = elementsAtAutoscalingMax.map((element) =>
      this.getLocalStorageKey(element),
    )

    const keysNotPresent = difference(keysToCheckFor, matchingLocalStorageKeys)

    if (keysNotPresent.length > 0) {
      return false
    }

    return true
  }

  removeFixedDismissals() {
    // If a notification has been dismissed, but is no longer maxed out,
    // that means that a user has fixed the issue.
    // Therefore, any new notifications should be counted as undismissed
    // and we need to clear out old localStorage keys.
    // This is not ideal because a user could just not visit the UI
    // while the limits are in a good state, but this is a limitation
    // of using localStorage instead of an API solution.
    const { stackDeployment } = this.props
    const keyPrefix = this.getLocalStorageKeyPrefix()

    const matchingLocalStorageKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith(keyPrefix) && localStorage.getItem(key) === 'true',
    )

    const elementsAtAutoscalingMax = getMaxedOutCapacityTopologyElements({
      deployment: stackDeployment,
    })

    const keysThatCouldExist = elementsAtAutoscalingMax.map((element) =>
      this.getLocalStorageKey(element),
    )

    const keysWeCanDelete = difference(matchingLocalStorageKeys, keysThatCouldExist)

    keysWeCanDelete.forEach((key) => {
      localStorage.removeItem(key)
    })
  }
}

export default injectIntl(AutoscalingStatusCallout)
