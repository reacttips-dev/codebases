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
import React, { FunctionComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiText, EuiButton, EuiLink } from '@elastic/eui'

type Props = {
  onClick: () => void
  text?: ReactElement
  type?: 'link'
}

const ChangeSubscriptionButton: FunctionComponent<Props> = ({
  onClick,
  text = (
    <FormattedMessage
      id='current-billing-cycle.change-my-subscription'
      defaultMessage='Update subscription'
    />
  ),
  type,
}) => {
  const Button = type === `link` ? EuiLink : EuiButton

  return (
    <EuiText size='s'>
      <Button onClick={() => onClick()} data-test-id='change-subscription-button'>
        {text}
      </Button>
    </EuiText>
  )
}

export default ChangeSubscriptionButton
