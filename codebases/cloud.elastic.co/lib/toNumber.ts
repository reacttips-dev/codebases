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

export default function toNumber(text: string): number | null {
  const number = parseInt(text, 10)

  if (isNaN(number)) {
    return null
  }

  return number
}

export function toNumberOrElse(text: string, defaultValue: number): number {
  const number = toNumber(text)

  if (number === null) {
    return defaultValue
  }

  return number
}
