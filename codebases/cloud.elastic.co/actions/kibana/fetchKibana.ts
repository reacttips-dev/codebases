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

import { FETCH_KIBANA } from '../../constants/actions'
import { isFeatureActivated } from '../../selectors'
import { getKibanaClusterUrl } from '../../lib/api/v1/urls'
import asyncRequest from '../asyncRequests'

import { KibanaId, RegionId, ThunkAction } from '../../types'
import Feature from '../../lib/feature'

export function fetchKibana(
  regionId: RegionId,
  kibanaId: KibanaId,
  esConvertedToDnt: boolean = false,
): ThunkAction {
  return (dispatch, getState) => {
    const convertLegacyPlans = shouldConvertLegacyPlans(
      isFeatureActivated(getState(), Feature.convertLegacyPlans),
      esConvertedToDnt,
    )

    const url = getKibanaClusterUrl({
      regionId,
      clusterId: kibanaId,
      showPlanLogs: true,
      showMetadata: true,
      showSettings: true,

      // When true:
      //   (1) Changes non-DNT plans to include e.g. master, ML node information with zero nodes
      //   (2) Changes DNT plans to include disabled instance types, by including them in the
      //       cluster topology with zero size. This makes it easy to later enable them.
      convertLegacyPlans,
    })

    return dispatch(
      asyncRequest({
        type: FETCH_KIBANA,
        url,
        meta: { regionId, kibanaId, selfUrl: url },
        crumbs: [regionId, kibanaId],
      }),
    )
  }
}

/**
 * We have a feature flag (convertLegacyPlans) that tells us to fetch the API with `convert_legacy_plans` to `true/false`.
 * If it's true, we convert the plan, and the user can then see things like adding ML, dedicated masters. They have to hit save
 * for their deployment to actually be converted.
 *
 * We have deliberately turned off this feature flag in SaaS Adminconsole (admin.found.no) because we as operators don't want to be
 * converting customer's plans. The reason for this is because Heroku customers still use the old customer UC and that can't handle
 * DNT plans. So in effect we would be killing any Heroku customers' UI when we touched their cluster.
 *
 * Also IBM creates clusters with the v0 api, which are non-DNT clusters. Operating on their clusters would also break their
 * workflow.
 *
 * The above is all fine. However, we have cases where for some reason, the ES plan has been converted to DNT, but the Kibana hasn't.
 * This results in the SaaS AC showing an error where the Kibana should be on the Edit page (because we don't have an instance_config_id)
 * This only happens in the SaaS AC since everywhere else the feature flag is turned on and we convert everything. But in the SaaS AC
 * we don't conver the Kibana, hence the no instance_config_id.
 *
 * To get around this, we say that if the ES has been converted to DNT, even if the feature flag is turned off, we convert the Kibana.
 * Since Kibanas aren't going to be causing any problems, and since the ES was already converted anyways, this should be a fine tradeoff.
 */
export function shouldConvertLegacyPlans(
  isConvertLegacyFeatureActivated: boolean,
  esConvertedToDnt: boolean,
): boolean {
  if (esConvertedToDnt) {
    return true
  }

  return isConvertLegacyFeatureActivated
}
