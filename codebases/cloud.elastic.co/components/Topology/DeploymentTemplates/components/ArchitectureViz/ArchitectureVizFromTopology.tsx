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

import React, { FunctionComponent } from 'react'

import ArchitectureViz from './ArchitectureViz'

import { getArchitectureDescription } from '../../../../../lib/deployments/architecture'

import { NodeConfiguration, VersionNumber } from '../../../../../types'

import { InstanceConfiguration } from '../../../../../lib/api/v1/types'

export type Props = {
  instanceConfigurations?: InstanceConfiguration[] | null
  nodeConfigurations: NodeConfiguration[]
  version: VersionNumber | undefined
  grid?: boolean
}

const ArchitectureVizFromTopology: FunctionComponent<Props> = ({
  instanceConfigurations,
  nodeConfigurations,
  version,
  grid = false,
}) => (
  <ArchitectureViz
    architecture={getArchitectureDescription({
      instanceConfigurations,
      nodeConfigurations,
      version,
    })}
    grid={grid}
    version={version}
  />
)

export default ArchitectureVizFromTopology
