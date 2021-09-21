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

import { DISMISS_NOTIFICATION_MESSAGE } from '../constants/actions'

import {
  APM_INTRO_NOTIFICATION_STORAGE_KEY,
  BETA_NOTIFICATION_STORAGE_KEY,
  HOT_WARM_CHANGES_STORAGE_KEY,
} from '../constants/notificationMessageTypes'

import { NotificationMessageType } from '../types'

export type State = {
  [key in NotificationMessageType]: {
    dismissed: boolean
  }
}

const initialState: State = {
  [HOT_WARM_CHANGES_STORAGE_KEY]: {
    dismissed: Boolean(localStorage.getItem(HOT_WARM_CHANGES_STORAGE_KEY)),
  },
  [APM_INTRO_NOTIFICATION_STORAGE_KEY]: {
    dismissed: Boolean(localStorage.getItem(APM_INTRO_NOTIFICATION_STORAGE_KEY)),
  },
  [BETA_NOTIFICATION_STORAGE_KEY]: {
    dismissed: Boolean(localStorage.getItem(BETA_NOTIFICATION_STORAGE_KEY)),
  },
}

function notificationMessageStateReducer(state: State = initialState, action) {
  if (action.type === DISMISS_NOTIFICATION_MESSAGE) {
    return {
      ...state,
      [action.notificationType]: action.payload,
    }
  }

  return state
}

export default notificationMessageStateReducer
