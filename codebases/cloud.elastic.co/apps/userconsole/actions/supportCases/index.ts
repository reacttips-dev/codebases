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

import asyncRequest, { resetAsyncRequest } from '../../../../actions/asyncRequests'
import { CREATE_SUPPORT_CASE } from '../../constants/actions'

export interface SupportCaseData {
  deploymentId: string | null
  category: string
  description: string
}

interface SupportCasePayload {
  deployment_id?: string
  category: string
  description: string
}

export function createSupportCase(supportCaseData: SupportCaseData) {
  const url = `/api/v1/support/cases`

  const payload: SupportCasePayload = {
    category: supportCaseData.category,
    description: supportCaseData.description,
  }

  if (supportCaseData.deploymentId != null) {
    payload.deployment_id = supportCaseData.deploymentId
  }

  return asyncRequest({
    type: CREATE_SUPPORT_CASE,
    method: `POST`,
    url,
    payload,
  })
}

export const resetCreateSupportCaseRequest = () => resetAsyncRequest(CREATE_SUPPORT_CASE)
