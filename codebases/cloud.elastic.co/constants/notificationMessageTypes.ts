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

export const APM_INTRO_NOTIFICATION_STORAGE_KEY: 'APM_INTRO_NOTIFICATION_DISMISSED' = `APM_INTRO_NOTIFICATION_DISMISSED`
export const BETA_NOTIFICATION_STORAGE_KEY: 'BETA_NOTIFICATION_DISMISSED' = `BETA_NOTIFICATION_DISMISSED`
export const HOT_WARM_CHANGES_STORAGE_KEY: 'HOT_WARM_CHANGES_STORAGE_KEY' = `HOT_WARM_CHANGES_STORAGE_KEY`

export type NotificationMessageType =
  | typeof APM_INTRO_NOTIFICATION_STORAGE_KEY
  | typeof BETA_NOTIFICATION_STORAGE_KEY
  | typeof HOT_WARM_CHANGES_STORAGE_KEY
