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
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { range } from 'lodash'
import jif from 'jif'

import { EuiFlexGroup, EuiFlexItem, EuiSelect, EuiSpacer, EuiRadio } from '@elastic/eui'

const messages = defineMessages({
  zones: {
    id: `fault-tolerance-other.zone-count`,
    defaultMessage: `{ zoneCount } zones`,
  },
})

function OtherSize({ intl, numberOfZones, availableNumberOfZones, renderTooltip, onUpdate }) {
  const active = numberOfZones > 3
  const initialValue = numberOfZones > 3 ? numberOfZones : 4

  const options = range(4, availableNumberOfZones).map((index) => ({
    text: intl.formatMessage(messages.zones, {
      zoneCount: index,
    }),
    value: index,
  }))

  return (
    <Fragment>
      <EuiSpacer size='s' />

      <EuiFlexGroup gutterSize='s'>
        <EuiFlexItem grow={false}>
          <EuiRadio
            id='fault-tolerance-other'
            name='fault-tolerance'
            checked={active}
            onChange={() => onUpdate(initialValue)}
            label={
              <FormattedMessage
                id='deployment-configure-availability-zone.other-number-of-zones'
                defaultMessage='More zones …'
              />
            }
          />
        </EuiFlexItem>

        <EuiFlexItem grow={false}>{jif(active, renderTooltip)}</EuiFlexItem>
      </EuiFlexGroup>

      {jif(active, () => (
        <Fragment>
          <EuiSpacer size='s' />

          <EuiSelect
            value={numberOfZones}
            onChange={(e) => onUpdate(parseInt(e.target.value, 10))}
            options={options}
          />
        </Fragment>
      ))}
    </Fragment>
  )
}

export default injectIntl(OtherSize)
