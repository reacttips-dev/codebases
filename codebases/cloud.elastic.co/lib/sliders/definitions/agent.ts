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
      id: `sliders.agent.prettyName`,
      defaultMessage: `Elastic Agent`,
    },
    description: {
      id: `sliders.agent.description`,
      defaultMessage: `Elastic Agent description placeholder.`,
    },
    deploymentTemplateDescription: {
      id: `sliders.agent.deploymentTemplateDescription`,
      defaultMessage: `Elastic Agent deployment template description placeholder.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.agent.instanceConfigurationDescription`,
      defaultMessage: `Elastic Agent instance configuration description placeholder.`,
    },
  }),
  iconType: `faceHappy`,
  trialLimit: {
    memorySize: 1024,
    zoneCount: 1,
  },
  userSettingsFileName: `agent.yml`,
}

export default definition
