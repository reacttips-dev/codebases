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

// Simple implementation of q.allSettled for ES6 promises. This is sometimes
// necessary because Promise.all rejects as soon as any promise rejects, but
// sometimes you want to wait until all promised are fulfilled one way or
// the other.
//
// https://stackoverflow.com/a/39031032

export function allSettled(promises: Array<Promise<any>>) {
  const wrappedPromises = promises.map((p) =>
    Promise.resolve(p).then(
      (val) => ({ state: `fulfilled`, value: val }),
      (err) => ({ state: `rejected`, reason: err }),
    ),
  )

  return Promise.all(wrappedPromises)
}
