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

import moment from 'moment'
import { v4 as uuid } from 'uuid'

import { get, post } from '../../lib/ajax'
import asyncRequest from '../asyncRequests'
import { getLink } from '../../lib/links'
import {
  UPDATE_PHONE_HOME_ENABLED,
  FETCH_PHONE_HOME_ENABLED,
  DISABLE_PHONE_HOME,
} from '../../constants/actions'

export const PHONE_HOME_STORAGE_KEY = `LAST_PHONE_HOME`

let isPhoningHome = false

export const updatePhoneHomeIsEnabled = (root, enabled) =>
  asyncRequest({
    type: UPDATE_PHONE_HOME_ENABLED,
    method: `POST`,
    payload: { enabled },
    url: getLink(root, `phone-home-config`),
  })

export const fetchPhoneHomeIsEnabled = (root) =>
  asyncRequest({
    type: FETCH_PHONE_HOME_ENABLED,
    method: `GET`,
    url: getLink(root, `phone-home-config`),
  })

export function runPhoneHomeIfNeeded(root, baseTelemetryUrl) {
  return (dispatch) => {
    if (isPhoningHome || !shouldPhoneHome()) {
      return Promise.resolve()
    }

    isPhoningHome = true
    return runPhoneHomeData(root, baseTelemetryUrl, dispatch)
      .then(() => {
        isPhoningHome = false
        return undefined
      })
      .catch((e) => {
        isPhoningHome = false
        throw e
      })
  }
}

export function runPhoneHomeData(root, baseTelemetryUrl, dispatch) {
  return (
    get(getLink(root, `phone-home-data`))
      .then((response) =>
        post(`${baseTelemetryUrl}/ece/v2/phone-home`, {
          ...response.body,
          uuid: uuid(),
        }),
      )
      .then(() => localStorage.setItem(PHONE_HOME_STORAGE_KEY, new Date().toISOString()))

      // We just swallow this silently. It might error because of a 404, which means they don't have it enabled
      // or it could error because of a 500. In both cases we are unable to take action.
      .catch((e) => {
        dispatch(disablePhoneHome())
        throw e
      })
  )
}

function shouldPhoneHome() {
  const lastPhoneHome = localStorage.getItem(PHONE_HOME_STORAGE_KEY)

  if (lastPhoneHome == null) {
    return true
  }

  const yesterday = moment().subtract(1, `day`)
  return moment(lastPhoneHome).isBefore(yesterday)
}

export const disablePhoneHome = () => ({
  type: DISABLE_PHONE_HOME,
})
