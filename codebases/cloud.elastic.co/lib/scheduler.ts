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

import { map } from 'bluebird'

type Listener = () => void

export default function scheduler({ interval = 30000 } = {}) {
  const listeners: Listener[] = []
  let timerId

  function run() {
    return map(listeners, (listener) => listener())
  }

  function schedule() {
    clearTimeout(timerId)
    timerId = setTimeout(() => run().finally(schedule), interval)
  }

  function pause() {
    clearTimeout(timerId)
  }

  function clear() {
    listeners.length = 0
  }

  return {
    register(fn: Listener, { immediate = true } = {}) {
      if (immediate) {
        fn()
      }

      listeners.push(fn)
      let isSubscribed = true

      return function unsubscribe() {
        if (!isSubscribed) {
          return
        }

        isSubscribed = false

        const index = listeners.indexOf(fn)
        listeners.splice(index, 1)
      }
    },
    start: schedule,
    stop() {
      pause()
      clear()
    },
    run,
    pause,
    clear,
  }
}
