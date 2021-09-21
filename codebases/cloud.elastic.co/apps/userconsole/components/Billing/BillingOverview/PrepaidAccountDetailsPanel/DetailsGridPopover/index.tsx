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

import React, { PureComponent, ReactChild, ReactElement } from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'

import { EuiDescriptionList, EuiLink, EuiPopover, EuiText } from '@elastic/eui'

import Price from '../../../../formatters/Price'
import { shortDate } from '../../../../../../../config/dates'

import { LineItem } from '../../../../../../../lib/api/v1/types'

import './detailsGridPopover.scss'

interface Props {
  details: LineItem
}

interface State {
  isOpen: boolean
}

class DetailsGridPopover extends PureComponent<Props, State> {
  state = {
    isOpen: false,
  }

  render(): ReactElement {
    const { isOpen } = this.state

    return (
      <EuiPopover
        button={this.renderPopoverButton()}
        panelClassName='prepaid-account-details-popover'
        isOpen={isOpen}
        closePopover={() => this.setState({ isOpen: false })}
      >
        <EuiDescriptionList
          className='prepaid-account-details-popover-list'
          listItems={this.getDetails()}
          style={{ maxWidth: '300px' }}
          type='column'
        />
      </EuiPopover>
    )
  }

  renderPopoverButton(): ReactElement {
    return (
      <EuiLink onClick={this.togglePopover}>
        <FormattedMessage id='prepaid-account-details-popover.details' defaultMessage='Details' />
      </EuiLink>
    )
  }

  renderDetailsTitle(title: ReactChild): ReactElement {
    return (
      <EuiText size='s' className='prepaid-account-details-popover-title'>
        {title}
      </EuiText>
    )
  }

  renderDetailsDescription(description: ReactChild): ReactElement {
    return (
      <EuiText size='s' className='prepaid-account-details-popover-description'>
        {description}
      </EuiText>
    )
  }

  getDetails(): any {
    const {
      details: { active, discount, ecu_price, ecu_quantity, start },
    } = this.props

    return [
      {
        title: this.renderDetailsTitle(
          <FormattedMessage
            id='prepaid-account-details-popover.start-date'
            defaultMessage='Start date'
          />,
        ),
        description: this.renderDetailsDescription(<FormattedDate value={start} {...shortDate} />),
      },
      {
        title: this.renderDetailsTitle(
          <FormattedMessage
            id='prepaid-account-details-popover.initial-balance'
            defaultMessage='Initial balance (USD)'
          />,
        ),
        description: this.renderDetailsDescription(
          <Price dp={2} unit='none' value={ecu_quantity} />,
        ),
      },
      {
        title: this.renderDetailsTitle(
          <FormattedMessage
            id='prepaid-account-details-popover.unit-price-at-purchase'
            defaultMessage='Unit price at purchase'
          />,
        ),
        description: this.renderDetailsDescription(<Price value={ecu_price} units='none' dp={2} />),
      },
      {
        title: this.renderDetailsTitle(
          <FormattedMessage
            id='prepaid-account-details-popover.discount-rate'
            defaultMessage='Discount rate'
          />,
        ),
        description: this.renderDetailsDescription(`${discount}%`),
      },
      {
        title: this.renderDetailsTitle(
          <FormattedMessage id='prepaid-account-details-popover.status' defaultMessage='Status' />,
        ),
        description: this.renderDetailsDescription(this.getItemStatus({ active })),
      },
    ]
  }

  getItemStatus({ active }: { active: boolean }): ReactElement {
    return active ? (
      <FormattedMessage id='prepaid-account-details-popover.active' defaultMessage='Active' />
    ) : (
      <FormattedMessage id='prepaid-account-details-popover.inactive' defaultMessage='Inactive' />
    )
  }

  togglePopover = (): void => {
    this.setState({ isOpen: true })
  }
}

export default DetailsGridPopover
