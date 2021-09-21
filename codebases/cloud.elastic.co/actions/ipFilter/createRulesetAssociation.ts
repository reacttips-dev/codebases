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

import { CREATE_IP_FILTER_RULESET_ASSOCIATION } from '../../constants/actions'
import { createIpFilterRulesetAssociationUrl } from '../../lib/api/v1/urls'

export function createRulesetAssociation({
  rulesetId,
  regionId,
  associatedEntityId,
  associationType = 'deployment',
}: {
  rulesetId: string
  regionId: string
  associatedEntityId: string
  associationType?: string
}) {
  const url = createIpFilterRulesetAssociationUrl({ rulesetId, regionId })
  const payload = {
    id: associatedEntityId,
    entity_type: associationType,
  }
  return asyncRequest({
    type: CREATE_IP_FILTER_RULESET_ASSOCIATION,
    method: `POST`,
    url,
    payload,
    meta: { rulesetId, associatedEntityId, associationType },
  })
}
