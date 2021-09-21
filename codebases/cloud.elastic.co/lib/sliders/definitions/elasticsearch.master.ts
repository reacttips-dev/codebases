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
      id: `sliders.elasticsearch.master.prettyName`,
      defaultMessage: `Master`,
    },
    deploymentTemplateDescription: {
      id: `sliders.elasticsearch.master.deploymentTemplateDescription`,
      defaultMessage: `Master nodes control the cluster. As your cluster grows, it becomes important to consider separating dedicated master-eligible nodes from dedicated data nodes.`,
    },
    instanceConfigurationDescription: {
      id: `sliders.elasticsearch.master.instanceConfigurationDescription`,
      defaultMessage: `Master nodes control the cluster. As your cluster grows, it becomes important to consider separating dedicated master-eligible nodes from dedicated data nodes.`,
    },
  }),
  iconType: `logoElasticsearch`,
}

export default definition
