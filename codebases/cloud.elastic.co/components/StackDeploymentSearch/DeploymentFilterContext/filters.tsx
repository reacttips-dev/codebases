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

import { isEqual, sortBy, uniq, uniqBy, flatten } from 'lodash'

import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import {
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  FieldValueOptionType,
  SearchFilterConfig,
} from '@elastic/eui'

import { excludeSchemalessFields, CuiSliderLogo } from '../../../cui'
import { getSchema, getProductFieldName } from './schema'

import { rcompare } from '../../../lib/semver'
import { getRegionIds } from '../../../lib/regionEqualizer'

import {
  getSupportedProductSliderTypes,
  getSliderPrettyName,
  sortSliderTypes,
} from '../../../lib/sliders'

const messages = defineMessages({
  loading: {
    id: `deployment-filter-context.loading`,
    defaultMessage: `Loading …`,
  },
  healthLabel: {
    id: `deployment-filter-context.health-label`,
    defaultMessage: `Health`,
  },
  healthyLabel: {
    id: `deployment-filter-context.healthy-label`,
    defaultMessage: `Healthy`,
  },
  unhealthyLabel: {
    id: `deployment-filter-context.unhealthy-label`,
    defaultMessage: `Unhealthy`,
  },
  lockedLabel: {
    id: `deployment-filter-context.locked-label`,
    defaultMessage: `Locked`,
  },
  systemOwnedLabel: {
    id: `deployment-filter-context.system-owned-label`,
    defaultMessage: `System owned`,
  },
  healthyConfigurationLabel: {
    id: `deployment-filter-context.healthy-configuration-label`,
    defaultMessage: `Healthy configuration change`,
  },
  unhealthyConfigurationLabel: {
    id: `deployment-filter-context.unhealthy-configuration-label`,
    defaultMessage: `Unhealthy configuration change`,
  },
  healthyMastersLabel: {
    id: `deployment-filter-context.healthy-masters-label`,
    defaultMessage: `Healthy masters`,
  },
  unhealthyMastersLabel: {
    id: `deployment-filter-context.unhealthy-masters-label`,
    defaultMessage: `Unhealthy masters`,
  },
  healthyShardsLabel: {
    id: `deployment-filter-context.healthy-shards-label`,
    defaultMessage: `Healthy shards`,
  },
  unhealthyShardsLabel: {
    id: `deployment-filter-context.unhealthy-shards-label`,
    defaultMessage: `Unhealthy shards`,
  },
  healthySnapshotLabel: {
    id: `deployment-filter-context.healthy-snapshot-label`,
    defaultMessage: `Healthy snapshot (any)`,
  },
  unhealthySnapshotLabel: {
    id: `deployment-filter-context.unhealthy-snapshot-label`,
    defaultMessage: `Unhealthy snapshot (any)`,
  },
  healthySnapshotLatestLabel: {
    id: `deployment-filter-context.healthy-snapshot-latest-label`,
    defaultMessage: `Healthy snapshot (latest)`,
  },
  unhealthySnapshotLatestLabel: {
    id: `deployment-filter-context.unhealthy-snapshot-latest-label`,
    defaultMessage: `Unhealthy snapshot (latest)`,
  },
  enabledSnapshotLabel: {
    id: `deployment-filter-context.enabled-snapshot-label`,
    defaultMessage: `Enabled snapshots`,
  },
  disabledSnapshotLabel: {
    id: `deployment-filter-context.disabled-snapshot-label`,
    defaultMessage: `Disabled snapshots`,
  },
  pendingPlanLabel: {
    id: `deployment-filter-context.pending-plan-label`,
    defaultMessage: `Pending configuration change`,
  },
  noPendingPlanLabel: {
    id: `deployment-filter-context.no-pending-plan-label`,
    defaultMessage: `No pending configuration change`,
  },
  maintenanceLabel: {
    id: `deployment-filter-context.maintenance-label`,
    defaultMessage: `Maintenance mode`,
  },
  noMaintenanceLabel: {
    id: `deployment-filter-context.not-maintenance-label`,
    defaultMessage: `Not maintenance mode`,
  },
  runningLabel: {
    id: `deployment-filter-context.running-label`,
    defaultMessage: `Running`,
  },
  stoppedLabel: {
    id: `deployment-filter-context.stopped-label`,
    defaultMessage: `Stopped`,
  },
  hiddenLabel: {
    id: `deployment-filter-context.hidden-label`,
    defaultMessage: `Hidden`,
  },
  notHiddenLabel: {
    id: `deployment-filter-context.not-hidden-label`,
    defaultMessage: `Not hidden`,
  },
  regionLabel: {
    id: `deployment-filter-context.region-label`,
    defaultMessage: `Region`,
  },
  versionLabel: {
    id: `deployment-filter-context.version-label`,
    defaultMessage: `Version`,
  },
  stackLabel: {
    id: `deployment-filter-context.stack-label`,
    defaultMessage: `Stack`,
  },
  configurationLabel: {
    id: `deployment-filter-context.configuration-label`,
    defaultMessage: `Configuration`,
  },
  subscriptionLabel: {
    id: `deployment-filter-context.subscription-label`,
    defaultMessage: `Subscription`,
  },
  standardLabel: {
    id: `deployment-filter-context.standard-label`,
    defaultMessage: `Standard`,
  },
  goldLabel: {
    id: `deployment-filter-context.gold-label`,
    defaultMessage: `Gold`,
  },
  platinumLabel: {
    id: `deployment-filter-context.platinum-label`,
    defaultMessage: `Platinum`,
  },
  enterpriseLabel: {
    id: `deployment-filter-context.enterprise-label`,
    defaultMessage: `Enterprise`,
  },
})

let regions: FieldValueOptionType[] | null = null
let versions: FieldValueOptionType[] | null = null
let instanceConfigurations: FieldValueOptionType[] | null = null

export function getFilters({
  intl: { formatMessage },
  fetchRegionList,
  fetchVersions,
  fetchInstanceConfigurations,
}) {
  const filters: NonNullable<SearchFilterConfig[]> = [
    {
      name: formatMessage(messages.healthLabel),
      type: `field_value_selection`,
      filterWith: `includes`,
      multiSelect: false,
      autoClose: false,
      options: [
        {
          name: formatMessage(messages.healthyLabel),
          field: `healthy`,
          value: `y`,
        },
        {
          name: formatMessage(messages.healthyConfigurationLabel),
          field: `healthy_configuration`,
          value: `y`,
        },
        {
          name: formatMessage(messages.healthyMastersLabel),
          field: `healthy_masters`,
          value: `y`,
        },
        {
          name: formatMessage(messages.healthyShardsLabel),
          field: `healthy_shards`,
          value: `y`,
        },
        {
          name: formatMessage(messages.healthySnapshotLabel),
          field: `healthy_snapshot`,
          value: `y`,
        },
        {
          name: formatMessage(messages.healthySnapshotLatestLabel),
          field: `healthy_snapshot_latest`,
          value: `y`,
        },
        {
          name: formatMessage(messages.enabledSnapshotLabel),
          field: `enabled_snapshots`,
          value: `y`,
        },
        {
          name: formatMessage(messages.lockedLabel),
          field: `locked`,
          value: `y`,
        },
        {
          name: formatMessage(messages.noMaintenanceLabel),
          field: `maintenance`,
          value: `n`,
        },
        {
          name: formatMessage(messages.noPendingPlanLabel),
          field: `pending`,
          value: `n`,
        },
        {
          name: formatMessage(messages.runningLabel),
          field: `stopped`,
          value: `n`,
        },
        {
          name: formatMessage(messages.notHiddenLabel),
          field: `hidden`,
          value: `n`,
        },
        {
          name: formatMessage(messages.unhealthyLabel),
          field: `healthy`,
          value: `n`,
        },
        {
          name: formatMessage(messages.unhealthyConfigurationLabel),
          field: `healthy_configuration`,
          value: `n`,
        },
        {
          name: formatMessage(messages.unhealthyMastersLabel),
          field: `healthy_masters`,
          value: `n`,
        },
        {
          name: formatMessage(messages.unhealthyShardsLabel),
          field: `healthy_shards`,
          value: `n`,
        },
        {
          name: formatMessage(messages.unhealthySnapshotLabel),
          field: `healthy_snapshot`,
          value: `n`,
        },
        {
          name: formatMessage(messages.unhealthySnapshotLatestLabel),
          field: `healthy_snapshot_latest`,
          value: `n`,
        },
        {
          name: formatMessage(messages.disabledSnapshotLabel),
          field: `enabled_snapshots`,
          value: `n`,
        },
        {
          name: formatMessage(messages.maintenanceLabel),
          field: `maintenance`,
          value: `y`,
        },
        {
          name: formatMessage(messages.pendingPlanLabel),
          field: `pending`,
          value: `y`,
        },
        {
          name: formatMessage(messages.stoppedLabel),
          field: `stopped`,
          value: `y`,
        },
        {
          name: formatMessage(messages.hiddenLabel),
          field: `hidden`,
          value: `y`,
        },
        {
          name: formatMessage(messages.systemOwnedLabel),
          field: `system`,
          value: `y`,
        },
      ],
    },
    {
      name: formatMessage(messages.regionLabel),
      type: `field_value_selection`,
      filterWith: `includes`,
      field: `region`,
      multiSelect: `or`,
      loadingMessage: formatMessage(messages.loading),
      options: () => loadRegions({ fetchRegionList }),
    },
    {
      name: formatMessage(messages.versionLabel),
      type: `field_value_selection`,
      field: `version`,
      multiSelect: `or`,
      options: () => loadVersions({ fetchRegionList, fetchVersions }),
    },
    {
      name: formatMessage(messages.stackLabel),
      type: `field_value_selection`,
      multiSelect: `and`,
      field: `has`,
      options: getStackProducts(),
    },
    {
      name: formatMessage(messages.configurationLabel),
      type: `field_value_selection`,
      filterWith: `includes`,
      field: `configuration`,
      multiSelect: `or`,
      options: () =>
        loadConfigurations({
          fetchRegionList,
          fetchInstanceConfigurations,
        }),
    },
    {
      name: formatMessage(messages.subscriptionLabel),
      type: `field_value_selection`,
      field: `subscription`,
      multiSelect: `or`,
      options: [
        {
          view: formatMessage(messages.standardLabel),
          value: `standard`,
        },
        {
          view: formatMessage(messages.goldLabel),
          value: `gold`,
        },
        {
          view: formatMessage(messages.platinumLabel),
          value: `platinum`,
        },
        {
          view: formatMessage(messages.enterpriseLabel),
          value: `enterprise`,
        },
      ],
    },
  ]

  const { schema } = getSchema()

  /* Remove fields that aren't in the schema declaration,
   * such as `locked`, `system`, `organization`, `hidden`, or `subscription` in ECE & userconsole
   */
  return excludeSchemalessFields({ filters, schema })
}

function getStackProducts() {
  const filterableSliderTypes = getSupportedProductSliderTypes().filter(
    (sliderType) => !isEqual(sliderType, { sliderInstanceType: `elasticsearch` }),
  )

  return sortSliderTypes(filterableSliderTypes).map((sliderType) => ({
    view: <ProductLabel sliderType={sliderType} />,
    value: getProductFieldName(sliderType),
  }))
}

function loadRegions({ fetchRegionList }) {
  if (regions) {
    // the EUI cache mechanism doesn't work as expected
    return Promise.resolve(regions)
  }

  return fetchRegionList().then((actionResult) => {
    if (actionResult.error || !actionResult.payload) {
      return Promise.reject()
    }

    setRegions(getRegionIds(actionResult))

    return regions
  })
}

function setRegions(regionIds) {
  regions = regionIds.map((regionId) => ({
    view: renderBadge(regionId),
    value: regionId,
  }))
}

function loadVersions({ fetchRegionList, fetchVersions }) {
  if (versions) {
    // the EUI cache mechanism doesn't work as expected
    return Promise.resolve(versions)
  }

  return loadRegions({ fetchRegionList }).then(getVersions)

  function getVersions() {
    const regionQueries = regions!.map((region) => ({ id: region.value }))

    return Promise.all(
      regionQueries.map((region) =>
        fetchVersions(region).then((actionResult) => {
          if (actionResult.error || !actionResult.payload) {
            return Promise.reject()
          }

          const { stacks } = actionResult.payload
          const regionVersions = stacks.map((stack) => stack.version)

          return regionVersions
        }),
      ),
    ).then((results) => {
      const merged = flatten(results)
      const sorted = merged.sort(rcompare)
      const unique = uniq(sorted)

      versions = unique.map((version) => ({
        view: renderBadge(version),
        value: version,
      }))

      return versions
    })
  }
}

function loadConfigurations({ fetchRegionList, fetchInstanceConfigurations }) {
  if (instanceConfigurations) {
    // the EUI cache mechanism doesn't work as expected
    return Promise.resolve(instanceConfigurations.filter(shouldShowConfigurationAsFilter))
  }

  return loadRegions({ fetchRegionList }).then(getInstanceConfigurations)

  function getInstanceConfigurations() {
    const regionIds = regions!.map((region) => region.value)

    return Promise.all(
      regionIds.map((regionId) =>
        fetchInstanceConfigurations(regionId).then((actionResult) => {
          if (actionResult.error || !actionResult.payload) {
            return Promise.reject()
          }

          const regionIntanceConfigurations = actionResult.payload
          return regionIntanceConfigurations
        }),
      ),
    ).then((results) => {
      const merged = flatten(results)
      const sorted = sortBy(merged, `id`)
      const unique = uniqBy(sorted, `id`)

      instanceConfigurations = unique.map((instanceConfiguration) => ({
        view: renderBadge(instanceConfiguration.id),
        value: instanceConfiguration.id,
        _raw: instanceConfiguration,
      }))

      const instanceConfigurationFilterOptions = instanceConfigurations.filter(
        shouldShowConfigurationAsFilter,
      )
      return instanceConfigurationFilterOptions
    })
  }

  function shouldShowConfigurationAsFilter(instanceConfiguration) {
    /* FIXES BUG: https://github.com/elastic/cloud/issues/25774
     *
     * We can't effectively test for the presence of APM or Kibana configurations
     * without the /deployments API.
     * Unless we did something insane, like multiple requests per matched search result,
     * so we just filter these out from the Configuration filter option dropdown.
     */
    return instanceConfiguration._raw.instance_type === `elasticsearch`
  }
}

function renderBadge(value) {
  return (
    <div>
      <EuiBadge>{value}</EuiBadge>
    </div>
  )
}

function ProductLabel({ sliderType }) {
  return (
    <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
      <EuiFlexItem grow={false}>
        <CuiSliderLogo {...sliderType} />
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <FormattedMessage {...getSliderPrettyName(sliderType)} />
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}
