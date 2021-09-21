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

export enum PlanChangeErrorTypes {
  NOT_ENOUGH_CAPACITY = 'not-enough-capacity',
  TIMEOUT = 'timeout',
  CANCELLED_PLAN = 'cancelled-plan',
  TOPOLOGY_CHANGE_ROLLING_STRATEGY = 'topology-change-rolling-strategy',
}

export const planChangeErrorTypes: { [key in PlanChangeErrorTypes]: RegExp } = {
  'not-enough-capacity':
    /(planned capacity out of bounds|Could not ensure capacity allocation|NotEnoughCapacity)/,
  timeout: /TimeoutException/,
  'cancelled-plan': /(Plan aborted by deletion of pending plan|User initiated without reason)/,
  'topology-change-rolling-strategy':
    /The topology cannot be changed if a rolling strategy is applied/,
}
