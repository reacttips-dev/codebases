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

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import WithTopologyElement from './WithTopologyElement'

import RatioLabel from '../../../Topology/DeploymentTemplates/components/RatioLabel'

import prettySize from '../../../../lib/prettySize'

import {
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
} from '../../../../lib/api/v1/types'

export default function AutoscalingTopologyChange({
  oldNodeConfiguration,
  newNodeConfiguration,
  instanceConfiguration,
}: {
  oldNodeConfiguration?: ElasticsearchClusterTopologyElement
  newNodeConfiguration?: ElasticsearchClusterTopologyElement
  instanceConfiguration: InstanceConfiguration
}): JSX.Element {
  const oldMin = oldNodeConfiguration?.autoscaling_min
  const oldMax = oldNodeConfiguration?.autoscaling_max

  const newMin = newNodeConfiguration?.autoscaling_min
  const newMax = newNodeConfiguration?.autoscaling_max

  let autoscalingMinChange: JSX.Element | null = null
  let autoscalingMaxChange: JSX.Element | null = null

  if (newMin && oldMin?.value !== newMin.value) {
    autoscalingMinChange = (
      <Fragment key={`${instanceConfiguration.id}-min`}>
        <WithTopologyElement
          topologyElement={newNodeConfiguration}
          instanceConfiguration={instanceConfiguration}
        >
          {oldMin ? (
            <FormattedMessage
              id='explain-changes.autoscaling-min-update-change'
              defaultMessage='Change minimum size per zone from {old} to {new}'
              values={{
                old: <del>{prettySize(oldMin.value)}</del>,
                new: <RatioLabel resource={newMin.resource} size={newMin.value} />,
              }}
            />
          ) : (
            <FormattedMessage
              id='explain-changes.autoscaling-min-update-set'
              defaultMessage='Set minimum size per zone to {new}'
              values={{
                new: <RatioLabel resource={newMin.resource} size={newMin.value} />,
              }}
            />
          )}
        </WithTopologyElement>
      </Fragment>
    )
  }

  if (newMax && oldMax?.value !== newMax?.value) {
    autoscalingMaxChange = (
      <Fragment key={`${instanceConfiguration.id}-max`}>
        <WithTopologyElement
          topologyElement={newNodeConfiguration}
          instanceConfiguration={instanceConfiguration}
        >
          {oldMax ? (
            <FormattedMessage
              id='explain-changes.autoscaling-max-update-change'
              defaultMessage='Change maximum size per zone from {old} to {new}'
              values={{
                old: <del>{prettySize(oldMax.value)}</del>,
                new: <RatioLabel resource={newMax.resource} size={newMax.value} />,
              }}
            />
          ) : (
            <FormattedMessage
              id='explain-changes.autoscaling-max-update-set'
              defaultMessage='Set maximum size per zone to {new}'
              values={{
                new: <RatioLabel resource={newMax.resource} size={newMax.value} />,
              }}
            />
          )}
        </WithTopologyElement>
      </Fragment>
    )
  }

  return <Fragment>{[autoscalingMinChange, autoscalingMaxChange]}</Fragment>
}
