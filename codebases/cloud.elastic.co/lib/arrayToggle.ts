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

import { without } from 'lodash'

export default function toggle<T>(array: T[], ...itemsToToggle: T[]): T[] {
  return itemsToToggle.reduce(toggleItem, array)
}

function toggleItem<T>(array: T[], item: T): T[] {
  if (array.includes(item)) {
    return without(array, item)
  }

  return [...array, item]
}
