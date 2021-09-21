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

import { defineMessages } from 'react-intl'

const messages = defineMessages({
  label: {
    id: `cluster-snapshot-details.restore`,
    defaultMessage: `Restore Snapshot`,
  },
  restoreButton: {
    id: `cluster-snapshot-details.restore.restore-btn`,
    defaultMessage: `Restore snapshot`,
  },
  confirmButton: {
    id: `cluster-snapshot-details.restore.restoring-btn`,
    defaultMessage: `Confirm restore`,
  },
  optional: {
    id: `cluster-snapshot-details.restore.optional`,
    defaultMessage: `Optional`,
  },
  requestSuccessful: {
    id: `cluster-snapshot-details.restore.success`,
    defaultMessage: `The request to restore this snapshot was accepted and it is currently restoring.`,
  },
  requestUnsuccessful: {
    id: `cluster-snapshot-details.restore.failed`,
    defaultMessage: `The request to restore this snapshot was not successful. The response from the cluster was: {response}`,
  },
  specifyIndicesTitle: {
    id: `cluster-snapshot-details.restore.specify-indices`,
    defaultMessage: `Specify Indices`,
  },
  specifyIndicesLabel: {
    id: `cluster-snapshot-details.restore.indices`,
    defaultMessage: `Indices`,
  },
  specifyIndicesHelp: {
    id: `cluster-snapshot-details.restore.specify-indices-help`,
    defaultMessage: `Wildcard *,-.* restores all indices in the snapshot except system indices. Do not leave the field blank. To limit the indices that get restored, use {multiIndexSyntax}. For example, {example}.`,
  },
  renameIndicesTitle: {
    id: `cluster-snapshot-details.restore.rename-indices`,
    defaultMessage: `Rename Indices`,
  },
  renameIndicesHelp: {
    id: `cluster-snapshot-details.restore.rename-indices-help`,
    defaultMessage: `Rename indices by matching a pattern with a {regularExpression} and replacing it with a {capturedExpression}. For example: To rename the index {originalIndex} to {renamedIndex} when it is restored, match the pattern {matchPattern} and replace it with {replacePattern}.`,
  },
  regularExpression: {
    id: `cluster-snapshot-details.restore.regular-expression`,
    defaultMessage: `regular expression`,
  },
  capturedExpression: {
    id: `cluster-snapshot-details.restore.captured-expression`,
    defaultMessage: `captured expression`,
  },
  matchPatternLabel: {
    id: `cluster-snapshot-details.restore.match-pattern`,
    defaultMessage: `Match`,
  },
  replacePatternLabel: {
    id: `cluster-snapshot-details.restore.rename-pattern`,
    defaultMessage: `Replace with`,
  },
  unknownIndicesError: {
    id: `cluster-snapshot-details.restore.indices-not-in-snapshot`,
    defaultMessage: `{ count, plural, one {This index is} other {These indices are} } not present in this snapshot: {unknownIndices}`,
  },
  noSpecifiedIndicesMatchesForPattern: {
    id: `cluster-snapshot-details.restore.no-matches-for-specified-indices`,
    defaultMessage: `This pattern does not match any of the specified indices in this snapshot`,
  },
  noMatchesForPattern: {
    id: `cluster-snapshot-details.restore.no-matches-for-indices`,
    defaultMessage: `This pattern does not match any of the indices in this snapshot`,
  },
  invalidRegex: {
    id: `cluster-snapshot-details.restore.invalid-match-pattern`,
    defaultMessage: `Please supply a valid regular expression`,
  },
  supplyBothOrNoPatterns: {
    id: `cluster-snapshot-details.restore.please-supply-both-patterns`,
    defaultMessage: `Please either supply both the match pattern and replacement pattern, or leave them both blank.`,
  },
  multiIndexSyntax: {
    id: `cluster-snapshot-details.restore.multi-index-index`,
    defaultMessage: `multi-index syntax`,
  },
})

export default messages
