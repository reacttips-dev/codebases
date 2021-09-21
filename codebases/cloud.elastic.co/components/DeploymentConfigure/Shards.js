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

import { EuiFieldNumber, EuiFormHelpText } from '@elastic/eui'

import Field, { CompositeField, DiffLabel } from '../Field'
import ExternalLink from '../ExternalLink'
import { planPaths } from '../../config/clusterPaths'

function toShards(shards) {
  return parseInt(shards, 10)
}

function Shards({ plan, updatePlan, lastSuccessfulPlan }) {
  const setNumberOfShards = (shards) => {
    updatePlan(planPaths.numberOfShards, toShards(shards))
  }

  const numberOfShards = get(plan, planPaths.numberOfShards)
  const lastNumberOfShards = get(lastSuccessfulPlan, planPaths.numberOfShards)
  const highlight = lastNumberOfShards && lastNumberOfShards !== numberOfShards

  return (
    <Field>
      <DiffLabel
        iconTitle={
          highlight
            ? `You chose ${numberOfShards} shards. (It was ${lastNumberOfShards} before.)`
            : null
        }
      >
        <FormattedMessage
          id='deployment-configure-shards.default-number-of-shards'
          defaultMessage='Default number of shards'
        />
      </DiffLabel>

      <CompositeField>
        <EuiFieldNumber
          data-test-id='configure-deployment-number-of-shards'
          value={numberOfShards}
          onChange={(e) => setNumberOfShards(e.target.value)}
        />

        <EuiFormHelpText>
          <FormattedMessage
            id='deployment-configure-shards.see-a-to-learn-more-about-sharding-and-partitioning-strategies-this-changes-the-cluster-level-default-setting'
            defaultMessage='See {sizingEs} to learn more about sharding and partitioning strategies. This changes the cluster-level default setting.'
            values={{
              sizingEs: (
                <ExternalLink href='https://www.elastic.co/blog/found-sizing-elasticsearch'>
                  <FormattedMessage
                    id='deployment-configure-shards.sizing-elasticsearch'
                    defaultMessage='Sizing Elasticsearch'
                  />
                </ExternalLink>
              ),
            }}
          />
        </EuiFormHelpText>
      </CompositeField>
    </Field>
  )
}

Shards.propTypes = {
  plan: PropTypes.object.isRequired,
  updatePlan: PropTypes.func.isRequired,
}

export default Shards
