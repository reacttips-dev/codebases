import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import { Strong } from '../../Type'
import { formattedDate, daysFromNow } from '../../../utils/date'

const PlanSummary = ({
  status,
  periodEndAt,
  name,
  amount,
  interval,
  currency,
  tagged,
  testPack,
  userPack
}) => {
  const formattedPeriodEndAt = periodEndAt && formattedDate(periodEndAt)
  const daysRemaining = periodEndAt && daysFromNow(periodEndAt)
  const formattedAmount =
    ((amount || 0) +
      (testPack?.quantity ? testPack.quantity * testPack.amount : 0) +
      (userPack?.quantity ? userPack.quantity + userPack.amount : 0)) /
    100

  if (tagged.includes('enterprise'))
    return (
      <>
        <FormattedMessage
          id="organisations.plan.summary.enterprise"
          values={{
            name: (
              <>
                a custom <Strong>Enterprise Plan</Strong>
              </>
            )
          }}
        />
      </>
    )

  if (tagged.includes('company'))
    return (
      <>
        <FormattedMessage
          id="organisations.plan.summary.company"
          values={{
            name: (
              <>
                a <Strong>Company Plan</Strong>
              </>
            )
          }}
        />
      </>
    )

  if (status === 'trialing')
    return (
      <FormattedMessage
        id="organisations.plan.summary.trialing"
        values={{
          name: <Strong>Trial</Strong>,
          daysRemaining: <Strong>{daysRemaining}</Strong>,
          periodEndAt: formattedPeriodEndAt ? (
            <>
              {' on '}
              <Strong>{formattedPeriodEndAt}</Strong>
            </>
          ) : null
        }}
      />
    )

  if (status === 'active')
    return (
      <>
        <FormattedMessage
          id="organisations.plan.summary.active"
          values={{
            name: <Strong>{name} Plan</Strong>
          }}
        />{' '}
        {testPack?.quantity || userPack?.quantity ? (
          <FormattedMessage id="organisations.plan.summary.packs" />
        ) : (
          <>
            It&rsquo;s{' '}
            <Strong>
              <FormattedNumber
                value={formattedAmount}
                style="currency"
                currency={currency}
                minimumFractionDigits={0}
              />{' '}
              per {interval}
            </Strong>
          </>
        )}
        {userPack?.quantity || testPack?.quantity ? (
          <>
            {userPack?.quantity ? (
              <>
                {' '}
                <FormattedMessage
                  id="organisations.plan.summary.userPacks"
                  values={{
                    count: userPack.quantity,
                    pluralize: userPack.quantity === 1 ? '' : 's'
                  }}
                />
                {testPack?.quantity ? ' and ' : null}
              </>
            ) : null}
            {testPack?.quantity ? (
              <>
                {' '}
                <FormattedMessage
                  id="organisations.plan.summary.testPacks"
                  values={{
                    count: testPack.quantity,
                    pluralize: testPack.quantity === 1 ? '' : 's'
                  }}
                />
              </>
            ) : null}
            <>
              , it&rsquo;s{' '}
              <Strong>
                <FormattedNumber
                  value={formattedAmount}
                  style="currency"
                  currency={currency}
                  minimumFractionDigits={0}
                />{' '}
                per {interval}
              </Strong>
              .
            </>
          </>
        ) : (
          '.'
        )}
      </>
    )

  return null
}

PlanSummary.defaultProps = {
  name: 'Custom',
  amount: 0,
  interval: 'month',
  currency: 'usd',
  periodEndAt: null,
  testPack: {},
  tagged: ''
}

export default PlanSummary
