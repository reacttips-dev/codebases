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

import { EuiBadge, EuiHorizontalRule, EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui'

import PrivacySensitiveContainer from '../../PrivacySensitiveContainer'
import StackDeploymentStatus from '../../StackDeploymentStatus'

import { isCrossClusterSearch } from '../../../lib/deployments/ccs'
import { getThemeColors } from '../../../lib/theme'

import {
  getDisplayId,
  getDisplayName,
  getEsDeploymentTemplateId,
  getFirstEsClusterFromGet,
  getVersion,
  isSystemOwned,
} from '../../../lib/stackDeployments'

import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

type Props = {
  deployment: DeploymentSearchResponse
}

const Title: FunctionComponent<Props> = ({ deployment }) => {
  const { euiColorDarkShade } = getThemeColors()
  const esResource = getFirstEsClusterFromGet({ deployment })
  const deploymentTemplateId = esResource && getEsDeploymentTemplateId({ resource: esResource })
  const displayName = getDisplayName({ deployment })
  const displayId = getDisplayId({ deployment })
  const systemOwned = isSystemOwned({ deployment })
  const version = esResource && getVersion({ deployment })
  const hasCcs = isCrossClusterSearch({ deploymentTemplateId, systemOwned })

  return (
    <Fragment>
      <EuiFlexGroup justifyContent='spaceBetween' responsive={false}>
        <EuiFlexItem className='eui-textTruncate' grow={false}>
          <EuiTitle className='eui-textTruncate' size='s'>
            <h2 className='deploymentCard-displayName' data-test-id='deploymentTitle'>
              <PrivacySensitiveContainer nativeElementType='span'>
                {displayName}
              </PrivacySensitiveContainer>
            </h2>
          </EuiTitle>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <StackDeploymentStatus deployment={deployment} />
        </EuiFlexItem>
      </EuiFlexGroup>

      <div>
        {displayId !== displayName && (
          <EuiBadge color='hollow' data-test-id='title-id-badge'>
            {displayId}
          </EuiBadge>
        )}

        {Boolean(version) && <EuiBadge data-test-id='title-version-badge'>v{version}</EuiBadge>}

        {hasCcs && (
          <EuiBadge color={euiColorDarkShade}>
            <FormattedMessage
              id='deployment-card-title.ccs'
              defaultMessage='Cross cluster search'
            />
          </EuiBadge>
        )}
      </div>

      <EuiHorizontalRule margin='s' />
    </Fragment>
  )
}

export default Title
