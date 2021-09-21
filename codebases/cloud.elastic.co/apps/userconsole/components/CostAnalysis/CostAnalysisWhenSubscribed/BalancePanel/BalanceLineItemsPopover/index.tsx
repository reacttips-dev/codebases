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

import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiLink, EuiPopover, EuiPopoverTitle } from '@elastic/eui'
import BalanceLineItems from './BalanceLineItems'
import { SimplifiedLineItem } from '../../../../../../../lib/api/v1/types'

import './balanceLineItemsPopover.scss'

interface Props {
  lineItems: SimplifiedLineItem[]
}

interface State {
  isOpen: boolean
}

class BalanceLineItemsPopover extends PureComponent<Props, State> {
  state = {
    isOpen: false,
  }

  render(): ReactElement | null {
    const { lineItems } = this.props
    const { isOpen } = this.state

    if (!lineItems.length) {
      return null
    }

    return (
      <EuiPopover
        button={this.renderPopoverButton()}
        isOpen={isOpen}
        closePopover={() => this.setState({ isOpen: false })}
      >
        <EuiPopoverTitle>
          <FormattedMessage
            id='cost-analysis.popover-info.title'
            defaultMessage='Total available balance by order line'
          />
        </EuiPopoverTitle>
        <BalanceLineItems items={lineItems} />
      </EuiPopover>
    )
  }

  renderPopoverButton(): ReactElement {
    return (
      <EuiLink onClick={this.togglePopover}>
        <FormattedMessage id='cost-analysis.popover-info' defaultMessage='Info' />
      </EuiLink>
    )
  }

  togglePopover = (): void => {
    this.setState({ isOpen: true })
  }
}

export default BalanceLineItemsPopover
