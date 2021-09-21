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

import { init, ApmBase } from '@elastic/apm-rum'
import { noop } from 'lodash'

import { getConfigForKey } from '../../store'
import { PlainHashMap } from '../../types'

// `@elastic/apm-rum` doesn't expose all that many types, so we pull them "creatively"
type GetCurrentTransaction = ApmBase['getCurrentTransaction']
type StartSpan = ApmBase['startSpan']
type ApmTransaction = NonNullable<ReturnType<GetCurrentTransaction>>
type ApmSpan = NonNullable<ReturnType<StartSpan>>

const stubSpan: ApmSpan = {
  name: `Stub span`,
  type: `Stub span type`,
  sync: false,
  duration: () => 0,
  addLabels: noop,
  addContext: noop,
  end: noop,
}

const stubTransaction: ApmTransaction = {
  name: `Stub transaction`,
  type: `Stub transaction type`,
  startSpan: () => stubSpan,
  end: noop,
  mark: noop,
  captureBreakdown: noop,
  addTask: () => `fake task id`,
  removeTask: noop,
  duration: () => 0,
  addLabels: noop,
  addContext: noop,
  isFinished: () => false,
}

let apmInstance: ApmBase | null = null

export function initApm() {
  const serviceName = getConfigForKey(`CLOUD_USERCONSOLE_APM_SERVICE_NAME`)
  const serverUrl = getConfigForKey(`CLOUD_USERCONSOLE_APM_SERVER_URL`)
  const serviceVersion = getConfigForKey(`CLOUD_USERCONSOLE_APM_SERVICE_VERSION`) || undefined

  if (!serviceName || !serverUrl) {
    return
  }

  apmInstance = init({
    serviceName,
    serverUrl,
    serviceVersion,
  })

  if (!window) {
    return
  }

  // This tries to avoid losing data when the user navigates away. We're waiting
  // on a better solution from APM.
  window.addEventListener(`beforeunload`, () => {
    if (!apmInstance) {
      return
    }

    const currentTransaction = apmInstance.getCurrentTransaction()

    if (currentTransaction) {
      currentTransaction.end()
    }
  })
}

export function setApmUserContext(id: string, email: string) {
  if (!apmInstance) {
    return
  }

  apmInstance.setUserContext({
    id,
    email,
  })
}

export function startRouteChange(name: string, tags: PlainHashMap = {}): ApmTransaction {
  return startApmTransaction(name, `route-change`, tags)
}

export function startPageActions(name: string, tags: PlainHashMap = {}): ApmTransaction {
  return startApmTransaction(name, `Page actions`, tags)
}

export function startHttpSpan(method: string, url: string): ApmSpan {
  return startApmSpan(`${method.toUpperCase()} ${url}`, `http`)
}

export function captureApmError(error: Error) {
  console.error(error)

  if (!apmInstance) {
    return
  }

  apmInstance.captureError(error)
}

function startApmTransaction(name: string, type: string, tags: PlainHashMap = {}): ApmTransaction {
  if (!apmInstance) {
    return stubTransaction
  }

  apmInstance.addLabels(tags)
  const transaction = apmInstance.startTransaction(name, type)
  return transaction || stubTransaction
}

function startApmSpan(name: string, type: string): ApmSpan {
  if (!apmInstance) {
    return stubSpan
  }

  const currentTransaction = apmInstance.getCurrentTransaction()

  const transaction = currentTransaction || startApmTransaction(name, type)

  if (!transaction) {
    return stubSpan
  }

  const span = transaction.startSpan(name, type)

  return span || stubSpan
}
