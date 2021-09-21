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

import React, { FunctionComponent, ReactChild } from 'react'
import { EuiText } from '@elastic/eui'

import './nodeAttributeList.scss'

export type NodeAttribute = {
  'data-test-id'?: string
  content: ReactChild
}

interface Props {
  attributes: NodeAttribute[]
}

const NodeAttributeList: FunctionComponent<Props> = ({ attributes }) => (
  <ul className='node-visualization-attribute-list'>
    {attributes.map(({ content, ['data-test-id']: dataTestSubj }, i) => (
      <li key={i} className='node-visualization-attribute-list-item' data-test-id={dataTestSubj}>
        {typeof content === 'string' ? (
          <EuiText color='default' size='xs' data-test-id='node-attribute-list-string-content'>
            {content}
          </EuiText>
        ) : (
          content
        )}
      </li>
    ))}
  </ul>
)

export default NodeAttributeList
