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

import React, { Fragment, Component } from 'react'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'
import { EuiButtonIcon, EuiText, EuiToolTip } from '@elastic/eui'

import RatioLabel from '../../RatioLabel'

import { AnyTopologyElement } from '../../../../../../types'

const messages = defineMessages({
  availabilityZone: {
    id: 'converting-trial.availabilityZone',
    defaultMessage:
      '{zoneNumber, number} {zoneNumber, plural, one {zone} other {zones}} for {nodeId} node',
  },
  memory: {
    id: 'converting-trial.memory',
    defaultMessage: '{memorySize} for {nodeId} node',
  },
  reset: {
    id: 'converting-trial.remove',
    defaultMessage: 'Remove',
  },
  resetTooltip: {
    id: 'converting-trial.remove-tooltip',
    defaultMessage: 'Revert setting to current value',
  },
})

interface Props {
  exceededTrialNodes: Array<Partial<AnyTopologyElement>>
  resetNodeToTrial: ({ nodeConfiguration, topologyElementProp }) => void
}

class ExceededTrialNodeList extends Component<Props & WrappedComponentProps> {
  render() {
    const { exceededTrialNodes } = this.props

    return (
      <Fragment>
        {exceededTrialNodes.map((nodeConfiguration) =>
          this.renderExceededTrialNode(nodeConfiguration),
        )}
      </Fragment>
    )
  }

  renderExceededTrialNode(nodeConfiguration) {
    const {
      intl: { formatMessage },
      resetNodeToTrial,
    } = this.props

    return (
      <Fragment key={`${nodeConfiguration.instance_configuration_id}`}>
        {nodeConfiguration.zone_count && (
          <Fragment key={`${nodeConfiguration.instance_configuration_id}-storage`}>
            <EuiText size='s'>
              {formatMessage(messages.availabilityZone, {
                zoneNumber: nodeConfiguration.zone_count,
                nodeId: nodeConfiguration.instance_configuration_id,
              })}
              <EuiToolTip position='top' content={formatMessage(messages.resetTooltip)}>
                <EuiButtonIcon
                  iconType='editorUndo'
                  color='text'
                  size='s'
                  aria-label={formatMessage(messages.reset)}
                  onClick={() =>
                    resetNodeToTrial({
                      nodeConfiguration,
                      topologyElementProp: 'zone_count',
                    })
                  }
                />
              </EuiToolTip>
            </EuiText>
          </Fragment>
        )}
        {nodeConfiguration.size && (
          <Fragment key={`${nodeConfiguration.instance_configuration_id}-memory`}>
            <EuiText size='s'>
              {formatMessage(messages.memory, {
                memorySize: (
                  <RatioLabel
                    key={`${nodeConfiguration.instance_configuration_id}-memory-label`}
                    resource={'memory'}
                    size={nodeConfiguration.size.value}
                  />
                ),
                nodeId: nodeConfiguration.instance_configuration_id,
              })}
              <EuiToolTip position='top' content={formatMessage(messages.resetTooltip)}>
                <EuiButtonIcon
                  iconType='editorUndo'
                  color='text'
                  size='s'
                  aria-label={formatMessage(messages.reset)}
                  onClick={() =>
                    resetNodeToTrial({
                      nodeConfiguration,
                      topologyElementProp: 'size',
                    })
                  }
                />
              </EuiToolTip>
            </EuiText>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default injectIntl(ExceededTrialNodeList)
