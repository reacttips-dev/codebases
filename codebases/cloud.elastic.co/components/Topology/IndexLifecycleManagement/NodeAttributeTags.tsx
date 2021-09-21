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

import React from 'react'

import { EuiSpacer } from '@elastic/eui'

import NodeAttributeTag from './NodeAttributeTag'

import { InstanceTemplateConfig } from '../../../types'

import './indexLifecycleManagementSettings.scss'

type Props = {
  instance: InstanceTemplateConfig
  index: number
  disabled: boolean
  onRemove?: (attribute: { key: string; value: string }, index: number) => void
}

const NodeAttributeTags: React.FunctionComponent<Props> = ({
  instance,
  index,
  disabled,
  onRemove,
}) => (
  <div key={index} className='ilmSettings-nodeAttributeTags'>
    {Object.keys(instance.nodeAttributes).length > 0 &&
      Object.keys(instance.nodeAttributes).map((attributeKey) => {
        const attribute = {
          key: attributeKey,
          value: instance.nodeAttributes ? instance.nodeAttributes[attributeKey] : ``,
        }
        return (
          <NodeAttributeTag
            iconType={disabled ? undefined : 'cross'}
            iconSide='right'
            onClick={disabled ? undefined : () => onRemove && onRemove(attribute, index)}
            attribute={attribute}
            key={attributeKey}
          />
        )
      })}
    <EuiSpacer />
  </div>
)

export default NodeAttributeTags
