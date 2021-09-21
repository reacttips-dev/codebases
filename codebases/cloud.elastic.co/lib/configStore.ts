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

import safeson from 'safeson'
import { CloudAppConfig } from '../types'

let store: CloudAppConfig = {}

export function setConfig(config: CloudAppConfig) {
  store = config
}

export default function getConfig(): CloudAppConfig {
  return store
}

export function pullConfigFromHtml(): CloudAppConfig {
  const appConfigElement = document.querySelector(`script[type="text/app-configuration"]`)

  if (!appConfigElement) {
    throw new Error('Failed to find app configuration element in DOM')
  }

  const safesonText =
    appConfigElement instanceof HTMLElement && appConfigElement.innerText
      ? appConfigElement.innerText
      : appConfigElement.textContent

  return safeson.decode(safesonText)
}
