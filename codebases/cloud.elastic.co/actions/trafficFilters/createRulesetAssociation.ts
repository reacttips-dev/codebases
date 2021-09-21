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

import { CREATE_TRAFFIC_FILTER_RULESET_ASSOCIATION } from '../../constants/actions'

import { createTrafficFilterRulesetAssociationUrl } from '../../lib/api/v1/urls'

import { FilterAssociation } from '../../lib/api/v1/types'

export function createRulesetAssociation({
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
  const url = createTrafficFilterRulesetAssociationUrl({ rulesetId })
  const payload: FilterAssociation = {
    id: associatedEntityId,
    entity_type: associationType,
  }

  return asyncRequest({
    type: CREATE_TRAFFIC_FILTER_RULESET_ASSOCIATION,
    method: `POST`,
    url,
    payload,
    meta: { regionId, rulesetId, associationType, associatedEntityId },
    crumbs: [associatedEntityId, regionId, rulesetId],
  })
}
