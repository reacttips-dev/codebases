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

import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import SnapshotStat, { DateStat } from '../SnapshotStatus/SnapshotStat'

import ExternalLink from '../../../ExternalLink'

import { getFirstSliderClusterFromGet } from '../../../../lib/stackDeployments'

import {
  kibanaSnapshotAndRestoreUrl,
  kibanaSnapshotPolicyUrl,
} from '../../../../lib/serviceProviderDeepLinks'

import { StackDeployment } from '../../../../types'
import { KibanaResourceInfo } from '../../../../lib/api/v1/types'

type Props = {
  status: {
    nextSnapshotAt: string | null
    latestSuccessAt: string | null
    hasRecentEnoughSuccess: boolean
  }
  deployment: StackDeployment
}

const SlmSnapshotStatus: FunctionComponent<Props> = ({
  status: { nextSnapshotAt, latestSuccessAt, hasRecentEnoughSuccess },
  deployment,
}) => {
  const kibana = getFirstSliderClusterFromGet<KibanaResourceInfo>({
    deployment,
    sliderInstanceType: `kibana`,
  })

  return (
    <Fragment>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel>
            <SnapshotStat
              label={
                <FormattedMessage
                  id='deployment-snapshots-status.last-successful-snapshot'
                  defaultMessage='Last successful snapshot'
                />
              }
              color={hasRecentEnoughSuccess ? undefined : `danger`}
            >
              <DateStat date={latestSuccessAt} />
            </SnapshotStat>
          </EuiPanel>
        </EuiFlexItem>

        {nextSnapshotAt && (
          <EuiFlexItem>
            <EuiPanel>
              <SnapshotStat
                label={
                  <FormattedMessage
                    id='deployment-snapshots-status.next-snapshot'
                    defaultMessage='Next snapshot'
                  />
                }
              >
                <DateStat date={nextSnapshotAt} />
              </SnapshotStat>
              <EuiText size='s'>
                <ExternalLink href={kibanaSnapshotPolicyUrl({ resource: kibana })}>
                  <FormattedMessage
                    id='deployment-snapshots-status.modify-frequency'
                    defaultMessage='Modify frequency'
                  />
                </ExternalLink>
              </EuiText>
            </EuiPanel>
          </EuiFlexItem>
        )}

        <EuiFlexItem>
          <EuiPanel>
            <SnapshotStat
              label={
                <FormattedMessage
                  id='deployment-snapshots-status.snapshot-management'
                  defaultMessage='Snapshot management'
                />
              }
            >
              <EuiButton
                href={kibanaSnapshotAndRestoreUrl({ resource: kibana })}
                target='_blank'
                iconType='popout'
                iconSide='right'
                className='manage-in-kibana-button'
              >
                <EuiIcon type='logoKibana' size='m' />

                <FormattedMessage
                  id='deployment-snapshots-status.snapshot-management-cta'
                  defaultMessage='Snapshot and Restore'
                />
              </EuiButton>
            </SnapshotStat>

            <EuiText color='subdued' size='s'>
              <FormattedMessage
                id='deployment-snapshots-status.snapshot-management-kibana'
                defaultMessage='Manage in Kibana'
              />
            </EuiText>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size='m' />
    </Fragment>
  )
}

export default SlmSnapshotStatus
