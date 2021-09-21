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
      id: `sliders.appsearch.appserver.prettyName`,
      defaultMessage: `Application server`,
    },
    deploymentTemplateDescription: {
      id: `sliders.appsearch.appserver.deploymentTemplateDescription`,
      defaultMessage: `The App Search application server runs queries, provides data ingestion endpoints, and serves the search management application. We recommend a 1:1 size ratio with worker nodes.`,
    },
  }),
  iconType: `logoAppSearch`,
}

export default definition
