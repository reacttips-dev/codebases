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

import { diffJson, Change } from 'diff'
import { trimEnd } from 'lodash'
import { Diff, DiffDeleted, DiffEdit, DiffNew } from 'deep-diff'

interface IJson {}

export function jsonDiff(json1: IJson, json2: IJson): string {
  return diffJson(json1, json2).map(createLineDiffFromChangeObject).join(`\n`)
}

/**
 * Checks whether the two arguments have any differences, from a jsonDiff point-of-view.
 * @param json1
 * @param json2
 */
export function hasJsonDiff(json1: IJson, json2: IJson): boolean {
  return diffJson(json1, json2).some((each) => each.added != null || each.removed != null)
}

type GroupedDiffs<LHS, RHS> = {
  N: Array<DiffNew<RHS>>
  D: Array<DiffDeleted<LHS>>
  E: Array<DiffEdit<LHS, RHS>>
}

export function groupDiffs<LHS, RHS>(diffs: Array<Diff<LHS, RHS>> = []): GroupedDiffs<LHS, RHS> {
  const diffByKind: GroupedDiffs<LHS, RHS> = {
    N: [],
    D: [],
    E: [],
  }

  for (const diff of diffs) {
    switch (diff.kind) {
      case 'N':
        diffByKind.N.push(diff)
        break

      case 'D':
        diffByKind.D.push(diff)
        break

      case 'E':
        diffByKind.E.push(diff)
        break

      default:
        break
    }
  }

  return diffByKind
}

function createLineDiffFromChangeObject(changeObject: Change): string {
  let prefix = ` `

  if (changeObject.added) {
    prefix = `+`
  }

  if (changeObject.removed) {
    prefix = `-`
  }

  // Remove trailing newline, then prefix every line to get
  // a diff we can display (and highlight) to the user
  return trimEnd(changeObject.value)
    .split(`\n`)
    .map((part) => prefix + part)
    .join(`\n`)
}
