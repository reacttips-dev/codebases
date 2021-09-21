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

import { isObject } from 'lodash'
import YAML from 'js-yaml'

export interface JsonObject {}

export type JsonFromYaml = JsonObject | null | boolean

export function yamlToJson(yaml: string): JsonFromYaml {
  try {
    const json = YAML.load(yaml)

    if (json === undefined || json === null) {
      return null
    }

    // for some reason when `YAML.load` is passed a non YAML string, it echoes that instead of blowing up
    if (!isObject(json)) {
      return false
    }

    return json
  } catch (e) {
    return false
  }
}

export function jsonToYaml(json: JsonObject): string | null {
  try {
    return YAML.dump(json)
  } catch (err) {
    return null
  }
}

export function isValidYaml(yaml: string): boolean {
  return yamlToJson(yaml) !== false
}
