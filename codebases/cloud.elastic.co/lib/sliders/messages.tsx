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

import React, { Fragment } from 'react'
import { FormattedMessage, MessageDescriptor } from 'react-intl'
import { pickBy } from 'lodash'

import { getSliderDefinition } from './definitions'
import { getNodeRoles, getDataRoles } from '../stackDeployments/selectors/nodeRoles'

import {
  AnyTopologyElement,
  SliderType,
  SliderInstanceType,
  DynamicSliderInstanceDefinitionParams,
} from '../../types'
import { ElasticsearchClusterTopologyElement } from '../api/v1/types'

export const getSliderMessages = function (
  args: SliderType & DynamicSliderInstanceDefinitionParams,
): Record<string, MessageDescriptor> {
  const definition = getSliderDefinition(args)

  // whittle down possible messages to only the defined ones to appease the Messages type
  const sliderMessages = pickBy<MessageDescriptor>(definition.messages)

  return sliderMessages
}

export const getSliderPrettyName = function (
  args: SliderType & DynamicSliderInstanceDefinitionParams,
): MessageDescriptor {
  const definition = getSliderDefinition(args)
  return definition.messages.prettyName
}

export const getTopologyElementName = function ({
  sliderInstanceType,
  topologyElement,
  ...dynamicSliderInstanceDefinitionParams
}: DynamicSliderInstanceDefinitionParams & {
  sliderInstanceType: SliderInstanceType
  topologyElement: AnyTopologyElement
}): JSX.Element | JSX.Element[] {
  const dataRoles = getDataRoles({ topologyElement })
  const nodeRoles = getNodeRoles({ topologyElement })

  if (dataRoles.length <= 1) {
    // treat legacy node-attribute-based data:hot/data:warm topology elements as
    // data_hot/data_warm for display purposes
    if (dataRoles[0] === `data`) {
      const esTopologyElement = topologyElement as ElasticsearchClusterTopologyElement

      if (esTopologyElement.elasticsearch?.node_attributes?.data === `hot`) {
        return (
          <FormattedMessage
            {...getSliderPrettyName({
              sliderInstanceType,
              sliderNodeType: `data_hot`,
              ...dynamicSliderInstanceDefinitionParams,
            })}
          />
        )
      }

      if (esTopologyElement.elasticsearch?.node_attributes?.data === `warm`) {
        return (
          <FormattedMessage
            {...getSliderPrettyName({
              sliderInstanceType,
              sliderNodeType: `data_warm`,
              ...dynamicSliderInstanceDefinitionParams,
            })}
          />
        )
      }
    }

    return (
      <FormattedMessage
        {...getSliderPrettyName({
          sliderInstanceType,
          sliderNodeType: nodeRoles[0],
          ...dynamicSliderInstanceDefinitionParams,
        })}
      />
    )
  }

  // there is a max of two data roles in practice (content + hot) so we can just
  // stick an "and" in between them
  const prettyNames = dataRoles.map((sliderNodeType) => (
    <FormattedMessage
      {...getSliderPrettyName({
        sliderInstanceType,
        sliderNodeType,
        ...dynamicSliderInstanceDefinitionParams,
      })}
    />
  ))

  return [
    prettyNames[0],
    <Fragment>{` `}</Fragment>,
    <FormattedMessage id='and' defaultMessage='and' />,
    <Fragment>{` `}</Fragment>,
    prettyNames[1],
  ]
}
