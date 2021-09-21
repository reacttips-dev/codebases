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

const v2 = {
  zone_count: 1,
  cluster_topology: [
    {
      node_configuration: `data.default`,
      node_count_per_zone: 1,
      memory_per_node: 1024,
    },
  ],
  elasticsearch: {
    include_default_plugins: true,
    enabled_built_in_plugins: [],
    user_bundles: [],
    user_plugins: [],
    system_settings: {
      auto_create_index: true,
      destructive_requires_name: false,
      default_shards_per_index: 1,
      scripting: {
        inline: {
          enabled: true,
          sandbox_mode: true,
        },
        stored: {
          enabled: true,
          sandbox_mode: true,
        },
        file: {
          enabled: true,
          sandbox_mode: false,
        },
      },
    },
  },
}

const v5 = {
  zone_count: 1,
  cluster_topology: [
    {
      node_configuration: `data.default`,
      node_count_per_zone: 1,
      memory_per_node: 1024,
    },
  ],
  elasticsearch: {
    include_default_plugins: true,
    enabled_built_in_plugins: [],
    user_bundles: [],
    user_plugins: [],
    system_settings: {
      auto_create_index: true,
      destructive_requires_name: false,
      scripting: {
        inline: {
          enabled: true,
          sandbox_mode: true,
        },
        stored: {
          enabled: true,
          sandbox_mode: true,
        },
        file: {
          enabled: false,
          sandbox_mode: false,
        },
        expressions_enabled: true,
        mustache_enabled: true,
        painless_enabled: true,
      },
    },
  },
}

const v6 = {
  zone_count: 1,
  cluster_topology: [
    {
      node_configuration: `data.default`,
      node_count_per_zone: 1,
      memory_per_node: 1024,
    },
  ],
  elasticsearch: {
    include_default_plugins: true,
    enabled_built_in_plugins: [],
    user_bundles: [],
    user_plugins: [],
    system_settings: {
      auto_create_index: true,
      destructive_requires_name: false,
      scripting: {
        inline: {
          enabled: true,
        },
        stored: {
          enabled: true,
        },
      },
    },
  },
}

const v7 = {
  zone_count: 1,
  cluster_topology: [
    {
      node_configuration: `data.default`,
      node_count_per_zone: 1,
      memory_per_node: 1024,
    },
  ],
  elasticsearch: {
    include_default_plugins: true,
    enabled_built_in_plugins: [],
    user_bundles: [],
    user_plugins: [],
    system_settings: {
      auto_create_index: true,
      destructive_requires_name: false,
      scripting: {
        inline: {
          enabled: true,
        },
        stored: {
          enabled: true,
        },
      },
    },
  },
}

export default {
  '2.x': v2,
  '5.x': v5,
  '6.x': v6,
  '7.x': v7,
}
