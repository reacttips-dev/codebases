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

export const messages = defineMessages({
  summaryName: {
    id: `deployment-architecture-summary.summary-name`,
    defaultMessage: `Name`,
  },
  summaryVersion: {
    id: `deployment-architecture-summary.summary-version`,
    defaultMessage: `Version`,
  },
  summaryEsMemory: {
    id: `deployment-architecture-summary.summary-es-memory`,
    defaultMessage: `ES data memory`,
  },
  summaryEsStorage: {
    id: `deployment-architecture-summary.summary-es-storage`,
    defaultMessage: `ES data storage`,
  },
  summaryMemory: {
    id: `deployment-architecture-summary.summary-memory`,
    defaultMessage: `Memory`,
  },
  summaryStorage: {
    id: `deployment-architecture-summary.summary-storage`,
    defaultMessage: `Storage`,
  },
  summaryTotalMemory: {
    id: `deployment-architecture-summary.summary-total-memory`,
    defaultMessage: `Total memory`,
  },
  summaryTotalStorage: {
    id: `deployment-architecture-summary.summary-total-storage`,
    defaultMessage: `Total storage`,
  },
  summaryZoneCount: {
    id: `deployment-architecture-summary.summary-zone-count`,
    defaultMessage: `{ maxZoneCount } { maxZoneCount, plural, one {Zone} other {Zones} }`,
  },
  hourlyRate: {
    id: `deployment-architecture-summary.pricing-hourly`,
    defaultMessage: `Hourly rate`,
  },
  initialHourlyRate: {
    id: `deployment-architecture-summary.pricing-initial-hourly`,
    defaultMessage: `Initial hourly rate`,
  },
  tiebreakerSurchargeHourly: {
    id: `deployment-architecture-summary.tiebreaker-surcharge-hourly`,
    defaultMessage: `{ cost } per hour`,
  },
  tiebreakerSurchargeUnit: {
    id: `deployment-architecture-summary.tiebreaker-surcharge-awsm-unit`,
    defaultMessage: `{ units } unit per hour`,
  },
  hourlyUnitsLabel: {
    id: `deployment-architecture-summary.pricing-hourly-awsm-units-label`,
    defaultMessage: `Hourly units`,
  },
  hourlyUnits: {
    id: `deployment-architecture-summary.pricing-hourly-awsm-units`,
    defaultMessage: `{ units } × { dimension }`,
  },
  free: {
    id: `deployment-architecture-summary.free`,
    defaultMessage: `free`,
  },
  total: {
    id: `deployment-architecture-summary.total`,
    defaultMessage: `total`,
  },
  support: {
    id: `deployment-architecture-summary.support`,
    defaultMessage: `support`,
  },
  warmMemory: {
    id: `deployment-architecture-summary.warm-memory`,
    defaultMessage: `Warm memory`,
  },
  warmStorage: {
    id: `deployment-architecture-summary.warm-storage`,
    defaultMessage: `Warm storage`,
  },
  hotMemory: {
    id: `deployment-architecture-summary.hot-memory`,
    defaultMessage: `Hot memory`,
  },
  hotStorage: {
    id: `deployment-architecture-summary.hot-storage`,
    defaultMessage: `Hot storage`,
  },
  coldMemory: {
    id: `deployment-architecture-summary.cold-memory`,
    defaultMessage: `Cold memory`,
  },
  coldStorage: {
    id: `deployment-architecture-summary.cold-storage`,
    defaultMessage: `Cold storage`,
  },
  frozenMemory: {
    id: `deployment-architecture-summary.frozen-memory`,
    defaultMessage: `Frozen memory`,
  },
  frozenStorage: {
    id: `deployment-architecture-summary.frozen-storage`,
    defaultMessage: `Frozen storage`,
  },
})

export const dedicatedNodeTypeMessages = defineMessages({
  master: {
    id: `deployment-architecture-summary.summary-master-memory`,
    defaultMessage: `Master memory`,
  },
  ingest: {
    id: `deployment-architecture-summary.summary-coordinating-memory`,
    defaultMessage: `Coordinating memory`,
  },
})
