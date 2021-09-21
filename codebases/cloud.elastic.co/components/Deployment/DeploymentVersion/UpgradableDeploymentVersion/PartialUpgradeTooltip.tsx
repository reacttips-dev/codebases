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

import { flatMap, last } from 'lodash'

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiPopoverTitle, EuiText, EuiIcon } from '@elastic/eui'

import { CuiHelpTipIcon } from '../../../../cui'

import { getSliderPrettyName } from '../../../../lib/sliders'
import {
  getHighestSliderVersion,
  getSliderInstanceVersions,
  getSliderVersion,
  isStarted,
} from '../../../../lib/stackDeployments'

import { DeploymentResources } from '../../../../lib/api/v1/types'
import { SliderInstanceType, StackDeployment, AnyResourceInfo } from '../../../../types'

type InconsistentVersionMapping = {
  sliderInstanceType: SliderInstanceType
  versions: string[]
  highestVersion: string
}

type Props = {
  deployment: StackDeployment
}

const PartialUpgradeTooltip: FunctionComponent<Props> = ({ deployment }) => (
  <CuiHelpTipIcon
    aria-label='Deployment partially upgraded'
    data-test-id='partial-upgrade-tooltip'
    color='warning'
    iconType='alert'
    width={400}
  >
    <Fragment>
      <EuiPopoverTitle>
        <FormattedMessage
          id='upgradable-deployment-version.version-mismatch-title'
          defaultMessage='Version inconsistent'
        />
      </EuiPopoverTitle>

      {getVersionMappingsForResources({ deployment }).map(
        ({ sliderInstanceType, versions, highestVersion }) => {
          const version = getSliderVersion({ deployment, sliderInstanceType })
          const upToDateVersions = versions.filter((v) => v === highestVersion)
          const isUpToDate = upToDateVersions.length === versions.length
          const maxVersion = last(versions) // versions are sorted lowest to highest
          const iconProps = isUpToDate
            ? {
                type: 'checkInCircleFilled',
                color: 'secondary',
              }
            : {
                type: 'alert',
                color: 'warning',
              }

          return (
            <EuiFlexGroup key={sliderInstanceType} style={{ marginTop: 0 }}>
              <EuiFlexItem>
                <EuiText size='s'>
                  <EuiIcon {...iconProps} style={{ marginRight: `.4rem` }} />
                  <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiText size='s'>{maxVersion}</EuiText>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText color='subdued' size='s'>
                  {formatResourceUpgradeStatusMessage(versions.length, upToDateVersions.length)}
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          )
        },
      )}
    </Fragment>
  </CuiHelpTipIcon>
)

function getVersionMappingsForResources({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): InconsistentVersionMapping[] {
  const highestVersion = getHighestSliderVersion({ deployment })

  return flatMap<SliderInstanceType, InconsistentVersionMapping>(
    Object.keys(deployment.resources),
    (sliderInstanceType) =>
      (deployment.resources[sliderInstanceType] || [])
        .filter((resource: AnyResourceInfo) => isStarted({ resource }))
        .map((resource: AnyResourceInfo) => {
          const versions = getSliderInstanceVersions({ resource, sliderInstanceType })
          return {
            sliderInstanceType,
            versions,
            highestVersion,
          }
        }),
  )
}

function formatResourceUpgradeStatusMessage(
  allVersionsCount: number,
  upToDateVersionsCount: number,
) {
  if (allVersionsCount === upToDateVersionsCount) {
    return (
      <FormattedMessage
        id='upgradable-deployment-version.version-mismatch-description-ok'
        defaultMessage='All instances upgraded'
      />
    )
  }

  if (upToDateVersionsCount === 0) {
    return (
      <FormattedMessage
        id='upgradable-deployment-version.version-mismatch-description-fail'
        defaultMessage='No instances upgraded'
      />
    )
  }

  return (
    <FormattedMessage
      id='upgradable-deployment-version.version-mismatch-description-partial'
      defaultMessage='{target}/{source} instances upgraded'
      values={{
        source: allVersionsCount,
        target: upToDateVersionsCount,
      }}
    />
  )
}

export default PartialUpgradeTooltip
