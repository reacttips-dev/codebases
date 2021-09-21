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
import { IntlShape } from 'react-intl'

import { EuiBadge, FieldValueOptionType } from '@elastic/eui'

import { CuiBasicFilterContextProps } from '../../cui'

import { getRegionIds } from '../../lib/regionEqualizer'

import messages from './messages'

let regions: FieldValueOptionType[] | null = null

export function getFilters({
  intl: { formatMessage },
  fetchRegionList,
}: {
  intl: IntlShape
  fetchRegionList: () => Promise<any>
}) {
  const filters: CuiBasicFilterContextProps['filters'] = [
    {
      name: formatMessage(messages.rulesetTypeLabel),
      type: `field_value_selection`,
      field: `type`,
      multiSelect: `or`,
      options: [
        {
          view: formatMessage(messages.awsVpceLabel),
          value: `vpce`,
        },
        {
          view: formatMessage(messages.azureVnetLabel),
          value: `azure_private_endpoint`,
        },
        {
          view: formatMessage(messages.ipFilteringLabel),
          value: `ip`,
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
  ]

  return filters
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

function renderBadge(value) {
  return (
    <div>
      <EuiBadge>{value}</EuiBadge>
    </div>
  )
}
