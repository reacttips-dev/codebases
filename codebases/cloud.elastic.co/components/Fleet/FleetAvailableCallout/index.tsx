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
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiButtonIcon, EuiSpacer } from '@elastic/eui'

import DocLink from '../../DocLink'
import LocalStorageKey from '../../../constants/localStorageKeys'
import {
  getFirstEsClusterFromGet,
  getPlanInfo,
  getPlanVersion,
  getVersion,
  isFleetServerAvailable,
} from '../../../lib/stackDeployments'
import {
  isSliderEnabledInStackDeployment,
  isSliderInstanceTypeSupportedInTemplate,
} from '../../../lib/sliders'

import { StackDeployment } from '../../../types'
import { DeploymentTemplateInfoV2 } from '../../../lib/api/v1/types'

import './fleetAvailableCallout.scss'

export interface Props extends WrappedComponentProps {
  deployment: StackDeployment
  deploymentTemplate: DeploymentTemplateInfoV2
}

type State = {
  isDismissed: boolean
}

const messages = defineMessages({
  dismiss: {
    id: 'fleetAvailableCallout.dismiss',
    defaultMessage: 'Dismiss',
  },
})

class FleetAvailableCallout extends Component<Props, State> {
  state: State = {
    isDismissed: localStorage.getItem(this.getLocalStorageKey()) === 'true',
  }

  render(): JSX.Element | null {
    const { formatMessage } = this.props.intl

    if (!this.shouldShow()) {
      return null
    }

    const title = (
      <EuiFlexGroup responsive={false}>
        <EuiFlexItem>
          <FormattedMessage
            id='fleetAvailableCallout.title'
            defaultMessage='Add Fleet to centrally manage Elastic Agents for free'
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            data-test-subj='fleetAvailableCallout.dismiss'
            onClick={this.dismissCallout}
            iconType='cross'
            aria-label={formatMessage(messages.dismiss)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    )

    const body = (
      <FormattedMessage
        id='fleetAvailableCallout.body'
        defaultMessage="The new version of the Elastic Stack includes Fleet, which you can enable right in the console. Fleet helps you manage all your Elastic Agents, get their status, make updates, and add integrations with just a few clicks. It's free with the default size, and you can add more capacity by editing your deployment. {learnMore}"
        values={{
          learnMore: (
            <DocLink link='fleetOverview'>
              <FormattedMessage
                id='fleetAvailableCallout.learnMore'
                defaultMessage='Learn more about Fleet.'
              />
            </DocLink>
          ),
        }}
      />
    )

    return (
      <Fragment>
        <EuiCallOut title={title} color='primary' className='fleet-available-callout'>
          {body}
        </EuiCallOut>
        <EuiSpacer />
      </Fragment>
    )
  }

  shouldShow(): boolean {
    const { deployment, deploymentTemplate } = this.props

    // must not be dismissed
    if (this.state.isDismissed) {
      return false
    }

    // APM must be off
    if (isSliderEnabledInStackDeployment(deployment, `apm`)) {
      return false
    }

    // APM must be available
    if (!isSliderInstanceTypeSupportedInTemplate(`apm`, deploymentTemplate)) {
      return false
    }

    const esResource = getFirstEsClusterFromGet({ deployment })

    if (!esResource) {
      return false
    }

    const previousPlan = getPlanInfo({ resource: esResource, state: `previous_success` })
    const previousVersion = getPlanVersion({ plan: previousPlan?.plan })
    const currentVersion = getVersion({ deployment })

    if (!previousVersion || !currentVersion) {
      return false
    }

    // previous successful plan must be pre-Fleet
    if (isFleetServerAvailable({ version: previousVersion })) {
      return false
    }

    // current plan must be post-Fleet
    if (!isFleetServerAvailable({ version: currentVersion })) {
      return false
    }

    return true
  }

  dismissCallout = (): void => {
    localStorage.setItem(this.getLocalStorageKey(), `true`)
    this.setState({ isDismissed: true })
  }

  getLocalStorageKey(): string {
    const { deployment } = this.props
    const key = LocalStorageKey.fleetAvailableDismissed

    return `${key}_${deployment.id}`
  }
}

export default injectIntl(FleetAvailableCallout)
export { FleetAvailableCallout }
