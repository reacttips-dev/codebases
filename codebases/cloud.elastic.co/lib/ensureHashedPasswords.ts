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

import { mapValues, startsWith } from 'lodash'
import { hash } from 'bcryptjs'
import { resolve, props, fromCallback } from 'bluebird'

function ensureHashedPassword(password: string): Promise<string> {
  if (!startsWith(password, `$2a$`)) {
    return fromCallback((cb) => hash(String(password), 12, cb))
  }

  return resolve(password)
}

export default function ensureHashedPasswords(users) {
  return props(mapValues(users, ensureHashedPassword))
}
