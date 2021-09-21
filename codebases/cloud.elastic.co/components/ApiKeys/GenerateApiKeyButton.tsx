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

import React, { SFC } from 'react'
import { EuiButton } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

type Props = {
  onClick: () => void
  eceDisplay?: boolean
}

const GenerateApiKeyButton: SFC<Props> = (props) => {
  const { onClick, eceDisplay } = props
  return (
    <EuiButton
      data-test-id='generateKey-button'
      fill={eceDisplay ? false : true}
      onClick={() => onClick()}
    >
      <FormattedMessage {...messages.generateKeyButtonLabel} />
    </EuiButton>
  )
}

export default GenerateApiKeyButton
