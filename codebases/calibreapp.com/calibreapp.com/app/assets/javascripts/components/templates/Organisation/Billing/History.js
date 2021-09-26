import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import { Section, Lockup } from '../../../Layout'
import Table, { Thead, Th, Tr, Td, Tbody } from '../../../Table'
import { LoadingLine } from '../../../Loading'
import { Text, TextLink } from '../../../Type'
import { DownloadIcon } from '../../../Icon'
import { formattedDate } from '../../../../utils/date'

const STATUS_COLOR = {
  paid: 'grey400',
  unpaid: 'red300',
  undefined: 'grey400'
}

const Invoices = ({ history }) => (
  <Table bleed={0}>
    <Thead>
      <Tr>
        <Th>Date</Th>
        <Th>Amount</Th>
        <Th>Status</Th>
        <Th textAlign="right">Receipt</Th>
      </Tr>
    </Thead>
    <Tbody>
      {history.map(
        ({ date, amount, status, url, currency }, index) =>
          (amount > 0 && (
            <Tr key={index}>
              <Td>{date && formattedDate(date)}</Td>
              <Td>
                <FormattedNumber
                  value={amount && amount / 100}
                  style="currency"
                  currency={currency}
                  minimumFractionDigits={0}
                />{' '}
              </Td>
              <Td>
                {!status || (
                  <Text color={STATUS_COLOR[status]}>
                    <FormattedMessage
                      id={`organisations.invoices.status.${status}`}
                    />
                  </Text>
                )}
              </Td>
              <Td textAlign="right">
                {!url || (
                  <TextLink href={url}>
                    <DownloadIcon mr={2} />
                    Download
                  </TextLink>
                )}
              </Td>
            </Tr>
          )) ||
          null
      )}
    </Tbody>
  </Table>
)

const History = ({ slug, subscription, loading, invoices }) => {
  const { status } = subscription || {}
  const history =
    invoices &&
    invoices.edges &&
    invoices.edges
      .map(edge => edge.node)
      .filter(({ amount }) => parseInt(amount, 10))

  return (
    <Section data-qa="invoiceHistory">
      <Lockup id="organisations.invoices" />
      {(loading && <LoadingLine />) ||
        (history && history.length && <Invoices history={history} />) || (
          <Text>
            <FormattedMessage
              id={`organisations.invoices.no_history.${
                status === 'trialing' ? 'trial' : 'empty'
              }`}
            />
            {status === 'trialing' ? (
              <>
                {' '}
                <TextLink to={`/organisations/${slug}/billing/plan`}>
                  choose a plan
                </TextLink>
                .
              </>
            ) : null}
          </Text>
        )}
    </Section>
  )
}

export default History
