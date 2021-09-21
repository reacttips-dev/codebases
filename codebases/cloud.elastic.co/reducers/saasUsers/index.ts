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
import { get } from 'lodash'

import { CALL_STORED_PROCEDURE, FETCH_SAAS_USER } from '../../constants/actions'

import { replaceIn, mergeIn } from '../../lib/immutability-helpers'
import { SaasUserResponse } from '../../lib/api/v1/types'
import { AsyncAction } from '../../types'
import { CallProcedureAction } from '../storedProcedures/storedProcedureTypes'

export interface State {
  [userId: string]: SaasUserResponse
}

interface FetchSaasUserAction extends AsyncAction<typeof FETCH_SAAS_USER, SaasUserResponse> {
  meta: { userId: string }
}

type Action = FetchSaasUserAction | CallProcedureAction

export default function saasUsers(state: State = {}, action: Action): State {
  if (action.type === FETCH_SAAS_USER) {
    if (!action.error && action.payload) {
      const { userId } = action.meta

      return replaceIn(state, [userId], action.payload)
    }
  }

  if (action.type === CALL_STORED_PROCEDURE) {
    if (!action.error && action.payload) {
      const { userId, procedureName } = action.meta
      const success = action.payload.ok

      if (!userId || !success) {
        return state
      }

      if (procedureName === `ensure_premium`) {
        const subscriptionPath = [userId, `subscription`, `level`]
        const [, level] = action.meta.parameters
        return replaceIn(state, subscriptionPath, level)
      }

      if (procedureName === `extend_capacity_limit`) {
        const capacityPath = [userId, `subscription`, `capacity_limit`]
        const [, capacityLimit] = action.meta.parameters
        return replaceIn(state, capacityPath, parseInt(capacityLimit, 10) * 1024)
      }

      if (procedureName === `extend_trial`) {
        const trials = get(state, [userId, `trials`], [])
        const lastTrialIndex = trials.length - 1

        if (lastTrialIndex < 0) {
          return state
        }

        const lastTrialEndPath = [userId, `trials`, String(lastTrialIndex), `end`]
        const [, rawExtendedTrialEnd] = action.meta.parameters
        const extendedTrialEnd = moment(rawExtendedTrialEnd, `YYYY-MM-DD`).toISOString()

        return replaceIn(state, lastTrialEndPath, extendedTrialEnd)
      }

      if (procedureName === `enable_disk_notifications`) {
        const diskNotificationsEnabledPath = [
          userId,
          `user`,
          `data`,
          `user_warning`,
          `disk`,
          `enabled`,
        ]
        const [, enabled] = action.meta.parameters
        return replaceIn(state, diskNotificationsEnabledPath, enabled)
      }

      if (procedureName === `toggle_bundles_and_custom_plugins`) {
        const [, allowBundles, allowPlugins] = action.meta.parameters

        return mergeIn(state, [userId, `rules`], {
          allow_plugins: allowPlugins === `true`,
          allow_bundles: allowBundles === `true`,
        })
      }

      if (procedureName === `convert_to_invoicing`) {
        const { is_paying, invoicable } = state[userId].subscription

        return mergeIn(state, [userId, `subscription`], {
          isPaying: !is_paying,
          invoicable: !invoicable,
        })
      }
    }
  }

  return state
}

export function getSaasUsers(state: State) {
  return state
}

export function getSaasUser(state: State, userId: string) {
  return state[userId]
}
