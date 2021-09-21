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

import { FETCH_CLUSTER } from '../../constants/actions'
import { getEsClusterUrl } from '../../lib/api/v1/urls'
import { isFeatureActivated } from '../../selectors'
import asyncRequest from '../asyncRequests'

import { ElasticsearchId, Region, ThunkAction, RegionId } from '../../types'
import Feature from '../../lib/feature'

export function fetchCluster(region: Region | RegionId, clusterId: ElasticsearchId): ThunkAction {
  return (dispatch, getState) => {
    const convertLegacyPlans = isFeatureActivated(getState(), Feature.convertLegacyPlans)

    const regionId = typeof region === `string` ? region : region.id

    const url = getEsClusterUrl({
      regionId,
      clusterId,
      showPlanDefaults: true,
      showPlanLogs: true,
      showMetadata: true,
      showSecurity: true,

      // We don't separate alerts by type so 20 is a guess as to what will give us at least a few of each 99% of the time
      showSystemAlerts: 20,
      showSettings: true,

      // When true:
      //   (1) Changes non-DNT plans to include e.g. master, ML node information with zero nodes
      //   (2) Changes DNT plans to include disabled instance types, by including them in the
      //       cluster topology with zero size. This makes it easy to later enable them.
      convertLegacyPlans,

      // Enriching with template is also another form of conversion that might break pre-DNT assumptions.
      // See: IBM, https://github.com/elastic/cloud/issues/35634
      enrichWithTemplate: convertLegacyPlans,
    })

    return dispatch(
      asyncRequest({
        type: FETCH_CLUSTER,
        url,
        meta: { regionId, clusterId, selfUrl: url },
        crumbs: [regionId, clusterId],
      }),
    )
  }
}
