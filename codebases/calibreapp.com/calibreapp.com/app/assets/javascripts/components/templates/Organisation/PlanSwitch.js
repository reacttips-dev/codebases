import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import { Strong } from '../../Type'

const PlanSwitch = ({
  plan,
  testPack,
  selectedPlan,
  selectedTestPack,
  selectedUserPack
}) => {
  const { name, amount: planAmount, interval, currency = 'usd' } = selectedPlan
  const formattedPlanAmount = planAmount ? planAmount / 100 : planAmount

  if (plan.id !== selectedPlan.id)
    return (
      <>
        <FormattedMessage
          id={`organisations.plan.switch.${
            selectedPlan.amount < plan.amount ? 'downgrade' : 'upgrade'
          }`}
          values={{
            plan: (
              <FormattedMessage
                id="organisations.plan.switch.plan"
                values={{
                  name: <Strong>{name} Plan</Strong>,
                  amount: (
                    <Strong>
                      <FormattedNumber
                        value={formattedPlanAmount}
                        style="currency"
                        currency={currency}
                        minimumFractionDigits={0}
                      />{' '}
                      per {interval}
                    </Strong>
                  )
                }}
              />
            ),
            amount: (
              <Strong>
                <FormattedNumber
                  value={formattedPlanAmount}
                  style="currency"
                  currency={currency}
                  minimumFractionDigits={0}
                />{' '}
                per {interval}
              </Strong>
            )
          }}
        />
        {selectedUserPack?.quantity ? (
          <>
            {' '}
            <FormattedMessage
              id="organisations.plan.switch.userPacks"
              values={{
                users: (
                  <Strong>
                    <FormattedMessage
                      id="organisations.plan.switch.users"
                      values={{
                        count: selectedUserPack.quantity,
                        pluralize: selectedUserPack.quantity === 1 ? '' : 's'
                      }}
                    />
                  </Strong>
                ),
                amount: (
                  <Strong>
                    <FormattedNumber
                      value={selectedUserPack.amount / 100}
                      style="currency"
                      currency={currency}
                      minimumFractionDigits={0}
                    />{' '}
                    per {interval}
                  </Strong>
                )
              }}
            />
          </>
        ) : null}
        {selectedTestPack?.quantity ? (
          <>
            {selectedUserPack ? ' and ' : ' with '}
            <FormattedMessage
              id="organisations.plan.switch.testPacks"
              values={{
                packs: (
                  <Strong>
                    <FormattedMessage
                      id="organisations.plan.switch.packs"
                      values={{
                        count: selectedTestPack.quantity,
                        pluralize: selectedTestPack.quantity === 1 ? '' : 's'
                      }}
                    />
                  </Strong>
                ),
                amount: (
                  <Strong>
                    <FormattedNumber
                      value={selectedTestPack.amount / 100}
                      style="currency"
                      currency={currency}
                      minimumFractionDigits={0}
                    />{' '}
                    per {interval}
                  </Strong>
                )
              }}
            />
            .
          </>
        ) : (
          '.'
        )}
      </>
    )

  const currentTestPackQuantity = testPack?.quantity || 0

  const testPackChange =
    selectedTestPack.quantity > currentTestPackQuantity
      ? selectedTestPack.quantity - currentTestPackQuantity
      : currentTestPackQuantity - selectedTestPack.quantity

  return (
    <FormattedMessage
      id={`organisations.plan.switch.${
        selectedTestPack.quantity > currentTestPackQuantity
          ? 'addPack'
          : 'removePack'
      }`}
      values={{
        packs: (
          <Strong>
            <FormattedMessage
              id="organisations.plan.switch.packs"
              values={{
                count: testPackChange,
                pluralize: testPackChange === 1 ? '' : 's'
              }}
            />
          </Strong>
        ),
        amount: (
          <Strong>
            <FormattedNumber
              value={selectedTestPack.amount / 100}
              style="currency"
              currency={currency}
              minimumFractionDigits={0}
            />{' '}
            per {interval}
          </Strong>
        )
      }}
    />
  )
}

PlanSwitch.defaultProps = {
  plan: {},
  testPack: {},
  selectedPlan: {},
  selectedTestPack: {}
}

export default PlanSwitch
