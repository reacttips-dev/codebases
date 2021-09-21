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

import { EuiSpacer } from '@elastic/eui'

import { withErrorBoundary } from '../../../../../cui'

import ZoneSummaryKey from './ZoneSummaryKey'
import ZoneList from './ZoneList'

import { ArchitectureSummary, VersionNumber } from '../../../../../types'

export type Props = {
  architecture: ArchitectureSummary
  grid?: boolean
  version: VersionNumber | null | undefined
}

const ArchitectureViz: FunctionComponent<Props> = ({ architecture, grid, version }) => {
  const empty = architecture.zones.length === 0

  if (empty) {
    return null
  }

  return (
    <Fragment>
      <EuiSpacer size='m' />

      <div data-test-id='architecture-zones-visualization'>
        <ZoneList zones={architecture.zones} grid={grid} />
      </div>

      <EuiSpacer size='s' />

      <div data-test-id='architecture-zones-legend'>
        <ZoneSummaryKey keys={architecture.keys} version={version} />
      </div>
    </Fragment>
  )
}

export default withErrorBoundary(ArchitectureViz)
