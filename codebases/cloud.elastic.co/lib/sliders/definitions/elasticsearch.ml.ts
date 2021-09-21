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
      id: `sliders.elasticsearch.ml.prettyName`,
      defaultMessage: `Machine Learning`,
    },
    description: {
      id: `sliders.elasticsearch.ml.description`,
      defaultMessage: `Automatically model the behavior of your Elasticsearch data — trends, periodicity, and more.`,
    },
    deploymentTemplateDescription: {
      id: `sliders.elasticsearch.ml.deploymentTemplateDescription`,
      defaultMessage: `Elastic machine learning automatically models the behaviour of your Elasticsearch data in real time to identify issues faster, streamline root cause analysis, and reduce false positives.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.elasticsearch.ml.instanceConfigurationDescription`,
      defaultMessage: `Automates the analysis of time-series data by creating baselines of normal behavior and identifying anomalous patterns in that data.`,
    },
  }),
  iconType: `machineLearningApp`,
  trialLimit: {
    memorySize: 1024,
    zoneCount: 1,
  },
}

export default definition
