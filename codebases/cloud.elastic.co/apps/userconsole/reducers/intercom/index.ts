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

import { FETCH_INTERCOM_DATA } from '../../constants/actions'

export interface State {
  dates?: {
    start: Date
    end: Date
  }
}

const initialState = {}

export default function intercomReducer(state: State = initialState, action: any) {
  if (action.type === FETCH_INTERCOM_DATA) {
    if (!action.error && action.payload) {
      return {
        dates: {
          start: moment(action.payload.start).toDate(),
          end: moment(action.payload.end).toDate(),
        },
      }
    }
  }

  return state
}

export function getIntercomData(state) {
  return state.intercom.dates
}
