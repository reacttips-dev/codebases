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
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiLink, EuiTitle } from '@elastic/eui'

import { CuiBeveledIcon } from '../../../../../cui/BeveledIcon'

import TrialBadge from '../../../../CustomerProfile/TrialBadge'

import history from '../../../../../lib/history'
import { deploymentsUrl } from '../../../../../lib/urlBuilder'

import { UserProfile } from '../../../../../types'

import './elasticsearchServiceTileTitle.scss'

export interface Props {
  profile?: UserProfile | null
}

const ElasticSearchServiceTileTitle: FunctionComponent<Props> = ({ profile }) => (
  <EuiFlexGroup
    gutterSize='m'
    className='elasticSearchServiceTile-title'
    alignItems='center'
    responsive={false}
  >
    <EuiFlexItem grow={false}>
      <EuiFlexGroup responsive={false} gutterSize='s' alignItems='center'>
        <EuiFlexItem grow={false} className='elasticSearchServiceTile-cloud-logo'>
          <CuiBeveledIcon type='logoElasticsearch' />
        </EuiFlexItem>

        <EuiFlexItem grow={false} className='elasticSearchServiceTile-title-text'>
          <EuiTitle size='xs'>
            <h2>
              <EuiLink
                onClick={() => history.push(deploymentsUrl())}
                color='text'
                data-test-id='portal-ess-title-link'
                className='cloud-portal-tile-title'
              >
                <FormattedMessage
                  id='elasticsearch-service.title'
                  defaultMessage='Elasticsearch Service'
                />
              </EuiLink>
            </h2>
          </EuiTitle>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>

    {profile && profile.inTrial && profile.currentTrial && (
      <TrialBadge
        hasExpiredTrial={profile.hasExpiredTrial}
        trialDaysRemaining={profile.trialDaysRemaining}
      />
    )}
  </EuiFlexGroup>
)

export default ElasticSearchServiceTileTitle
