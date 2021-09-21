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

import { EuiFlexGrid, EuiFlexGroup, EuiFlexItem, EuiCard } from '@elastic/eui'

import { withSmallErrorBoundary } from '../../../cui'

import StackDeploymentHealthProblems from '../../StackDeploymentHealthProblems'

import Title from './Title'
import Description from './Description'

import DeploymentProvider from '../Deployment/DeploymentProvider'
import DeploymentStackIcons from '../Deployment/DeploymentStackIcons'
import DeploymentConfigurations from '../Deployment/DeploymentConfigurations'

import history from '../../../lib/history'

import { deploymentUrl } from '../../../lib/urlBuilder'

import { getRegionId } from '../../../lib/stackDeployments'

import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

import './deploymentCard.scss'

type Props = {
  deployment: DeploymentSearchResponse
}

const DeploymentCard: FunctionComponent<Props> = ({ deployment }) => {
  const { id } = deployment
  const regionId = getRegionId({ deployment })
  const href = deploymentUrl(id)

  // a stack deployment may not have a region if it has no associated resources
  const displayHealthProblems = Boolean(regionId)

  return (
    <EuiCard
      data-test-id='deploymentCard'
      className='deploymentCard'
      textAlign='left'
      titleSize='xs'
      href={href}
      onClick={(e) => {
        history.push(href)

        // we need both of these to prevent bubbling up to the link
        // and we need the link because UX of being an actual link (cmd+click, etc.)
        e.preventDefault()
        e.stopPropagation()
      }}
      title={<Title deployment={deployment} />}
      description={<Description deployment={deployment} />}
      footer={
        <Fragment>
          {displayHealthProblems && (
            <StackDeploymentHealthProblems
              deployment={deployment}
              hideLinks={true}
              hideHelpText={true}
              spacerAfter={true}
            />
          )}

          <EuiFlexGroup
            gutterSize='m'
            alignItems='flexEnd'
            justifyContent='spaceBetween'
            responsive={false}
          >
            <EuiFlexItem grow={false}>
              <DeploymentStackIcons deployment={deployment} />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <DeploymentProvider regionId={regionId} />
            </EuiFlexItem>
          </EuiFlexGroup>
        </Fragment>
      }
    >
      <EuiFlexGrid columns={2} responsive={false}>
        <DeploymentConfigurations deployment={deployment} />
      </EuiFlexGrid>
    </EuiCard>
  )
}

export default withSmallErrorBoundary(DeploymentCard)
