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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiText, EuiSpacer, EuiToolTip } from '@elastic/eui'

import { getSliderInstanceColor, getSliderAbbreviation } from '../../../../../lib/sliders'

import { ZoneSummary as ZoneSummaryType } from '../../../../../types'

type Props = {
  zone: ZoneSummaryType
  zoneCount: number
}

const ZoneSummary: FunctionComponent<Props> = ({ zone, zoneCount }) => (
  <div data-test-id={`zone-summary-${zoneCount}`}>
    <EuiText size='s' color='subdued'>
      <strong style={{ textTransform: 'uppercase' }}>
        <FormattedMessage
          id='zone-summary.zone-count'
          defaultMessage='Zone { zoneCount, number }'
          values={{ zoneCount }}
        />
      </strong>
    </EuiText>

    <EuiSpacer size='xs' />

    <Fragment>
      {zone.map((instance, instanceIndex) => (
        <EuiToolTip
          key={instanceIndex}
          content={
            <Fragment>
              {instance.name} — {instance.size}
              {instance.storage ? [` and `, instance.storage] : ``}
            </Fragment>
          }
        >
          <div
            className={`instance-summary-circle`}
            style={{ backgroundColor: getSliderInstanceColor(instance.type, instance.index) }}
            data-test-id='instance-summary-viz-circle'
            data-type={instance.type}
          >
            {getSliderAbbreviation(instance.name)}
          </div>
        </EuiToolTip>
      ))}
    </Fragment>
  </div>
)

export default ZoneSummary
