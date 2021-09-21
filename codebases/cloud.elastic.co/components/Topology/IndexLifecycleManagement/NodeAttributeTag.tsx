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

import React, { FunctionComponent } from 'react'

import { EuiBadge, EuiBadgeProps, EuiSpacer } from '@elastic/eui'

type Props = {
  attribute: { key: string; value: string }
  onClick?: () => void
  iconType?: 'cross' | undefined
  iconSide?: EuiBadgeProps['iconSide']
}

const NodeAttributeTag: FunctionComponent<Props> = ({ attribute, onClick, iconType, iconSide }) => {
  const tagText = attribute.value ? `${attribute.key}: ${attribute.value}` : attribute.key

  const commonProps = {
    'aria-label': tagText,
    iconType,
    iconSide,
    children: tagText,
  }

  return (
    <div>
      {onClick ? (
        <EuiBadge {...commonProps} onClick={onClick} onClickAriaLabel={tagText} />
      ) : (
        <EuiBadge {...commonProps} />
      )}

      <EuiSpacer size='xs' />
    </div>
  )
}

export default NodeAttributeTag
