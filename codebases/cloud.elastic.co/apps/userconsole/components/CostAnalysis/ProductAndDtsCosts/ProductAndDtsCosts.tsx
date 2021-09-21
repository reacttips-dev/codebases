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
import { EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../../../../cui'

import ProductsCostsGrid from '../ProductsCostsGrid'
import DtsCostsGrid from '../DtsCostsGrid'

import {
  AsyncRequestState,
  ProfileState,
  DeploymentItemsCosts,
  SelectedItems as SelectedFilterItems,
  TimePeriod,
} from '../../../../../types'

interface Props {
  deploymentId?: string
  deploymentItemsCosts: DeploymentItemsCosts
  deploymentItemsCostsByDeployment: DeploymentItemsCosts
  fetchRequest: AsyncRequestState
  profile: ProfileState
  showProductActivityPeriod?: boolean
  timePeriod?: TimePeriod
  selectedFilterItems?: SelectedFilterItems
}

const ProductAndDtsCosts: FunctionComponent<Props> = ({
  deploymentId,
  deploymentItemsCosts,
  deploymentItemsCostsByDeployment,
  showProductActivityPeriod,
  fetchRequest,
}) => {
  const deploymentItemsCostsData = deploymentId
    ? deploymentItemsCostsByDeployment
    : deploymentItemsCosts

  if (fetchRequest.error) {
    return (
      <CuiAlert data-test-id='fetch-product-cost-error' type='error'>
        {fetchRequest.error}
      </CuiAlert>
    )
  }

  return (
    <Fragment>
      <ProductsCostsGrid
        deploymentItemsCosts={deploymentItemsCostsData}
        initialLoading={fetchRequest.inProgress}
        showActivityPeriod={showProductActivityPeriod}
      />

      <EuiSpacer size='xxl' />

      <DtsCostsGrid deploymentItemsCosts={deploymentItemsCostsData} fetchRequest={fetchRequest} />
    </Fragment>
  )
}

export default ProductAndDtsCosts
