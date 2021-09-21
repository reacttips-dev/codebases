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
      id: `sliders.elasticsearch.coordinating.prettyName`,
      defaultMessage: `Coordinating`,
    },
    deploymentTemplateDescription: {
      id: `sliders.elasticsearch.coordinating.deploymentTemplateDescription`,
      defaultMessage: `Coordinating nodes are dedicated to processing all incoming requests. Selecting a dedicated coordinating node results in better performance and less chance of failure.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.elasticsearch.coordinating.instanceConfigurationDescription`,
      defaultMessage: `Coordinating nodes are dedicated to processing all incoming requests. Selecting a dedicated coordinating node results in better performance and less chance of failure.`,
    },
  }),
  iconType: `logoElasticsearch`,
}

export default definition
