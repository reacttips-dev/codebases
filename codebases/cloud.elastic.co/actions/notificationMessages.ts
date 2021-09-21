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

import { NotificationMessageType } from '../types'

export function setNotificationState(
  notificationState: boolean,
  notificationType: NotificationMessageType,
) {
  return {
    type: DISMISS_NOTIFICATION_MESSAGE,
    payload: {
      dismissed: notificationState,
    },
    notificationType,
  }
}

export function dismissNotification(notificationType: NotificationMessageType) {
  return (dispatch) => {
    localStorage.setItem(notificationType, `true`)
    dispatch(setNotificationState(true, notificationType))
  }
}
