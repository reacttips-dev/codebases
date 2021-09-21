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

import { connect } from 'react-redux'

import SelectTemplate from './SelectTemplate'

import {
  getRegionsByProvider,
  getRegionIdsByProvider,
  getProvidersNames,
} from '../../../../reducers'
import { getProfile } from '../../../../apps/userconsole/reducers'

import { getConfigForKey, isFeatureActivated } from '../../../../selectors'

import { RegionState } from '../../../../reducers/providers'
import { fetchBasePricesIfNeeded } from '../../../../apps/userconsole/actions/pricing'

import { DeepPartial } from '../../../../lib/ts-essentials'
import { PlatformId } from '../../../../lib/platform'
import Feature from '../../../../lib/feature'

import {
  DeploymentTemplateInfoV2,
  ElasticsearchClusterSettings,
  GlobalDeploymentTemplateInfo,
} from '../../../../lib/api/v1/types'

import {
  ClusterSnapshot,
  ElasticsearchCluster,
  ProfileState,
  Region,
  RegionId,
  StackDeploymentCreateRequest,
  VersionNumber,
  BillingSubscriptionLevel,
} from '../../../../types'

type StateProps = {
  getRegionsByProvider: (provider: PlatformId) => RegionState[] | null
  getRegionIdsByProvider: (provider: PlatformId) => string[]
  profile: ProfileState
  providerIds: PlatformId[]
  isSkuPicker: boolean
  isUserconsole: boolean
  hasDefaultSnapshotRepository: boolean
}

interface DispatchProps {
  fetchBasePrices: ({
    regionId,
    level,
  }: {
    regionId: string
    level?: BillingSubscriptionLevel
  }) => void
}

type ConsumerProps = {
  disabled?: boolean
  availableVersions: VersionNumber[]
  editorState: StackDeploymentCreateRequest
  globalDeploymentTemplates?: GlobalDeploymentTemplateInfo[] | null
  onChange: (
    changes: DeepPartial<StackDeploymentCreateRequest>,
    settings?: { shallow?: boolean },
  ) => void
  onChangeSnapshot?: (value?: ClusterSnapshot | null) => void
  onChangeSnapshotSource?: (value?: ElasticsearchCluster | null) => void
  region?: Region

  restoreFromSnapshot: boolean
  setDeploymentName: (name: string) => void
  setEsSettings?: (settings: DeepPartial<ElasticsearchClusterSettings> | null) => void
  setDeploymentTemplate: (template: DeploymentTemplateInfoV2) => void
  setGlobalTemplate: (globalTemplate: GlobalDeploymentTemplateInfo) => void
  setRegion: (args: { regionId: RegionId; stackVersion: VersionNumber }) => void
  setVersion: (version: VersionNumber) => void
  showPrice: boolean
  showRegion: boolean
  subscription?: BillingSubscriptionLevel
  trialMaxedOut?: boolean
  whitelistedVersions: VersionNumber[]
}

export type Props = StateProps & DispatchProps & ConsumerProps

const mapStateToProps = (state): StateProps => ({
  getRegionsByProvider: (provider) => getRegionsByProvider(state, provider),
  getRegionIdsByProvider: (provider) => getRegionIdsByProvider(state, provider),
  providerIds: getProvidersNames(state),
  profile: getProfile(state),
  isSkuPicker: getConfigForKey(state, `APP_NAME`) === `sku-picker`,
  isUserconsole: getConfigForKey(state, `APP_NAME`) === `userconsole`,
  hasDefaultSnapshotRepository: isFeatureActivated(state, Feature.defaultSnapshotRepository),
})

const mapDispatchToProps: DispatchProps = {
  fetchBasePrices: fetchBasePricesIfNeeded,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SelectTemplate)
