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
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { EuiCallOut, EuiSpacer } from '@elastic/eui'

import { deploymentIlmMigrationUrl } from '../../../lib/urlBuilder'
import { shouldMigrateToIlm } from '../../../lib/stackDeployments'

import DocLink from '../../DocLink'
import { CuiRouterLinkButton } from '../../../cui'

import { StackDeployment } from '../../../types'

export interface Props extends WrappedComponentProps {
  stackDeployment?: StackDeployment | null
  ilmMigrationFeature: boolean
}

const IlmDeploymentMigrationCallout: FunctionComponent<Props> = ({
  stackDeployment,
  ilmMigrationFeature,
}) => {
  if (!stackDeployment || !shouldMigrateToIlm({ deployment: stackDeployment })) {
    return null
  }

  if (!ilmMigrationFeature) {
    return null
  }

  return (
    <Fragment>
      <EuiCallOut
        data-test-id='ilmDeploymentMigration-callout'
        title={
          <FormattedMessage
            id='ilm-deployment-migration-callout.title'
            defaultMessage='Migrate index curation to index lifecycle management (ILM)'
          />
        }
        iconType='iInCircle'
      >
        <Fragment>
          <p>
            <FormattedMessage
              id='ilm-deployment-migration-callout.description'
              defaultMessage='Index curation will soon be deprecated and replaced by {ilm}. Migrate your index curation patterns into ILM policies and make sure your deployment is up-to-date.'
              values={{
                ilm: (
                  <DocLink link='indexManagementDocLink'>
                    <FormattedMessage
                      id='ilm-deployment-migration-callout.ilm'
                      defaultMessage='index lifecycle management (ILM)'
                    />
                  </DocLink>
                ),
              }}
            />
          </p>
          <CuiRouterLinkButton
            to={deploymentIlmMigrationUrl(stackDeployment.id)}
            data-test-id='ilmDeploymentMigration-button'
          >
            <FormattedMessage
              id='ilm-deployment-migration-callout.start-migration'
              defaultMessage='Start migration'
            />
          </CuiRouterLinkButton>
        </Fragment>
      </EuiCallOut>
      <EuiSpacer />
    </Fragment>
  )
}

export default injectIntl(IlmDeploymentMigrationCallout)
