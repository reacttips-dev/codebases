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

/* Some fields are in snake_case below in order to match with the
 * property names in API requests. */
const messages = defineMessages({
  intervalLabel: {
    id: `cluster-update-snapshot-settings.label`,
    defaultMessage: `Snapshot interval`,
  },
  saveSettings: {
    id: `cluster-update-snapshot-settings.save-settings`,
    defaultMessage: `Save settings`,
  },
  currentInterval: {
    id: `cluster-update-snapshot-settings.current-interval`,
    defaultMessage: `Current interval settings`,
  },
  minutes: {
    id: `cluster-update-snapshot-settings.minutes`,
    defaultMessage: `minutes`,
  },
  hours: {
    id: `cluster-update-snapshot-settings.hours`,
    defaultMessage: `hours`,
  },
  days: {
    id: `cluster-update-snapshot-settings.days`,
    defaultMessage: `days`,
  },
  valueMinutes: {
    id: `cluster-update-snapshot-settings.value-minutes`,
    defaultMessage: `{value} minutes`,
  },
  valueHours: {
    id: `cluster-update-snapshot-settings.value-hours`,
    defaultMessage: `{value} hours`,
  },
  valueDays: {
    id: `cluster-update-snapshot-settings.value-days`,
    defaultMessage: `{value} days`,
  },
  saveSuccessful: {
    id: `cluster-update-snapshot-settings.saveSuccessful`,
    defaultMessage: `interval saved sucessfully`,
  },
  changeMessage: {
    id: `cluster-update-snapshot-settings.change-interval-message`,
    defaultMessage: `When you change the interval, the interval timer begins after the next scheduled snapshot.`,
  },
  numberOfSnapshotsLabel: {
    id: `cluster-update-snapshot-settings.number-of-snapshots.label`,
    defaultMessage: `Snapshot count`,
  },
  numberOfSnapshotsHelp: {
    id: `cluster-update-snapshot-settings.number-of-snapshots.help`,
    defaultMessage: `Number of snapshots to retain`,
  },
  numberOfSnapshots: {
    id: `cluster-update-snapshot-settings.number-of-snapshots.message`,
    defaultMessage: `The number of snapshots you choose to retain. This should be between 2 and 100.`,
  },
  retentionPeriodLabel: {
    id: `cluster-update-snapshot-settings.retention-period.label`,
    defaultMessage: `Retention period`,
  },
  retentionPeriod: {
    id: `cluster-update-snapshot-settings.retention-period.tip`,
    defaultMessage: `The snapshot retention period provides an estimate by calculating the snapshot interval and the expected number of saved snapshots.`,
  },
  snapshotSettingsRequestSuccess: {
    id: `cluster-update-snapshot-settings.request-success`,
    defaultMessage: `Your settings have been updated. Changes will take effect after the next scheduled snapshot.`,
  },
})

export default messages
