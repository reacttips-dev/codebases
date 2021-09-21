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
      id: `sliders.elasticsearch.coordinator.prettyName`,
      defaultMessage: `Coordinator`,
    },
    deploymentTemplateDescription: {
      id: `sliders.elasticsearch.coordinator.deploymentTemplateDescription`,
      defaultMessage: `Coordinating nodes are dedicated to handling incoming requests and are capable of running ingest pipelines.`,
    },
  }),
  iconType: `logoElasticsearch`,
}

export default definition
