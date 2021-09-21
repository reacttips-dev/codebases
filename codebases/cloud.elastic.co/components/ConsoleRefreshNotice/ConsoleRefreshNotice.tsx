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

import { EuiBottomBar, EuiFlexGroup, EuiFlexItem, EuiButtonEmpty } from '@elastic/eui'

type Props = {
  buildTagMismatchFeature: boolean
  buildTagMismatch: boolean
}

const ConsoleRefreshNotice: FunctionComponent<Props> = ({
  buildTagMismatchFeature,
  buildTagMismatch,
}) => {
  if (!buildTagMismatchFeature) {
    return null
  }

  if (!buildTagMismatch) {
    return null
  }

  return (
    <EuiBottomBar paddingSize='s'>
      <EuiFlexGroup gutterSize='xs' justifyContent='spaceAround'>
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty
            size='xs'
            color='ghost'
            iconType='refresh'
            iconSide='right'
            onClick={() => location.reload()}
          >
            <FormattedMessage
              id='console-refresh-notice.message'
              defaultMessage="A new version is available. Click here to refresh the page, whenever you're ready!"
            />
          </EuiButtonEmpty>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiBottomBar>
  )
}

export default ConsoleRefreshNotice
