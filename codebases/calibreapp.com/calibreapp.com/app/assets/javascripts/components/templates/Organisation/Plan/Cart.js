import React, { useState } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import { Block, Section, Lockup, Row, Col } from '../../../Layout'
import Button from '../../../Button'
import { Flex, Box } from '../../../Grid'
import Table, { Thead, Th, Tr, Td, Tbody } from '../../../Table'
import { Heading, Text, TextLink, Strong } from '../../../Type'
import { CheckIcon } from '../../../Icon'
import { Radio, Number } from '../../../Forms'
import Feedback from '../../Feedback'

const Cart = ({
  organisation,
  plans,
  testPacks,
  userPacks,
  onContinue,
  saving,
  planDetails: initialPlanDetails,
  onDismiss,
  feedback
}) => {
  const { eligiblePlans, membersList } = organisation || {}
  const [planDetails, setPlanDetails] = useState({
    ...initialPlanDetails,
    testPack:
      initialPlanDetails.testPack ||
      (testPacks || []).find(
        ({ interval }) => interval === initialPlanDetails.interval
      ) ||
      {},
    userPack:
      initialPlanDetails.userPack ||
      (userPacks || []).find(
        ({ interval }) => interval === initialPlanDetails.interval
      ) ||
      {}
  })
  const {
    currentPlan = {},
    currentTestPack = {},
    plan = {},
    userPack,
    testPack,
    status
  } = planDetails
  const { totalCount: totalUsers } = membersList || {}

  const handleSubmit = event => {
    event.preventDefault()
    onContinue(planDetails)
  }

  const handleChangeInterval = interval => {
    setPlanDetails({
      ...planDetails,
      interval
    })
  }

  const handleSelectPlan = planId => {
    const plan = plans.find(({ id }) => id === planId)

    const intervalTestPack = testPacks.find(
      ({ interval }) => interval === plan.interval
    )

    const intervalUserPack = userPacks.find(
      ({ interval }) => interval === plan.interval
    )

    setPlanDetails({
      ...planDetails,
      plan,
      testPack: {
        ...intervalTestPack,
        quantity: testPack.quantity
      },
      userPack: {
        ...intervalUserPack,
        quantity: plan.usersPerMonth
          ? Math.max(0, totalUsers - plan.usersPerMonth)
          : 0
      }
    })
  }

  const { interval: plansInterval } = planDetails

  const displayedPlans = (plans || []).filter(
    ({ interval }) => plansInterval === interval
  )

  const { features: displayedFeatures = [] } = displayedPlans.length
    ? displayedPlans[0]
    : {}

  const isSelectedPlan = id => {
    if (plan.id) return plan.id === id
    return currentPlan.id === id
  }

  const isEligible = plan => (eligiblePlans || []).find(({ id }) => plan === id)

  const gridBlock = 100 / (displayedPlans.length + 2)

  const canContinue =
    !plan.id || plan.id === 'trial'
      ? false
      : currentPlan.id != plan.id ||
        status === 'canceled' ||
        (currentTestPack.id && currentTestPack.id != testPack.id) ||
        (currentTestPack.id && currentTestPack.quantity != testPack.quantity) ||
        (!currentTestPack.quantity && testPack.quantity > 0)

  return (
    <Block>
      {!feedback.type || (
        <Feedback
          p={0}
          pt={4}
          px={4}
          duration={0}
          onDismiss={onDismiss}
          {...feedback}
        />
      )}
      <Section>
        <form onSubmit={handleSubmit}>
          <Table bleed={0}>
            <Thead>
              <Tr>
                <Th
                  py={4}
                  width={`${gridBlock * 2}%`}
                  textTransform="none"
                  verticalAlign="top"
                >
                  <Flex>
                    <Box mr={4}>
                      <Radio
                        id="month"
                        name="interval"
                        onChange={() => handleChangeInterval('month')}
                        checked={plansInterval === 'month'}
                      >
                        Monthly
                      </Radio>
                    </Box>
                    <Box>
                      <Radio
                        id="year"
                        name="interval"
                        onChange={() => handleChangeInterval('year')}
                        checked={plansInterval === 'year'}
                      >
                        Yearly
                      </Radio>
                    </Box>
                  </Flex>
                </Th>
                {displayedPlans.map(
                  ({ name, id, amount, currency, interval, tagged }) => (
                    <Th
                      py={4}
                      width={`${gridBlock}%`}
                      key={id}
                      textAlign="center"
                      backgroundColor={isSelectedPlan(id) ? 'green50' : 'white'}
                    >
                      <Heading level="xs">
                        <FormattedMessage
                          id={`plans.${id}.name`}
                          defaultMessage={name}
                        />
                      </Heading>
                      <Box my={1}>
                        <Text
                          fontSize={36}
                          fontWeight={3}
                          textTransform="none"
                          color="grey500"
                        >
                          {!amount ||
                            (tagged.includes('enterprise') ? (
                              <>
                                <FormattedNumber
                                  value={amount / 100 / 1000}
                                  style="currency"
                                  currency={currency}
                                  minimumFractionDigits={0}
                                />
                                k+
                              </>
                            ) : (
                              <FormattedNumber
                                value={amount / 100}
                                style="currency"
                                currency={currency}
                                minimumFractionDigits={0}
                              />
                            ))}
                        </Text>
                      </Box>
                      <Box>
                        <Text level="xs" textTransform="none">
                          per {interval}
                        </Text>
                      </Box>
                    </Th>
                  )
                )}
              </Tr>
            </Thead>
            <Tbody>
              {displayedFeatures
                .filter(({ hidden }) => !hidden)
                .map(({ name }, index) => (
                  <Tr key={name}>
                    <Td textAlign="left" borderTopWidth={index ? 1 : 0}>
                      <Text as="div" fontWeight={3}>
                        <FormattedMessage
                          id={`plans.features.${name}.url`}
                          defaultMessage="null"
                        >
                          {url =>
                            url[0] === 'null' ? (
                              <FormattedMessage
                                id={`plans.features.${name}.label`}
                              />
                            ) : (
                              <TextLink href={url} rel="noopener">
                                <FormattedMessage
                                  id={`plans.features.${name}.label`}
                                />
                              </TextLink>
                            )
                          }
                        </FormattedMessage>
                      </Text>
                      <FormattedMessage
                        id={`plans.features.${name}.meta`}
                        defaultMessage="null"
                      >
                        {meta =>
                          meta[0] === 'null' ? null : (
                            <Text level="xs">{meta}</Text>
                          )
                        }
                      </FormattedMessage>
                    </Td>
                    {displayedPlans.map(({ id, features }) => {
                      const { enabled, value } = features.find(
                        ({ name: featureName }) => featureName === name
                      )
                      return (
                        <Td
                          key={id}
                          textAlign="center"
                          borderTopWidth={index ? 1 : 0}
                          backgroundColor={
                            isSelectedPlan(id) ? 'green50' : 'white'
                          }
                        >
                          {enabled ? (
                            <CheckIcon
                              color="green300"
                              verticalAlign="middle"
                            />
                          ) : null}
                          {value ? (
                            <Box as="span" ml={2} verticalAlign="middle">
                              {value}
                            </Box>
                          ) : null}
                        </Td>
                      )
                    })}
                  </Tr>
                ))}
              <Tr>
                <Td />
                {displayedPlans.map(({ id, tagged, usersPerMonth }) => (
                  <Td
                    key={id}
                    textAlign="center"
                    verticalAlign="top"
                    backgroundColor={isSelectedPlan(id) ? 'green50' : 'white'}
                    py={null}
                    pt={4}
                    pb={3}
                  >
                    {tagged.match(/enterprise/) ? (
                      <>
                        <Button as="a" variant="outlined" href="/contact">
                          <FormattedMessage id="organisations.plan.actions.quote" />
                        </Button>
                        <Box mt={1}>
                          or <TextLink href="/enterprise">learn more</TextLink>.
                        </Box>
                      </>
                    ) : tagged.match(/company/) ? (
                      <>
                        <Button as="a" variant="outlined" href="/contact">
                          <FormattedMessage id="organisations.plan.actions.quote" />
                        </Button>
                        <Box mt={1}>
                          or{' '}
                          <TextLink href="/company-plan">learn more</TextLink>.
                        </Box>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          data-qa={`choosePlan${id}`}
                          onClick={() => isEligible(id) && handleSelectPlan(id)}
                          variant={isSelectedPlan(id) ? 'primary' : 'tertiary'}
                          disabled={!isEligible(id)}
                        >
                          <FormattedMessage
                            id={`organisations.plan.actions.${
                              (isSelectedPlan(id) && 'selected') ||
                              (isEligible(id) && 'select') ||
                              'unavailable'
                            }`}
                          />
                        </Button>
                        {(!isEligible(id) && (
                          <Box mt={1}>
                            <Text level="xs">
                              <FormattedMessage
                                id={`organisations.plan.unavailable.${
                                  usersPerMonth ? 'teams' : 'testProfiles'
                                }`}
                              />
                            </Text>
                          </Box>
                        )) ||
                          null}
                      </>
                    )}
                  </Td>
                ))}
              </Tr>
            </Tbody>
          </Table>

          <Box my={4}>
            <Lockup
              id={`organisations.plan.${
                plan.usersPerMonth ? 'addons' : 'test_packs'
              }.${plansInterval}`}
              values={{
                testPacks: (
                  <TextLink
                    href="/docs/account-and-billing/add-and-remove-test-packs"
                    target="_blank"
                  >
                    <FormattedMessage id="organisations.plan.addons.testPacks" />
                  </TextLink>
                ),
                users: (
                  <TextLink
                    href="/docs/account-and-billing/manage-users"
                    target="_blank"
                  >
                    <FormattedMessage id="organisations.plan.addons.users" />
                  </TextLink>
                )
              }}
            />
            <Row>
              <Col span={2}>
                <Table bleed={0}>
                  <Thead>
                    <Tr>
                      <Th width="40%">
                        <FormattedMessage id="organisations.plan.cart.item" />
                      </Th>
                      <Th width="37%">
                        <FormattedMessage id="organisations.plan.cart.amount" />
                      </Th>
                      <Th width="13%">
                        <FormattedMessage id="organisations.plan.cart.price" />
                      </Th>
                    </Tr>
                    {plan.id ? (
                      <Tr>
                        <Td>{plan.name} Plan</Td>
                        <Td>
                          {plan.usersPerMonth ? (
                            <FormattedMessage
                              id="organisations.plan.cart.capacity"
                              values={{
                                tests: (
                                  <FormattedNumber value={plan.testsPerMonth} />
                                ),
                                users: (
                                  <FormattedNumber value={plan.usersPerMonth} />
                                )
                              }}
                            />
                          ) : (
                            <FormattedNumber value={plan.testsPerMonth} />
                          )}
                        </Td>
                        <Td>
                          <FormattedNumber
                            value={plan.amount / 100}
                            style="currency"
                            currency={plan.currency}
                            minimumFractionDigits={2}
                          />
                        </Td>
                      </Tr>
                    ) : null}
                    {plan.usersPerMonth ? (
                      <Tr>
                        <Td>Additional Seats</Td>
                        <Td>
                          <FormattedNumber value={userPack.quantity} />
                        </Td>
                        <Td>
                          <FormattedNumber
                            value={userPack.quantity * (userPack.amount / 100)}
                            style="currency"
                            currency={userPack.currency}
                            minimumFractionDigits={2}
                          />
                        </Td>
                      </Tr>
                    ) : null}
                    {testPack.id ? (
                      <Tr>
                        <Td>
                          <Flex alignItems="center">
                            <Box mr={1}>Test Pack ×</Box>
                            <Box>
                              <Number
                                qa="testPackQuantity"
                                value={testPack.quantity}
                                onChange={quantity => {
                                  setPlanDetails({
                                    ...planDetails,
                                    testPack: {
                                      ...testPack,
                                      quantity: +quantity
                                    }
                                  })
                                }}
                              />
                            </Box>
                          </Flex>
                        </Td>
                        <Td>
                          <FormattedNumber
                            value={testPack.quantity * testPack.testsPerMonth}
                          />
                        </Td>
                        <Td>
                          <FormattedNumber
                            value={testPack.quantity * (testPack.amount / 100)}
                            style="currency"
                            currency={testPack.currency}
                            minimumFractionDigits={2}
                          />
                        </Td>
                      </Tr>
                    ) : null}
                    <Tr>
                      <Td>
                        <Strong>
                          <FormattedMessage id="organisations.plan.cart.total" />
                        </Strong>
                      </Td>
                      <Td>
                        <Strong>
                          {plan.usersPerMonth ? (
                            <FormattedMessage
                              id="organisations.plan.cart.capacity"
                              values={{
                                tests: (
                                  <FormattedNumber
                                    value={
                                      testPack.quantity *
                                        testPack.testsPerMonth +
                                      plan.testsPerMonth
                                    }
                                  />
                                ),
                                users: (
                                  <FormattedNumber
                                    value={
                                      plan.usersPerMonth + userPack?.quantity ||
                                      0
                                    }
                                  />
                                )
                              }}
                            />
                          ) : (
                            <FormattedNumber
                              value={
                                testPack.quantity * testPack.testsPerMonth +
                                plan.testsPerMonth
                              }
                            />
                          )}
                        </Strong>
                      </Td>
                      <Td>
                        <Strong>
                          {testPack.id ? (
                            <FormattedNumber
                              value={
                                (plan.amount +
                                  testPack.quantity * testPack.amount +
                                  userPack.quantity * userPack.amount) /
                                100
                              }
                              style="currency"
                              currency={testPack.currency}
                              minimumFractionDigits={2}
                            />
                          ) : (
                            '$0.00'
                          )}
                        </Strong>
                      </Td>
                    </Tr>
                  </Thead>
                </Table>
              </Col>
            </Row>
          </Box>

          <Button
            data-qa={`choosePlan`}
            variant="primary"
            type="submit"
            disabled={saving || !canContinue}
            loading={saving}
          >
            <FormattedMessage id="organisations.plan.actions.proceed" />
          </Button>
        </form>
      </Section>
    </Block>
  )
}

export default Cart
