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

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiSpacer, EuiButton, EuiFlexItem, EuiFlexGroup } from '@elastic/eui'

import AppSearchNotice from '../AppSearchNotice'
import messages from '../messages'

import { AllProps } from './types'

class AppSearchDeploymentPageNotice extends React.Component<AllProps> {
  componentDidMount() {
    const { deployment, fetchAppSearchReadOnlyMode } = this.props

    if (deployment) {
      fetchAppSearchReadOnlyMode({ deployment })
    }
  }

  render() {
    const { deployment, progress, startAppSearchToEnterpriseSearchMigration } = this.props

    const canContinue = deployment && progress?.readOnlyEnabled

    const content = (
      <Fragment>
        <FormattedMessage {...messages.deploymentInstances} />
        {deployment && canContinue && (
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiSpacer size='s' />
              <EuiButton
                fullWidth={false}
                onClick={() => {
                  startAppSearchToEnterpriseSearchMigration({ deployment })
                }}
              >
                <FormattedMessage
                  id='upgradable-deployment-version.appsearch-continue-migration'
                  defaultMessage='Continue migration'
                />
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        )}
      </Fragment>
    )

    return (
      <AppSearchNotice
        message={content}
        color='primary'
        storageKey='deployment'
        persistent={canContinue}
      />
    )
  }
}

export default AppSearchDeploymentPageNotice
