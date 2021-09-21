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

import { get } from 'lodash'

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCheckbox } from '@elastic/eui'

import Field, { CompositeField, Fieldset, DiffLabel } from '../Field'

import MasterNodesSelect from './MasterNodesSelect'

import { planPaths } from '../../config/clusterPaths'

import prettySize from '../../lib/prettySize'

import { ElasticsearchClusterPlan } from '../../lib/api/v1/types'

type Props = {
  lastSuccessfulPlan: ElasticsearchClusterPlan | null
  plan: ElasticsearchClusterPlan | null
  updatePlan: (path: string | string[], value: any) => void
}

class MasterOnlyNodes extends Component<Props> {
  componentDidUpdate() {
    const { plan, updatePlan } = this.props
    const masterNodes = get(plan, planPaths.masterNodeCount)
    const masterNodeCapacity = get(plan, planPaths.masterNodeCapacity, 0)
    const masterNodeConfigurationId = get(plan, planPaths.masterNodeConfigurationId)
    const masterNodeTypes = get(plan, planPaths.masterNodeTypes)
    const masterNodeZoneCount = get(plan, planPaths.masterNodeZoneCount)
    const dataNodeZoneCount = get(plan, planPaths.dataNodeZoneCount, 1)

    if (masterNodes > 0 && masterNodeCapacity === 0) {
      updatePlan(planPaths.masterNodeCapacity, 1024)

      if (!masterNodeConfigurationId) {
        updatePlan(planPaths.masterNodeConfigurationId, `master.legacy`)
      }

      if (!masterNodeTypes) {
        updatePlan(planPaths.masterNodeTypes, {
          master: true,
          data: false,
          ingest: false,
          ml: false,
        })
      }

      if (!masterNodeZoneCount) {
        updatePlan(planPaths.masterNodeZoneCount, dataNodeZoneCount)
      }
    }
  }

  render() {
    const { plan, updatePlan, lastSuccessfulPlan } = this.props

    const masterNodeCapacity = get(plan, planPaths.masterNodeCapacity)
    const masterNodes = get(plan, planPaths.masterNodeCount)
    const iconTitle = createIconTitle(masterNodes, masterNodeCapacity, lastSuccessfulPlan)

    return (
      <Field>
        <DiffLabel iconTitle={iconTitle}>
          <FormattedMessage
            id='deployment-configure-master-only-nodes.label-count'
            defaultMessage='Dedicated master-eligible nodes'
          />
        </DiffLabel>
        <Fieldset>
          <CompositeField>
            <EuiCheckbox
              id='master-eligible-nodes'
              checked={masterNodes > 0}
              onChange={() => updatePlan(planPaths.masterNodeCount, masterNodes ? 0 : 1)}
              label={
                <FormattedMessage
                  id='deployment-configure-master-only-nodes.description-count'
                  defaultMessage='Create a dedicated master-eligible node in each zone'
                />
              }
            />
          </CompositeField>

          <MasterNodesSelect
            masterNodes={masterNodes}
            masterNodeCapacity={masterNodeCapacity}
            updatePlan={updatePlan}
          />
        </Fieldset>
      </Field>
    )
  }
}

export default MasterOnlyNodes

function createIconTitle(
  masterNodes: number,
  masterNodeCapacity: number,
  lastSuccessfulPlan: ElasticsearchClusterPlan | null,
) {
  const capacityIconTitle = createCapacityIconTitle(masterNodeCapacity, lastSuccessfulPlan)
  const countIconTitle = createCountIconTitle(masterNodes, lastSuccessfulPlan)

  return countIconTitle || capacityIconTitle
}

function createCapacityIconTitle(
  masterNodeCapacity: number,
  lastSuccessfulPlan: ElasticsearchClusterPlan | null,
) {
  const lastCapacity = get(lastSuccessfulPlan, planPaths.masterNodeCapacity)
  const diffCapacity = lastCapacity != null && lastCapacity !== masterNodeCapacity

  if (!diffCapacity) {
    return null
  }

  return (
    <FormattedMessage
      id='deployment-configure-master-only-nodes.diff-icon-capacity'
      defaultMessage='You selected {current} node capacity. (It was {previous} before.)'
      values={{
        current: prettySize(masterNodeCapacity),
        previous: prettySize(lastCapacity),
      }}
    />
  )
}

function createCountIconTitle(
  masterNodes: number,
  lastSuccessfulPlan: ElasticsearchClusterPlan | null,
) {
  const lastCount = get(lastSuccessfulPlan, planPaths.masterNodeCount)
  const diffCount = lastSuccessfulPlan && lastCount !== masterNodes

  if (!diffCount) {
    return null
  }

  return (
    <FormattedMessage
      id='deployment-configure-master-only-nodes.diff-icon-count'
      defaultMessage='You turned dedicated master-eligible nodes {current}. (They were {previous} before.)'
      values={{
        current: truthyToText(masterNodes),
        previous: truthyToText(lastCount),
      }}
    />
  )
}

function truthyToText(value: any): 'on' | 'off' {
  return value ? `on` : `off`
}
