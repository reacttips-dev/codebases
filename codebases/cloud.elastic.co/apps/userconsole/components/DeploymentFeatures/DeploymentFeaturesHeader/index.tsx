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

import { EuiText } from '@elastic/eui'
import Header from '../../../../../components/Header'
import { deploymentFeaturesCrumbs } from '../../../../../lib/crumbBuilder'

const DeploymentFeaturesHeader: FunctionComponent = () => (
  <Header
    name={
      <FormattedMessage
        id='deployment-features-page-title'
        defaultMessage='Enhance your deployments'
      />
    }
    breadcrumbs={deploymentFeaturesCrumbs()}
    subHeading={
      <EuiText color='subdued'>
        <FormattedMessage
          id='deployment-features-intro'
          defaultMessage='Take advantage of a range of features to improve the security and functionality of your deployments.'
        />
      </EuiText>
    }
  />
)

export default DeploymentFeaturesHeader
