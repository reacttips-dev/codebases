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

import { fetchDeployment } from '../stackDeployments/crud'

import { ENABLE_SLM } from '../../constants/actions'

import { enableDeploymentResourceSlmUrl } from '../../lib/api/v1/urls'

export const enableSlm = (deploymentId: string, refId: string) => (dispatch) =>
  dispatch(
    asyncRequest({
      type: ENABLE_SLM,
      url: enableDeploymentResourceSlmUrl({
        deploymentId,
        refId,
      }),
      method: `POST`,
      meta: { deploymentId, refId },
      crumbs: [deploymentId],
    }),
  ).then(() => dispatch(fetchDeployment({ deploymentId })))
