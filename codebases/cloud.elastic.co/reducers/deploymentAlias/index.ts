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

import { GET_DEPLOYMENT_ALIAS_EDIT_ACCESS } from '../../constants/actions'

export type State = {
  deploymentAliasEditAccess: boolean
}

const initialState: State = {
  deploymentAliasEditAccess: false,
}

export default function deploymentAlias(state: State = initialState, action): State {
  if (action.type === GET_DEPLOYMENT_ALIAS_EDIT_ACCESS) {
    const checkPayload: boolean = action.payload?.value === 'true'

    return {
      deploymentAliasEditAccess: checkPayload,
    }
  }

  return state
}

export function deploymentAliasEditAccess(state: State): boolean {
  return state?.deploymentAliasEditAccess
}
