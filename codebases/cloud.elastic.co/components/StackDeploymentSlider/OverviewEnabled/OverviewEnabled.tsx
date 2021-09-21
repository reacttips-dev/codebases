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

import { EuiTitle, EuiText, EuiFlexItem, EuiFlexGroup, EuiSpacer } from '@elastic/eui'

import RestartResource from './RestartResource'
import RestartStoppedResource from './RestartStoppedResource'
import StopResource from './StopResource'
import DeleteResource from './DeleteResource'
import UnhideResource from './UnhideResource'

import SliderAppLinks from '../SliderAppLinks'

import NodesVisualization from '../../StackDeployments/StackDeploymentNodesVisualization'

import ResourceComments from '../../ResourceComments'
import ClusterLockingGate from '../../ClusterLockingGate'
import DocLink from '../../DocLink'

import ApmIntroNotification from './ApmIntroNotification'

import { getSliderDefinition, getSliderDocLink } from '../../../lib/sliders'
import { isFleetServerAvailable, isHiddenResource } from '../../../lib/stackDeployments'

import {
  countInstances,
  getPlanInfo,
  getResourceVersion,
  isSliderPlanActive,
  isStopped,
} from '../../../lib/stackDeployments/selectors'

import { getConfigForKey } from '../../../store'

import { AnyResourceInfo, RegionId, SliderInstanceType, StackDeployment } from '../../../types'

type Props = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  regionId: RegionId
  sliderInstanceType: SliderInstanceType
  showNativeMemoryPressure: boolean
  hideDelete: boolean
}

const OverviewEnabled: FunctionComponent<Props> = ({
  deployment,
  resource,
  regionId,
  sliderInstanceType,
  showNativeMemoryPressure,
  hideDelete,
}) => {
  const plan = getPlanInfo({ resource })
  const version = getResourceVersion({ resource })

  const { messages } = getSliderDefinition({ sliderInstanceType, version })
  const docLink = getSliderDocLink({ sliderInstanceType, version })

  const active = isSliderPlanActive(plan, sliderInstanceType)
  const stopped = isStopped({ resource })
  const hidden = isHiddenResource({ resource })
  const { running, totalReported } = countInstances({ resource })

  const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`
  const isApm = sliderInstanceType === `apm`

  return (
    <div>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiFlexGroup direction='column'>
            <EuiFlexItem>
              <EuiText grow={false}>
                <FormattedMessage
                  id='slider-description.message'
                  defaultMessage='{description} {docLink}'
                  values={{
                    description: <FormattedMessage {...messages.description} />,
                    docLink: docLink && (
                      <DocLink link={docLink}>
                        <FormattedMessage
                          id='slider-description.link'
                          defaultMessage='Learn more'
                        />
                        .
                      </DocLink>
                    ),
                  }}
                />
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              {isApm && !isFleetServerAvailable({ version }) && (
                <ApmIntroNotification deployment={deployment} />
              )}

              <SliderAppLinks
                deployment={deployment}
                resource={resource}
                sliderInstanceType={sliderInstanceType}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <ClusterLockingGate>
          <EuiFlexItem grow={false} className='sliderOverview-managementButtons'>
            <fieldset className='sliderOverview-managementButtonsContainer'>
              <legend className='sliderOverview-managementButtonsLegend'>
                <FormattedMessage
                  id='slider-overview.legend'
                  defaultMessage='{prettyName} Management'
                  values={{ prettyName: <FormattedMessage {...messages.prettyName} /> }}
                />
              </legend>
              {hidden ? (
                <UnhideResource
                  deployment={deployment}
                  resource={resource}
                  sliderInstanceType={sliderInstanceType}
                />
              ) : (
                <Fragment>
                  {active && !stopped && (
                    <RestartResource
                      deployment={deployment}
                      resource={resource}
                      sliderInstanceType={sliderInstanceType}
                    />
                  )}
                  {stopped && running === 0 ? (
                    <RestartStoppedResource
                      deployment={deployment}
                      resource={resource}
                      sliderInstanceType={sliderInstanceType}
                    />
                  ) : (
                    !hideDelete && (
                      <StopResource
                        deployment={deployment}
                        resource={resource}
                        sliderInstanceType={sliderInstanceType}
                        hide={isUserConsole}
                      />
                    )
                  )}
                  {!isUserConsole && !hideDelete && (
                    <DeleteResource
                      deployment={deployment}
                      resource={resource}
                      sliderInstanceType={sliderInstanceType}
                    />
                  )}
                </Fragment>
              )}
            </fieldset>
          </EuiFlexItem>
        </ClusterLockingGate>
      </EuiFlexGroup>

      <EuiSpacer size='xxl' />

      {totalReported === 0 || (
        <Fragment>
          <NodesVisualization
            title={
              <EuiTitle size='s'>
                <h3>
                  <FormattedMessage id='deployment-info.instances' defaultMessage='Instances' />
                </h3>
              </EuiTitle>
            }
            deployment={deployment}
            showNativeMemoryPressure={showNativeMemoryPressure}
            sliderInstanceType={sliderInstanceType}
          />
        </Fragment>
      )}

      <ResourceComments
        spacerBefore={true}
        resourceType={sliderInstanceType}
        regionId={regionId}
        resourceId={resource.id}
      />
    </div>
  )
}

export default OverviewEnabled
