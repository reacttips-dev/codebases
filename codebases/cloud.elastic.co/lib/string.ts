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

export const startsWithVowel = (word: string): boolean =>
  [`a`, `e`, `i`, `o`, `u`].includes(word.charAt(0).toLowerCase())

// Keeping it simple for the moment, but we may want to
// eventually pull in formatjs.io/docs/polyfills/intl-listformat/
export const formatAsSentence = (words: string[]): string => {
  if (words.length <= 1) {
    return words.join(``)
  }

  return `${words.slice(0, words.length - 1).join(', ')} and ${words.slice(-1)}`
}
