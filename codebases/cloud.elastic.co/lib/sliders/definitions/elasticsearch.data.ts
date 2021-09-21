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
      id: `sliders.elasticsearch.data.prettyName`,
      defaultMessage: `Data`,
    },
    deploymentTemplateDescription: {
      id: `sliders.elasticsearch.data.deploymentTemplateDescription`,
      defaultMessage: `Data nodes hold data and perform data related operations such as CRUD, search, and aggregations.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.elasticsearch.data.instanceConfigurationDescription`,
      defaultMessage: `Data nodes hold data and perform data related operations such as CRUD, search, and aggregations.`,
    },
  }),
  iconType: `logoElasticsearch`,
  trialLimit: {
    memorySize: 4096,
    zoneCount: 2,
  },
}

export default definition
