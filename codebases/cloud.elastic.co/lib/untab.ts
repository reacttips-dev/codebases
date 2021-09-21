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

function countLeadingSpaces(line: string): number {
  let count = 0

  while (line[count] === ` `) {
    count++
  }

  return count
}

// Helper to remove whitespace when using template literals.
// Finds the line with the fewest number of leading spaces, and
// removes that number of leading spaces from each line.
export default function untab(str: string): string {
  const lines = str.split(`\n`).filter((s) => s.trim().length > 0)
  const leadingSpaces = lines.map(countLeadingSpaces)
  const smallestLeadingSpace = Math.min(...leadingSpaces)
  return lines.map((line) => line.slice(smallestLeadingSpace)).join(`\n`)
}
