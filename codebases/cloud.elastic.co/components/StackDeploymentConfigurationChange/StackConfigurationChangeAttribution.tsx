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
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'
import { isEmpty } from 'lodash'

import {
  EuiBadge,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiPopover,
  EuiSpacer,
  EuiTextColor,
  EuiToolTip,
} from '@elastic/eui'

import { CuiLink } from '../../cui'

import StackConfigurationChangeSource, {
  getSourceAttribution,
} from './StackConfigurationChangeSource'

import { isFeatureActivated } from '../../store'

import { userOverviewUrl } from '../../lib/urlBuilder'

import Feature from '../../lib/feature'

import { AnyClusterPlanInfo, SliderInstanceType } from '../../types'

type Props = {
  planAttempt: AnyClusterPlanInfo
  kind: SliderInstanceType
  hideEye?: boolean
}

type State = {
  showPopover: boolean
}

const messages = defineMessages({
  showPopover: {
    id: `configuration-change-attribution.show-attribution-details`,
    defaultMessage: `Show configuration change attribution details`,
  },
})

class StackConfigurationChangeAttribution extends Component<Props & WrappedComponentProps, State> {
  state: State = {
    showPopover: false,
  }

  render() {
    const {
      intl: { formatMessage },
      planAttempt,
      kind,
      hideEye,
    } = this.props

    const { showPopover } = this.state

    return (
      <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
        {this.renderUserAttribution()}

        {hideEye || (
          <EuiFlexItem grow={false}>
            <div>
              <EuiPopover
                id={`${kind}-${planAttempt.plan_attempt_id}-attribution`}
                button={
                  <div data-test-id={`${kind}-${planAttempt.plan_attempt_id}-attribution-eye`}>
                    <EuiButtonIcon
                      aria-label={formatMessage(messages.showPopover)}
                      iconType='eye'
                      onClick={() => this.setState({ showPopover: true })}
                    />
                  </div>
                }
                closePopover={() => this.setState({ showPopover: false })}
                isOpen={showPopover}
              >
                <div
                  style={{ maxWidth: `400px` }}
                  data-test-id={`${kind}-${planAttempt.plan_attempt_id}-attribution-details`}
                >
                  {this.renderPopoverContents()}
                </div>
              </EuiPopover>
            </div>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    )
  }

  renderUserAttribution() {
    const { planAttempt } = this.props
    const { source } = planAttempt
    const adminId = source && source.admin_id
    const userId = source && source.user_id

    if (userId) {
      return (
        <EuiFlexItem grow={false}>
          <FormattedMessage
            id='configuration-change-attribution.user-initiated'
            defaultMessage='User-initiated'
          />
        </EuiFlexItem>
      )
    }

    return (
      <Fragment>
        {adminId && adminId !== `-` && (
          <EuiFlexItem grow={false}>
            <EuiToolTip content={adminId}>
              <EuiTextColor color='warning'>
                <div className='configurationChangeAttribution-adminId'>{adminId}</div>
              </EuiTextColor>
            </EuiToolTip>
          </EuiFlexItem>
        )}

        <EuiFlexItem grow={false}>
          <EuiBadge color='warning'>
            <FormattedMessage
              id='configuration-change-attribution.system-label'
              defaultMessage='System'
            />
          </EuiBadge>
        </EuiFlexItem>
      </Fragment>
    )
  }

  renderPopoverContents() {
    const { planAttempt } = this.props
    const { source } = planAttempt

    const adminId = source && source.admin_id
    const userId = source && source.user_id
    const action = source && source.action
    const facilitator = source && source.facilitator
    const remoteAddresses = (source && source.remote_addresses) || []

    const saneRemoteAddresses = isEmpty(remoteAddresses)
      ? remoteAddresses
      : remoteAddresses.filter((addr) => addr !== `-`)

    const lookupSaasUsers = isFeatureActivated(Feature.lookupSaasUsers)

    return (
      <Fragment>
        {adminId && adminId !== `-` && (
          <Fragment>
            <EuiFormLabel>
              <FormattedMessage
                id='configuration-change-initiator.system-user-label'
                defaultMessage='System user'
              />
            </EuiFormLabel>

            <EuiSpacer size='xs' />

            <div>
              <EuiTextColor color='warning'>{adminId}</EuiTextColor>
            </div>

            <EuiSpacer size='m' />
          </Fragment>
        )}

        {userId && userId !== `-` && (
          <Fragment>
            <EuiFormLabel>
              {adminId ? (
                <FormattedMessage
                  id='configuration-change-initiator.behalf-of-user-label'
                  defaultMessage='On behalf of user'
                />
              ) : (
                <FormattedMessage
                  id='configuration-change-initiator.user-label'
                  defaultMessage='User'
                />
              )}
            </EuiFormLabel>

            <div>
              {lookupSaasUsers ? <CuiLink to={userOverviewUrl(userId)}>{userId}</CuiLink> : userId}
            </div>

            <EuiSpacer size='m' />
          </Fragment>
        )}

        {facilitator && facilitator !== `-` && (
          <Fragment>
            <EuiFormLabel>
              <FormattedMessage
                id='configuration-change-initiator.facilitator-label'
                defaultMessage='Applied through'
              />
            </EuiFormLabel>

            <EuiSpacer size='xs' />

            <div>
              <EuiBadge>{facilitator}</EuiBadge>
            </div>

            <EuiSpacer size='m' />
          </Fragment>
        )}

        {!isEmpty(saneRemoteAddresses) && (
          <Fragment>
            <EuiFormLabel>
              <FormattedMessage
                id='configuration-change-initiator.remote-addresses-label'
                defaultMessage='Remote {addressCount, plural, one {address} other {addresses}}'
                values={{ addressCount: saneRemoteAddresses.length }}
              />
            </EuiFormLabel>

            <EuiSpacer size='xs' />

            <div>
              {saneRemoteAddresses.map((address) => (
                <EuiBadge key={address}>{address}</EuiBadge>
              ))}
            </div>

            <EuiSpacer size='m' />
          </Fragment>
        )}

        {action && action !== `-` && (
          <Fragment>
            <EuiFormLabel>
              <FormattedMessage
                id='configuration-change-initiator.source-label'
                defaultMessage='Source'
              />
            </EuiFormLabel>

            <EuiSpacer size='xs' />

            <div>
              <StackConfigurationChangeSource action={getSourceAttribution({ planAttempt })} />
            </div>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default injectIntl(StackConfigurationChangeAttribution)
