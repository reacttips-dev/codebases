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
      id: `sliders.enterprise_search.prettyName`,
      defaultMessage: `Enterprise Search`,
    },
    description: {
      id: `sliders.enterprise_search.description`,
      defaultMessage: `Add modern search to your application or connect and unify content across your workplace.`,
    },
    deploymentTemplateDescription: {
      id: `sliders.enterprise_search.deploymentTemplateDescription`,
      defaultMessage: `Elastic Enterprise Search packages App Search and Workplace Search within a single solution. Add modern search to your application or connect and unify content across your workplace.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.enterprise_search.instanceConfigurationDescription`,
      defaultMessage: `Add modern search to your application or connect and unify content across your workplace.`,
    },
  }),
  iconType: `logoEnterpriseSearch`,
  trialLimit: {
    memorySize: 2048,
    zoneCount: 1,
  },
  applicationPath: `/login`,
  userSettingsFileName: `enterprise-search.yml`,
  applicationPathWhenUsingSso: `/`,
}

export default definition
