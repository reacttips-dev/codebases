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
import { EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import { getDeploymentTemplateId } from '../../../lib/stackDeployments'

import { StackDeployment } from '../../../types'
import DocLink from '../../../components/DocLink'
import { isCrossClusterSearch } from '../../../lib/deployments/ccs'
import { getConfigForKey } from '../../../store'

export interface Props {
  stackDeployment?: StackDeployment | null
}

const CCSMigrationNotification: FunctionComponent<Props> = ({ stackDeployment }) => {
  if (getConfigForKey(`APP_PLATFORM`) !== `saas`) {
    return null
  }

  if (!stackDeployment) {
    return null
  }

  const deploymentTemplateId = getDeploymentTemplateId({ deployment: stackDeployment })

  if (!isCrossClusterSearch({ deploymentTemplateId, systemOwned: false })) {
    return null
  }

  return (
    <Fragment>
      <EuiCallOut
        color='warning'
        title={
          <EuiFlexGroup>
            <EuiFlexItem>
              <FormattedMessage
                id='ccs-migration-notification.title'
                defaultMessage='Dedicated cross cluster search deployments are deprecated'
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        }
      >
        <FormattedMessage
          id='ccs-migration-notification.description'
          defaultMessage='Cross-cluster search and replication are now available for all deployments. As part of this change, we are deprecating dedicated cross-cluster search deployments. You can continue using your deployment, however, we recommend migrating to a different template as soon as possible since you will be required to migrate before upgrading to the next Elastic Stack 8.0 major version. Use the following {docLink}.'
          values={{
            docLink: (
              <DocLink link='migrateCCS'>
                <FormattedMessage
                  id='ccs-migration-notification.link'
                  defaultMessage='instructions to migrate'
                />
              </DocLink>
            ),
          }}
        />
      </EuiCallOut>
      <EuiSpacer />
    </Fragment>
  )
}

export default CCSMigrationNotification
