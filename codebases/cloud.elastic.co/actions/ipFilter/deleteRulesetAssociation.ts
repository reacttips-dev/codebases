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

import { DELETE_IP_FILTER_RULESET_ASSOCIATIONS } from '../../constants/actions'
import { deleteIpFilterRulesetAssociationUrl } from '../../lib/api/v1/urls'

export function deleteRulesetAssociation({
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
  const url = deleteIpFilterRulesetAssociationUrl({
    rulesetId,
    associationType,
    associatedEntityId,
    regionId,
  })

  return asyncRequest({
    type: DELETE_IP_FILTER_RULESET_ASSOCIATIONS,
    method: `DELETE`,
    url,
    meta: { rulesetId, associatedEntityId },
  })
}
