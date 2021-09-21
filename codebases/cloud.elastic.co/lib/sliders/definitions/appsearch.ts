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
      id: `sliders.appsearch.prettyName`,
      defaultMessage: `App Search`,
    },
    description: {
      id: `sliders.appsearch.description`,
      defaultMessage: `Add refined search experiences to your applications.`,
    },
    deploymentTemplateDescription: {
      id: `sliders.appsearch.deploymentTemplateDescription`,
      defaultMessage: `Add refined search experiences to your applications.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.appsearch.instanceConfigurationDescription`,
      defaultMessage: `Configure a customized search engine to add to your applications.`,
    },
  }),
  iconType: `logoAppSearch`,
  trialLimit: {
    memorySize: 2048,
    zoneCount: 1,
  },
  userSettingsFileName: `app-search.yml`,
  applicationPath: `/login`,
  applicationPathWhenUsingSso: `/`,
  unsupportedFromVersion: `>=7.7.0`,
}

export default definition
