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
      id: `sliders.kibana.prettyName`,
      defaultMessage: `Kibana`,
    },
    description: {
      id: `sliders.kibana.description`,
      defaultMessage: `Visualize data and navigate the Elastic Stack.`,
    },
    deploymentTemplateDescription: {
      id: `sliders.kibana.deploymentTemplateDescription`,
      defaultMessage: `Kibana lets you visualize your Elasticsearch data and navigate the Elastic Stack. Kibana ships with the classics: histograms, line graphs, pie charts, sunbursts, and more.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.kibana.instanceConfigurationDescription`,
      defaultMessage: `Visualize data and interact with the Elastic Stack.`,
    },
  }),
  iconType: `logoKibana`,
  trialLimit: {
    memorySize: 1024,
    zoneCount: 1,
  },
  userSettingsFileName: `kibana.yml`,
}

export default definition
