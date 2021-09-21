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
import { FormattedMessage } from 'react-intl'

import { EuiButtonEmpty, EuiDescriptionList, EuiPopover } from '@elastic/eui'
import { EuiDescriptionListProps } from '@elastic/eui/lib/services'

type Props = {
  onClose: () => void
  isOpen: boolean
  onClick: () => void
  listItems: EuiDescriptionListProps['listItems']
}

const InstanceInfoPopover: FunctionComponent<Props> = ({ onClose, isOpen, onClick, listItems }) => {
  const button = (
    <EuiButtonEmpty size='s' onClick={() => onClick()}>
      <FormattedMessage defaultMessage='info' id='instance-configuration.info' />
    </EuiButtonEmpty>
  )

  return (
    <EuiPopover
      anchorPosition='upCenter'
      ownFocus={true}
      button={button}
      isOpen={isOpen}
      closePopover={() => onClose()}
    >
      <EuiDescriptionList listItems={listItems} />
    </EuiPopover>
  )
}

export default InstanceInfoPopover
