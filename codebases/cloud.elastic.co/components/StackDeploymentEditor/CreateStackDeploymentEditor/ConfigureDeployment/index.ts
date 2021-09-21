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

import { ComponentType, ReactNode } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'

import ConfigureDeployment from './ConfigureDeployment'

import PricedArchitectureSummary from '../../../../apps/userconsole/components/Topology/PricedArchitectureSummary'

import {
  fetchDeploymentTemplatesRequest,
  createStackDeploymentRequest,
  getVersionStacks,
} from '../../../../reducers'

import { DeepPartial } from '../../../../lib/ts-essentials'

import {
  AsyncRequestState,
  Region,
  SnapshotDetails,
  StackDeploymentCreateRequest,
} from '../../../../types'

import { StackVersionConfig } from '../../../../lib/api/v1/types'

type StateProps = {
  region: Region
  regionId: string
  fetchDeploymentTemplatesRequest: AsyncRequestState
  createDeploymentRequest: AsyncRequestState
  stackVersions: StackVersionConfig[] | null
  inTrial: boolean
  architectureSummary?: ComponentType<any>
}

interface DispatchProps {}

type ConsumerProps = {
  region: Region
  editorState: StackDeploymentCreateRequest
  onChange: (
    changes: DeepPartial<StackDeploymentCreateRequest>,
    settings?: { shallow?: boolean },
  ) => void
  availableNumberOfZones: number
  bottomNavigationButtons?: ReactNode
  onlyShowPricingFactors?: boolean
  snapshotDetails?: SnapshotDetails | null
  showPrice: boolean
}

const mapStateToProps = (state, { region, showPrice }: ConsumerProps): StateProps => {
  const regionId = region.id

  return {
    region,
    regionId,
    fetchDeploymentTemplatesRequest: fetchDeploymentTemplatesRequest(state, regionId),
    createDeploymentRequest: createStackDeploymentRequest(state),
    stackVersions: getVersionStacks(state, regionId),
    inTrial: get(state, [`profile`, `inTrial`], false),
    architectureSummary: showPrice ? PricedArchitectureSummary : undefined,
  }
}

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ConfigureDeployment)

export type { Props } from './ConfigureDeployment'
