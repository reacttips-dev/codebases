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

import { SET_CONFIG } from '../constants/actions'

import { setConfig } from '../lib/configStore'

import { Action, CloudAppConfig } from '../types'

interface SetConfigAction extends Action<typeof SET_CONFIG> {
  payload: CloudAppConfig
}

export default function configReducer(state: CloudAppConfig = {}, action: SetConfigAction) {
  if (action.type === SET_CONFIG) {
    const config = action.payload
    setConfig(config)
    return config
  }

  return state
}

export function getRawConfig(state) {
  return state.config
}
