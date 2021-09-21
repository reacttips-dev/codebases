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

import { ReactNode } from 'react'
import { connect } from 'react-redux'

import { OnFilterChangeParams } from '../../../cui'

import DeploymentFilterContext from './DeploymentFilterContext'

import { fetchRegionList } from '../../../actions/regionEqualizer'
import { fetchVersions } from '../../../actions/elasticStack'
import { fetchInstanceConfigurations } from '../../../actions/topology/instanceConfigurations'

import { ReduxState, Region } from '../../../types'
import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

interface StateProps {}

type DispatchProps = {
  fetchRegionList: () => void
  fetchVersions: (region: Region) => void
  fetchInstanceConfigurations: (regionId: string) => void
}

type ConsumerProps = {
  query: string | null
  onChange: (params: OnFilterChangeParams<DeploymentSearchResponse>) => void
  isLoading: boolean
  deployments: DeploymentSearchResponse[]
  actions?: ReactNode | null
  tools?: ReactNode[] | null
  toolsLeft?: ReactNode[] | null
}

const mapStateToProps = (_state: ReduxState): StateProps => ({})

const mapDispatchToProps: DispatchProps = {
  fetchRegionList,
  fetchVersions,
  fetchInstanceConfigurations,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentFilterContext)

export { getEsQuery } from './DeploymentFilterContext'

export { getFilterQuery, transformIdQuery } from './queryParser'
