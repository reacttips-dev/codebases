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

import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'
import jif from 'jif'

import { EuiFieldNumber, EuiFormHelpText, EuiFormErrorText } from '@elastic/eui'

import Field, { CompositeField, DiffLabel } from '../Field'
import toNumber from '../../lib/toNumber'
import { planPaths } from '../../config/clusterPaths'

function InstanceCount({ plan, updatePlan, lastSuccessfulPlan, validationError }) {
  const instanceCount = get(plan, planPaths.instanceCount)
  const lastInstanceCount = get(lastSuccessfulPlan, planPaths.instanceCount)
  const highlight = lastInstanceCount && lastInstanceCount !== instanceCount

  return (
    <Field>
      <DiffLabel
        iconTitle={
          highlight
            ? `You selected ${instanceCount} nodes. (It was ${lastInstanceCount} before.)`
            : null
        }
      >
        <FormattedMessage
          id='deployment-configure-instance-count.node-count'
          defaultMessage='Node count'
        />
      </DiffLabel>

      <CompositeField>
        <EuiFieldNumber
          min={1}
          value={instanceCount}
          onChange={(e) => updatePlan(planPaths.instanceCount, toNumber(e.target.value))}
        />

        {jif(validationError != null, () => (
          <EuiFormErrorText>{validationError}</EuiFormErrorText>
        ))}

        <EuiFormHelpText>
          <FormattedMessage
            id='deployment-configure-instance-count.how-many-nodes-per-zone'
            defaultMessage='How many nodes do you want in each zone?'
          />
        </EuiFormHelpText>
      </CompositeField>
    </Field>
  )
}

InstanceCount.propTypes = {
  lastSuccessfulPlan: PropTypes.object,
  plan: PropTypes.object.isRequired,
  updatePlan: PropTypes.func.isRequired,
  validationError: PropTypes.string,
}

export default InstanceCount
