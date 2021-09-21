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
import { Action, CloudAppConfig } from '../types'

interface SetConfigAction extends Action<typeof SET_CONFIG> {
  meta: any
  payload: CloudAppConfig
}

export function setConfig(config: CloudAppConfig): SetConfigAction {
  return {
    type: SET_CONFIG,
    meta: {},
    payload: config,
  }
}
