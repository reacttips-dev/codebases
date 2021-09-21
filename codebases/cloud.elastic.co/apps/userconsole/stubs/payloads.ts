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

// This file exists to stub API responses during development. There's a chance
// we may go live with some of these sticking around (e.g. root) due to the
// effort involved in removing those calls from both UC and ECE, but cast a
// critical eye at anything in here after the initial dev work.

export const root = {
  ok: true,
  message: `You Know, for Cloud. Welcome, root.`,
  eula_accepted: false,
  hrefs: {
    regions: `https://cloud-dev.elastic.co:12400/api/v1/regions`,
    elasticsearch: `https://cloud-dev.elastic.co:12400/api/v0/v1-elasticsearch`,
    email: `https://cloud-dev.elastic.co:12400/api/v0.1/email`,
    logs: `https://cloud-dev.elastic.co:12400/api/v0.1/logs`,
    'database/users': `https://cloud-dev.elastic.co:12400/api/v0.1/database/users`,
  },
}

export const nodeTypes = {
  node_types: [
    {
      node_type_id: `default`,
      overrides: {
        instance_data: {
          overrides: {
            quota: {
              fs_multiplier: 24,
            },
          },
        },
      },
    },
  ],
  ok: true,
}

export const snapshotRepos = {
  configs: [],
}

export const clusterSnapshots = {
  snapshots: [
    {
      snapshot: `scheduled-1511519463-instance-0000000000`,
      uuid: `3O_L77oHRbWQxPux8Q4lEw`,
      version_id: 5050199,
      version: `5.5.1`,
      indices: [
        `.kibana`,
        `.monitoring-kibana-6-2017.11.22`,
        `.monitoring-kibana-6-2017.11.23`,
        `.monitoring-kibana-6-2017.11.24`,
        `.security`,
        `.triggered_watches`,
        `.watcher-history-3-2017.11.22`,
        `.watcher-history-3-2017.11.23`,
        `.watcher-history-3-2017.11.24`,
        `.watches`,
        `benchmark-reports-2017-08-01`,
        `benchmark-reports-2017-09-01`,
        `benchmark-reports-2017-10-01`,
        `benchmark-reports-2017-11-01`,
      ],

      state: `SUCCESS`,
      start_time: `2017-11-24T10:31:03.750Z`,
      start_time_in_millis: 1511519463750,
      end_time: `2017-11-24T10:31:47.583Z`,
      end_time_in_millis: 1511519507583,
      duration_in_millis: 43833,
      failures: [],
      shards: { total: 117, failed: 0, successful: 117 },
    },
  ],
}
