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

/**
 * Generate a function that sorts objects on the specified keys. Values
 * will be stringified and compared in a locale-sensitive manner.
 * @param {String} prop the key to sort on
 */
export default function sortOn<T = any>(prop: keyof T) {
  return (a: T, b: T) => String(a[prop]).localeCompare(String(b[prop]))
}
