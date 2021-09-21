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

import React, { FunctionComponent, ReactNode } from 'react'
import loadable from '@loadable/component'

import { EuiButton } from '@elastic/eui'

// We use lazy loading here to prevent the Edit flow in AC from attempting to load recurly
const CreditCardModalButtonLoaded = loadable(() => import(`./CreditCardModalButton`))

type Props = {
  disabled?: boolean
  fill?: boolean
  type: string
  className?: string
  onSendBillingDetailsSuccess?: () => void
  children: ReactNode
}

const CreditCardModalButton: FunctionComponent<Props> = (props: Props) => {
  const { children } = props

  return (
    <CreditCardModalButtonLoaded
      {...props}
      fallback={
        <EuiButton data-test-id='open-credit-card-modal-loading-button' isDisabled={true}>
          {children}
        </EuiButton>
      }
    />
  )
}

export default CreditCardModalButton
