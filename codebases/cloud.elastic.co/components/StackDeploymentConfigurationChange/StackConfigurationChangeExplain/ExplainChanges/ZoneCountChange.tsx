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

import { InstanceConfiguration } from '../../../../lib/api/v1/types'
import { AnyTopologyElement } from '../../../../types'

export default function ZoneCountChange({
  oldCount,
  currentCount,
  topologyElement,
  instanceConfiguration,
}: {
  oldCount: number
  currentCount: number
  topologyElement: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
}): JSX.Element {
  if (oldCount === 0 || currentCount === 0) {
    return (
      <WithTopologyElement
        topologyElement={topologyElement}
        instanceConfiguration={instanceConfiguration}
      >
        <FormattedMessage
          id='explain-changes.set-zones'
          defaultMessage='Set zones to { new }'
          values={{
            new: currentCount,
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
        id='explain-changes.change-zones'
        defaultMessage='Change zones from { old } to { new }'
        values={{
          old: <del>{oldCount}</del>,
          new: currentCount,
        }}
      />
    </WithTopologyElement>
  )
}

ZoneCountChange.defaultProps = {
  oldCount: 0,
  currentCount: 0,
}
