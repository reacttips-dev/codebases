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

import { FETCH_GLOBAL_DEPLOYMENT_TEMPLATES } from '../constants/actions'

import { GlobalDeploymentTemplateInfo } from '../lib/api/v1/types'

import { AsyncAction } from '../types'

export type State = GlobalDeploymentTemplateInfo[] | null

interface FetchAllAction
  extends AsyncAction<typeof FETCH_GLOBAL_DEPLOYMENT_TEMPLATES, GlobalDeploymentTemplateInfo[]> {}

export default function globalDeploymentTemplatesReducer(
  state: State = null,
  action: FetchAllAction,
): State {
  if (action.type === FETCH_GLOBAL_DEPLOYMENT_TEMPLATES) {
    if (!action.error && action.payload) {
      return action.payload
    }
  }

  return state
}

export function getGlobalDeploymentTemplates(state: State) {
  return state
}
