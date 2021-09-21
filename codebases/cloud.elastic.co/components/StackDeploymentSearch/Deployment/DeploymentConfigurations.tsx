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
import { FormattedMessage } from 'react-intl'
import { flatMap } from 'lodash'

import { EuiFlexItem, EuiText } from '@elastic/eui'

import DeploymentConfiguration from './DeploymentConfiguration'

import { getAllKnownSliderInstanceTypes } from '../../../lib/sliders/sliders'

import {
  isSliderEnabled,
  mapInstanceConfigurations,
  getFirstSliderClusterFromGet,
} from '../../../lib/stackDeployments'

import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

type Props = {
  deployment: DeploymentSearchResponse
}

const maxNumberOfInstanceConfigsToShow = 4 // including Sliders

const DeploymentConfigurations: FunctionComponent<Props> = ({ deployment }) => {
  const aggsPerInstanceType = getAllKnownSliderInstanceTypes()
    .filter((sliderInstanceType) => isSliderEnabled({ deployment, sliderInstanceType }))
    .map((sliderInstanceType) => {
      const topologyElement = getFirstSliderClusterFromGet({ deployment, sliderInstanceType })!
      const aggs = mapInstanceConfigurations(topologyElement.info.topology.instances)
      return aggs
    })

  const configurations = flatMap(
    aggsPerInstanceType.map((aggs) =>
      aggs.map((agg) => (
        <DeploymentConfiguration
          instanceConfig={agg}
          key={agg.instanceConfig.id}
          name={agg.instanceConfig.name}
          memorySum={agg.memorySum}
          diskSum={agg.diskSum}
          resource={agg.instanceConfig.resource}
          zones={agg.zoneCount}
        />
      )),
    ),
  )

  return <Fragment>{getConfigurations(configurations)}</Fragment>
}

function getConfigurations(configurations) {
  const tooManyConfigurations = configurations.length > maxNumberOfInstanceConfigsToShow

  if (!tooManyConfigurations) {
    return configurations
  }

  const remainder = configurations.length - maxNumberOfInstanceConfigsToShow + 1

  const trimmedConfigs = configurations.slice(0, maxNumberOfInstanceConfigsToShow - 1)

  trimmedConfigs.push(
    <EuiFlexItem
      key='trimmed-configurations-message'
      style={{ alignSelf: `center` }}
      data-test-id='trimmed-configurations-message'
    >
      <EuiText size='s' color='subdued'>
        <FormattedMessage
          id='deployment-list-instance-configurations.plus-more'
          defaultMessage='{ remainder } other { remainder, plural, one {configuration} other {configurations} } …'
          values={{
            remainder,
          }}
        />
      </EuiText>
    </EuiFlexItem>,
  )

  return trimmedConfigs
}

export default DeploymentConfigurations
