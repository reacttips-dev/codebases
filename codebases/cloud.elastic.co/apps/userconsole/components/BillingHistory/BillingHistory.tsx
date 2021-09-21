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

import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'

import { EuiEmptyPrompt, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import { CuiTable } from '../../../../cui'

import ExternalLink from '../../../../components/ExternalLink'

import Price from '../formatters/Price'
import BillingHistoryChart from './BillingHistoryChart'

import { startPageActions } from '../../../../lib/apm'

import { awsBillingUrl, gcpBillingUrl } from '../../urls'

import { Theme, UserSubscription } from '../../../../types'
import './billingHistory.scss'

type Props = {
  fetchBillingHistory: () => void
  subscription: UserSubscription
  billingHistory: any
  theme: Theme
}

class BillingHistory extends Component<Props> {
  // This component manages its own page transactions because it interweaves
  // AWS and non-AWS behaviour, making it unsuitable to use with `withLoading`.
  // Probably this should be two separate components.
  startedTransaction = false

  componentDidMount() {
    const { fetchBillingHistory, subscription } = this.props

    if (!subscription) {
      fetchBillingHistory()
    }
  }

  componentDidUpdate() {
    const { billingHistory, subscription } = this.props
    const isAwsm = subscription === `aws`
    const isGcpm = subscription === `gcp`

    if (!this.startedTransaction && (isAwsm || isGcpm || billingHistory != null)) {
      this.startedTransaction = true
      startPageActions(`Billing history`)
    }
  }

  render() {
    const { subscription, billingHistory, theme } = this.props
    const isAwsm = subscription === `aws`
    const isGcpm = subscription === `gcp`

    if (subscription) {
      if (isAwsm) {
        return (
          <div>
            <EuiText>
              <FormattedMessage
                id='uc.billingHistory.awsmMessage'
                defaultMessage='This account is billed by AWS Marketplace. Please go to the {link} to see your billing history.'
                values={{
                  link: (
                    <ExternalLink href={awsBillingUrl}>
                      <FormattedMessage
                        id='uc.billingHistory.awsmMessage.link'
                        defaultMessage='AWS Billing Management Console'
                      />
                    </ExternalLink>
                  ),
                }}
              />
            </EuiText>
          </div>
        )
      }

      if (isGcpm) {
        return (
          <div>
            <EuiText>
              <FormattedMessage
                id='uc.billingHistory.gcpmMessage'
                defaultMessage='This account is billed to a GCP Marketplace account. Visit the {link} page to see your history.'
                values={{
                  link: (
                    <ExternalLink href={gcpBillingUrl}>
                      <FormattedMessage
                        id='uc.billingHistory.gcpmMessage.link'
                        defaultMessage='Billing'
                      />
                    </ExternalLink>
                  ),
                }}
              />
            </EuiText>
          </div>
        )
      }
    }

    if (billingHistory && billingHistory.length === 0) {
      return (
        <EuiEmptyPrompt
          style={{ maxWidth: `50em` }}
          title={
            <h2>
              <FormattedMessage
                id='uc.billingHistory.emptyInvoicesTitle'
                defaultMessage='You have no invoices'
              />
            </h2>
          }
          body={
            <FormattedMessage
              id='uc.billingHistory.emptyInvoices'
              defaultMessage='New invoices will show here the first day of the month.'
            />
          }
        />
      )
    }

    return (
      <Fragment>
        <EuiTitle size='xs'>
          <h4>
            <FormattedMessage id='uc.billingHistory.invoicesHeading' defaultMessage='Invoices' />
          </h4>
        </EuiTitle>

        {billingHistory && <BillingHistoryChart billingHistory={billingHistory} theme={theme} />}

        <EuiSpacer size='s' />

        {this.renderBillingHistoryTable()}
      </Fragment>
    )
  }

  renderBillingHistoryTable() {
    const { billingHistory } = this.props

    return (
      <CuiTable
        pageSize={8}
        rows={billingHistory}
        initialLoading={billingHistory == null}
        columns={[
          {
            label: (
              <FormattedMessage
                id='uc.billingHistory.receipts.invoiceNumberHeader'
                defaultMessage='Invoice number'
              />
            ),
            render: (invoice) => <a href={invoice.pdf_download_url}>{invoice.invoice_id}</a>,
            sortKey: `invoice_id`,
          },
          {
            label: (
              <FormattedMessage
                id='uc.billingHistory.receipts.periodHeader'
                defaultMessage='Period'
              />
            ),
            render: (invoice) => {
              const startDate = moment.utc(invoice.data.start)
              const endDate = moment(startDate).endOf(`month`)
              return (
                <span>
                  {startDate.format(`ll`)} – {endDate.format(`ll`)}
                </span>
              )
            },
          },
          {
            label: (
              <FormattedMessage
                id='uc.billingHistory.receipts.amountHeader'
                defaultMessage='Amount'
              />
            ),
            render: (invoice) => <Price unit='cents' value={invoice.total_amount_in_cents} />,
            sortKey: `total_amount_in_cents`,
          },
          {
            label: (
              <FormattedMessage
                id='uc.billingHistory.receipts.statusHeader'
                defaultMessage='Status'
              />
            ),
            render: (invoice) => {
              if (invoice.status === `paid`) {
                return <FormattedMessage id='uc.billingHistory.paid' defaultMessage='Paid' />
              }

              return <FormattedMessage id='uc.billingHistory.pastDue' defaultMessage='Past due' />
            },
            sortKey: `status`,
          },
        ]}
      />
    )
  }
}

export default BillingHistory
