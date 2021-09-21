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

import { EuiSpacer } from '@elastic/eui'

import FeatureDescription from './FeatureDescription'

type Props = {
  outOfComplianceFeatures: { [key: string]: any }
}

const DeploymentFeaturesAboveSubscriptionLevel: FunctionComponent<Props> = ({
  outOfComplianceFeatures,
}) => {
  const subscriptionLevels = Object.keys(outOfComplianceFeatures)

  return (
    <Fragment>
      <EuiSpacer size='m' />
      <div style={{ paddingLeft: '24px' }}>
        {subscriptionLevels.map((level) =>
          outOfComplianceFeatures[level].map((feature) => (
            <FeatureDescription level={level} feature={feature} />
          )),
        )}
      </div>
    </Fragment>
  )
}

export default DeploymentFeaturesAboveSubscriptionLevel
