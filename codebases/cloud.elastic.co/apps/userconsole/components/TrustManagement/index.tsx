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

import { EuiDescribedFormGroup, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import SetDefaultTrust from '../../../../components/TrustManagement/SetDefaultTrust'

import Header from '../../../../components/Header'

import { trustManagementCrumbs } from '../../../../lib/crumbBuilder'

const TrustManagement: FunctionComponent = () => (
  <Fragment>
    <Header
      name={<FormattedMessage id='trust-management.ess-title' defaultMessage='Trust Management' />}
      breadcrumbs={trustManagementCrumbs()}
    />

    <EuiSpacer size='l' />

    <EuiDescribedFormGroup
      fullWidth={true}
      title={
        <h4>
          <FormattedMessage
            id='trust-management.ess-default-trust-heading'
            defaultMessage='Default trust within your environment'
          />
        </h4>
      }
      description={
        <Fragment>
          <p>
            <FormattedMessage
              id='trust-management.ess-default-trust-description'
              defaultMessage='Select the default trust level that a new deployment establishes with other deployments from this account.'
            />
          </p>
        </Fragment>
      }
    >
      <EuiFlexGroup>
        <EuiFlexItem grow={true}>
          <SetDefaultTrust />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiDescribedFormGroup>
  </Fragment>
)

export default TrustManagement
