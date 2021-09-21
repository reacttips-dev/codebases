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

// We want to show _at most_ 2 digits, but we don't want to show digits when
// they are not needed. Note the plus sign that drops any "extra" zeroes at
// the end as it changes the result (which is a string) into a number again.
export const prettyDecimals = (aNumber: number) => +aNumber.toFixed(2)

export const compareNumbers = (a: number, b: number) => {
  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}

export const byteToMegabyte = (input: number) => input / 1024 / 1024
