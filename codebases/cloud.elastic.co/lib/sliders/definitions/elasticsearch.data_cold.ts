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

import { SliderNodeDefinition } from '../types'

const definition: SliderNodeDefinition = {
  messages: defineMessages({
    prettyName: {
      id: `sliders.elasticsearch.data_cold.prettyName`,
      defaultMessage: `Cold data`,
    },
    deploymentTemplateDescription: {
      id: `sliders.elasticsearch.data_cold.deploymentTemplateDescription`,
      defaultMessage: `Store rarely queried data on a cold tier for increased cost savings.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.elasticsearch.data_cold.instanceConfigurationDescription`,
      defaultMessage: `Store rarely queried data on a cold tier for increased cost savings.`,
    },
  }),
  iconType: `logoElasticsearch`,
  trialLimit: {
    memorySize: 4096,
    zoneCount: 2,
  },
}

export default definition
