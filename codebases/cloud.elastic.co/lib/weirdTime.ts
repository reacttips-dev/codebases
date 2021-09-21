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

/* The API time format is …complicated. We might get:
 *
 * - numbers like `86400000`, that means 86400 seconds
 * - strings like `"default"`, that means 30 minutes
 * - strings like `"45min"`, that means 45 minutes
 * - strings like `"2h"`, that means 2 hours
 * - strings like `"1d"`, that means 1 day
 * - nothingness, that means `"default"`, or 30 minutes
 */
type WeirdApiTimeString = number | string | undefined | null

type WeirdApiTimeBox = {
  ms: number
  value: number
  unit: 's' | 'min' | 'h' | 'd'
}

export function parseWeirdApiTimeAsMs(time: WeirdApiTimeString): number {
  const { ms } = parseWeirdApiTime(time)
  return ms
}

export function parseWeirdApiTime(time: WeirdApiTimeString): WeirdApiTimeBox {
  if (!time || time === `default`) {
    return parseWeirdApiTimeObject({ value: 30, unit: `m` })
  }

  if (typeof time !== `string`) {
    return parseWeirdApiTimeObject({ value: time / 1000, unit: `s` })
  }

  const matches = time.match(/(\d*)\s?(\w*)/)

  if (!matches) {
    throw new Error(`Unexpected time string: ${time}`)
  }

  const [, value, unit] = matches

  return parseWeirdApiTimeObject({ value, unit })
}

export function parseWeirdApiTimeObject({ value: rawValue, unit }): WeirdApiTimeBox {
  const value = parseInt(rawValue, 10)

  if (unit.startsWith(`m`)) {
    return weirdApiTimeBox(value * 1000 * 60, value, `min`)
  }

  if (unit.startsWith(`h`)) {
    return weirdApiTimeBox(value * 1000 * 60 * 60, value, `h`)
  }

  if (unit.startsWith(`d`)) {
    return weirdApiTimeBox(value * 1000 * 60 * 60 * 24, value, `d`)
  }

  return weirdApiTimeBox(value * 1000, value, `s`) // assume seconds
}

function weirdApiTimeBox(ms, value, unit): WeirdApiTimeBox {
  return { ms, value, unit }
}
