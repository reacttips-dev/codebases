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
import PropTypes from 'prop-types'

import { EuiSpacer } from '@elastic/eui'

import InstanceCount from './InstanceCount'
import InstanceCapacity from './InstanceCapacity'

function Instances({
  regionId,
  plan,
  updatePlan,
  lastSuccessfulPlan,
  validationErrors,
  isCapacityFixed,
  showInstanceCount = true,
}) {
  return (
    <Fragment>
      {showInstanceCount && (
        <Fragment>
          <InstanceCount
            lastSuccessfulPlan={lastSuccessfulPlan}
            plan={plan}
            updatePlan={updatePlan}
            validationError={validationErrors == null ? null : validationErrors.instanceCount}
          />

          <EuiSpacer size='m' />
        </Fragment>
      )}

      <InstanceCapacity
        regionId={regionId}
        lastSuccessfulPlan={lastSuccessfulPlan}
        plan={plan}
        updatePlan={updatePlan}
        isFixed={isCapacityFixed}
      />
    </Fragment>
  )
}

Instances.propTypes = {
  regionId: PropTypes.string.isRequired,
  lastSuccessfulPlan: PropTypes.object,
  plan: PropTypes.object.isRequired,
  updatePlan: PropTypes.func.isRequired,
  validationErrors: PropTypes.object,
}

export default Instances
