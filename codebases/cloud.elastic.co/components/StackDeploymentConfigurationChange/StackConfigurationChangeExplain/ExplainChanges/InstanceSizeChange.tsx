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

import React from 'react'
import { FormattedMessage } from 'react-intl'

import WithTopologyElement from './WithTopologyElement'

import RatioLabel from '../../../Topology/DeploymentTemplates/components/RatioLabel'

import prettySize from '../../../../lib/prettySize'

import { AnyTopologyElement } from '../../../../types'
import { InstanceConfiguration } from '../../../../lib/api/v1/types'

export default function InstanceSizeChange({
  resource,
  oldSize,
  currentSize,
  topologyElement,
  instanceConfiguration,
}: {
  resource: 'memory' | 'storage'
  oldSize: number
  currentSize: number
  topologyElement: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
}): JSX.Element {
  if (oldSize === 0 || currentSize === 0) {
    return (
      <WithTopologyElement
        topologyElement={topologyElement}
        instanceConfiguration={instanceConfiguration}
      >
        <FormattedMessage
          id='explain-changes.set-instance-size'
          defaultMessage='Set size to {to}'
          values={{
            to: <RatioLabel resource={resource} size={currentSize} />,
          }}
        />
      </WithTopologyElement>
    )
  }

  return (
    <WithTopologyElement
      topologyElement={topologyElement}
      instanceConfiguration={instanceConfiguration}
    >
      <FormattedMessage
        id='explain-changes.change-instance-size'
        defaultMessage='Change size from {from} to {to}'
        values={{
          from: <del>{prettySize(oldSize)}</del>,
          to: <RatioLabel resource={resource} size={currentSize} />,
        }}
      />
    </WithTopologyElement>
  )
}
