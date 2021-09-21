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

import { SliderInstanceDefinition } from '../types'

const definition: SliderInstanceDefinition = {
  messages: defineMessages({
    prettyName: {
      id: `sliders.elasticsearch.prettyName`,
      defaultMessage: `Elasticsearch`,
    },
    description: {
      id: `sliders.elasticsearch.description`,
      defaultMessage: `Store, search, and analyze big volumes of data quickly.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.elasticsearch.instanceConfigurationDescription`,
      defaultMessage: `Provides real-time search and an analytics engine, the heart of the Elastic Stack.`,
    },
  }),
  iconType: `logoElasticsearch`,
  trialLimit: {
    memorySize: 4096,
    zoneCount: 2,
  },
  userSettingsFileName: `elasticsearch.yml`,
  nodeTypeSets: [
    {
      id: `default`,
      messages: {
        prettyName: {
          id: `nodeTypeSets.elasticsearch.default.prettyName`,
          defaultMessage: `Default`,
        },
        instanceConfigurationDescription: {
          id: `nodeTypeSets.elasticsearch.default.instanceConfigurationDescription`,
          defaultMessage: `Includes Data, Master and Coordinating.`,
        },
      },
      nodeTypes: {
        data: true,
        master: true,
        ingest: true,
        ml: false,
      },
    },
    {
      id: `data`,
      messages: {
        prettyName: { id: `nodeTypeSets.elasticsearch.data.prettyName`, defaultMessage: `Data` },
        instanceConfigurationDescription: {
          id: `nodeTypeSets.elasticsearch.data.instanceConfigurationDescription`,
          defaultMessage: `Store, search, and analyze big volumes of data quickly.`,
        },
      },
      nodeTypes: {
        data: true,
        master: false,
        ingest: false,
        ml: false,
      },
    },
    {
      id: `master`,
      messages: {
        prettyName: {
          id: `nodeTypeSets.elasticsearch.master.prettyName`,
          defaultMessage: `Master`,
        },
        instanceConfigurationDescription: {
          id: `nodeTypeSets.elasticsearch.master.instanceConfigurationDescription`,
          defaultMessage: `Controls cluster-wide activity such as creating or deleting an index, tracking nodes in the cluster, and allocating shards to nodes.`,
        },
      },
      nodeTypes: {
        data: false,
        master: true,
        ingest: false,
        ml: false,
      },
    },
    {
      id: `coordinating`,
      messages: {
        prettyName: {
          id: `nodeTypeSets.elasticsearch.coordinating.prettyName`,
          defaultMessage: `Coordinating`,
        },
        instanceConfigurationDescription: {
          id: `nodeTypeSets.elasticsearch.coordinating.instanceConfigurationDescription`,
          defaultMessage: `Manages search requests and ingesting data for the cluster.`,
        },
      },
      nodeTypes: {
        data: false,
        master: false,
        ingest: true,
        ml: false,
      },
    },
  ],
}

export default definition
