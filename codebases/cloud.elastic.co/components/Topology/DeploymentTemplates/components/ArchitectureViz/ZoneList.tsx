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

import React, { FunctionComponent, Fragment } from 'react'

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import { ZoneSummary as ZoneSummaryType } from '../../../../../types'

import ZoneSummary from './ZoneSummary'

type Props = {
  zones: ZoneSummaryType[]
  grid?: boolean
}

const ZoneList: FunctionComponent<Props> = ({ zones, grid }) => {
  const summaries = zones.map((zone, zoneIndex) => (
    <ZoneSummary key={zoneIndex} zone={zone} zoneCount={zoneIndex + 1} />
  ))

  if (grid) {
    return (
      <div data-test-id='zone-list-grid'>
        <EuiFlexGroup gutterSize='s'>
          {summaries.map((summary, summaryIndex) => (
            <EuiFlexItem key={summaryIndex}>{summary}</EuiFlexItem>
          ))}
        </EuiFlexGroup>
      </div>
    )
  }

  return <Fragment>{summaries}</Fragment>
}

export default ZoneList
