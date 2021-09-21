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

import asyncRequest from '../asyncRequests'

import { DELETE_TRAFFIC_FILTER_RULESET_ASSOCIATION } from '../../constants/actions'

import { deleteTrafficFilterRulesetAssociationUrl } from '../../lib/api/v1/urls'

export function deleteRulesetAssociation({
  regionId,
  rulesetId,
  associationType = 'deployment',
  associatedEntityId,
}: {
  regionId: string
  rulesetId: string
  associationType?: string
  associatedEntityId: string
}) {
  const url = deleteTrafficFilterRulesetAssociationUrl({
    rulesetId,
    associationType,
    associatedEntityId,
  })

  return asyncRequest({
    type: DELETE_TRAFFIC_FILTER_RULESET_ASSOCIATION,
    method: `DELETE`,
    url,
    meta: { regionId, rulesetId, associationType, associatedEntityId },
    crumbs: [associatedEntityId, regionId, rulesetId],
  })
}
