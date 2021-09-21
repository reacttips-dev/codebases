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

import { map } from 'lodash'
import { createLogger } from 'redux-logger'

export default function createReduxLogger() {
  return createLogger({
    level: {
      action: (action) => (action.type === `error` ? `error` : `debug`),
      prevState: `debug`,
      nextState: `debug`,
    },
    duration: true,
    logErrors: false,
    collapsed: (_getState, action) => !action.error,
    colors: {
      title: (action) => (action.error ? `red` : `#cccccc`),
      prevState: () => `#525252`,
      nextState: () => `#525252`,
      action: () => `#525252`,
    },
    titleFormatter: (action) => {
      const metaPairs = map(action.meta || {}, (value, key) => `${key}=${String(value)}`).join(' ')

      if (!metaPairs) {
        return action.type
      }

      return `${action.type} (${metaPairs})`
    },
  })
}
