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
import { defineMessages, FormattedMessage, injectIntl, IntlShape } from 'react-intl'
import { isObject } from 'lodash'

import { EuiText, EuiSpacer } from '@elastic/eui'

import VacateOption from './VacateOption'
import VacateTargets from './VacateTargets'
import VacateTimeout from './VacateTimeout'

type Props = {
  intl: IntlShape
  regionId: string
  allocatorId: string
  getOption: (path: string[]) => any
  setOption: (path: string[], value: any) => void
}

const messages = defineMessages({
  gracefullyMoveData: {
    id: `allocator-vacate-options.gracefully-move-data`,
    defaultMessage: `Gracefully move data`,
  },
  skipSnapshot: {
    id: `allocator-vacate-options.skip-snapshot`,
    defaultMessage: `Skip snapshot`,
  },
  restoreSnapshotToLatestSuccess: {
    id: `allocator-vacate-options.restore-snapshot-to-latest-success`,
    defaultMessage: `Restore snapshot to latest success`,
  },
  extendedMaintenance: {
    id: `allocator-vacate-options.extended-maintenance`,
    defaultMessage: `Extended maintenance`,
  },
  setTargetAllocators: {
    id: `allocator-vacate-options.set-target-allocators`,
    defaultMessage: `Set target allocators`,
  },
  reallocate: {
    id: `allocator-vacate-options.reallocate`,
    defaultMessage: `Reallocate`,
  },
  setTimeout: {
    id: `allocator-vacate-options.set-timeout`,
    defaultMessage: `Set timeout`,
  },
  moveOnly: {
    id: `allocator-vacate-options.move-only`,
    defaultMessage: `Move only`,
  },
})

const extendedMaintenancePath = [`plan_configuration`, `extended_maintenance`]
const preferredAllocatorsPath = [`plan_configuration`, `preferred_allocators`]
const reallocateInstancesPath = [`plan_configuration`, `reallocate_instances`]
const restoreSnapshotPath = [`restore_snapshot`]
const skipMigrationPath = [`plan_configuration`, `skip_data_migration`]
const skipSnapshotPath = [`plan_configuration`, `skip_snapshot`]
const timeoutPath = [`plan_configuration`, `timeout`]
const moveOnlyPath = [`plan_configuration`, `move_only`]
const latestSuccess = `__latest_success__`
const indeterminate = `__indeterminate__`

const VacateOptions: FunctionComponent<Props> = ({
  intl: { formatMessage },
  regionId,
  allocatorId,
  getOption,
  setOption,
}) => {
  const timeout = getOption(timeoutPath)
  const skipMigration = getOption(skipMigrationPath)
  const skipSnapshot = getOption(skipSnapshotPath)
  const restoreSnapshot = getOption(restoreSnapshotPath)
  const extendedMaintenance = getOption(extendedMaintenancePath)
  const preferredAllocators = getOption(preferredAllocatorsPath)
  const reallocateInstances = getOption(reallocateInstancesPath)
  const moveOnly = getOption(moveOnlyPath)

  return (
    <div data-test-id='vacate-options'>
      <EuiText>
        <h3>
          <FormattedMessage
            id='allocator-vacate-options.vacate-options'
            defaultMessage='How do you want to move the nodes?'
          />
        </h3>
      </EuiText>

      <EuiSpacer size='s' />

      <VacateOption
        name={formatMessage(messages.gracefullyMoveData)}
        description={
          <FormattedMessage
            id='allocator-vacate-options.gracefully-move-data-description'
            defaultMessage="Gracefully move the data from the instances we're about to remove from the cluster before stopping them. {failsafeWarning}"
            values={{
              failsafeWarning: (
                <strong>
                  <FormattedMessage
                    id='allocator-vacate-options.gracefully-move-data-failsafe-warning'
                    defaultMessage='Never disable this setting at the same time as enabling {failsafe} on a non-Highly Available cluster since it can result in data loss.'
                    values={{
                      failsafe: <code>override_failsafe</code>,
                    }}
                  />
                </strong>
              ),
            }}
          />
        }
        checked={skipMigration === false}
        indeterminate={skipMigration === indeterminate}
        onChange={() => {
          const enable = skipMigration === false || skipMigration === indeterminate

          setOption(skipMigrationPath, enable)
        }}
      />

      <EuiSpacer size='s' />

      <VacateOption
        data-test-id='skip-snapshot-vacate-option'
        name={formatMessage(messages.skipSnapshot)}
        description={
          <FormattedMessage
            id='allocator-vacate-options.skip-snapshot-description'
            defaultMessage='If an allocator has failed or is otherwise unhealthy, select this option to move the nodes but disable the snapshot attempt. As this can perform potentially destructive actions on the deployment, do not use this option on a healthy allocator unless you are an advanced user.'
          />
        }
        checked={skipSnapshot === true}
        indeterminate={skipSnapshot === indeterminate}
        onChange={() => setOption(skipSnapshotPath, !skipSnapshot)}
      />

      <EuiSpacer size='s' />

      <VacateOption
        name={formatMessage(messages.restoreSnapshotToLatestSuccess)}
        description={
          <FormattedMessage
            id='allocator-vacate-options.restore-snapshot-to-last-success-description'
            defaultMessage='Restore the cluster to the last successful snapshot. Recommended for single-node clusters hosted on unhealthy allocators. Any data indexed after the last snapshot was taken is lost.'
          />
        }
        checked={isObject(restoreSnapshot)}
        indeterminate={restoreSnapshot === indeterminate}
        onChange={() => {
          const enabled = isObject(restoreSnapshot) || restoreSnapshot === indeterminate

          const value = enabled ? undefined : { snapshot_name: latestSuccess }

          setOption(restoreSnapshotPath, value)
        }}
      />

      <EuiSpacer size='s' />

      <VacateOption
        name={formatMessage(messages.extendedMaintenance)}
        description={
          <FormattedMessage
            id='allocator-vacate-options.extended-maintenance-description'
            defaultMessage='Keep new instances in maintenance mode until a snapshot has been restored. If not enabled, new instances remain in maintenance mode only until they can join a cluster.'
          />
        }
        checked={extendedMaintenance === true}
        indeterminate={extendedMaintenance === indeterminate}
        onChange={() => setOption(extendedMaintenancePath, !extendedMaintenance)}
      />

      <EuiSpacer size='s' />

      <VacateOption
        name={formatMessage(messages.setTargetAllocators)}
        description={
          <FormattedMessage
            id='allocator-vacate-options.set-vacate-target-description'
            defaultMessage='Request that instances be moved to the specified allocators. If no allocators are specified, or those specified are unsuitable for the instances being moved, then any suitable healthy allocator can be used.'
          />
        }
        checked={Array.isArray(preferredAllocators)}
        indeterminate={preferredAllocators === indeterminate}
        onChange={() => {
          const enabled =
            Array.isArray(preferredAllocators) || preferredAllocators === indeterminate

          const value = enabled ? undefined : []

          setOption(preferredAllocatorsPath, value)
        }}
      >
        <VacateTargets
          regionId={regionId}
          allocatorId={allocatorId}
          targets={preferredAllocators}
          setTargets={(targets) => setOption(preferredAllocatorsPath, targets)}
        />
      </VacateOption>

      <EuiSpacer size='s' />

      <VacateOption
        name={formatMessage(messages.reallocate)}
        description={
          <FormattedMessage
            id='allocator-vacate-options.reallocate-description'
            defaultMessage='Create new containers for all nodes in the cluster.'
          />
        }
        checked={reallocateInstances === true}
        indeterminate={reallocateInstances === indeterminate}
        onChange={() => setOption(reallocateInstancesPath, !reallocateInstances)}
      />

      <EuiSpacer size='s' />

      <VacateOption
        name={formatMessage(messages.moveOnly)}
        description={
          <FormattedMessage
            id='allocator-vacate-options.move-only-description'
            defaultMessage='Ignore all configurations and instead recreate a carbon copy of the selected instances on a new allocator.'
          />
        }
        checked={moveOnly === true}
        indeterminate={moveOnly === indeterminate}
        onChange={() => setOption(moveOnlyPath, !moveOnly)}
      />

      <EuiSpacer size='s' />

      <VacateOption
        name={formatMessage(messages.setTimeout)}
        description={
          <FormattedMessage
            id='allocator-vacate-options.set-timeout-description'
            defaultMessage='Extend the timeout interval, in seconds, in case moving the nodes takes longer than expected.'
          />
        }
        checked={typeof timeout === `number`}
        indeterminate={timeout === indeterminate}
        onChange={() => {
          const enabled = typeof timeout === `number` || timeout === indeterminate

          const value = enabled ? undefined : 0

          setOption(timeoutPath, value)
        }}
      >
        <VacateTimeout
          timeout={timeout}
          setTimeout={(timeout) => {
            const value = Math.max(timeout, 0)

            setOption(timeoutPath, value)
          }}
        />
      </VacateOption>
    </div>
  )
}

export default injectIntl(VacateOptions)
