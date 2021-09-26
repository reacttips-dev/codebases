import React, { useState } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import { Block, Section, Row, Col } from '../../../Layout'
import { LoadingLine } from '../../../Loading'
import Table, { Tr, Td, Tbody } from '../../../Table'
import { Text, Heading, Strong } from '../../../Type'
import Button from '../../../Button'
import Feedback from '../../Feedback'

import PlanSwitch from '../PlanSwitch'
import PaymentMethod from '../../../PaymentMethod'
import Form from '../Billing/PaymentForm'

const Checkout = ({
  invoice,
  feedback,
  loading,
  planDetails,
  organisation,
  onUpdate,
  onDismiss,
  saving
}) => {
  const { subscription, billingInfo } = organisation || {}
  const { customer, plan, testPack, userPack: currentUserPack } =
    subscription || {}
  const { card } = customer || {}
  const {
    currentPlan = {},
    plan: selectedPlan = {},
    testPack: selectedTestPack = {},
    userPack: selectedUserPack = {}
  } = planDetails
  const [updateCard, setUpdateCard] = useState(false)

  const handleUpdate = billingInfo => {
    onUpdate({
      plan: selectedPlan,
      testPack: selectedTestPack,
      billingInfo
    })
  }

  const showCardForm = !organisation ? false : card ? updateCard : true

  const subscriptionAmount =
    (selectedPlan.amount || 0) +
    (selectedTestPack?.amount || 0) * (selectedTestPack?.quantity || 0) +
    (selectedUserPack?.amount || 0) * (selectedUserPack?.quantity || 0)

  return (
    <Block data-qa="planCheckout">
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
        <Row mb={4}>
          <Col span={2}>
            {loading ? (
              <LoadingLine />
            ) : (
              <>
                <PlanSwitch
                  status="switching"
                  plan={plan}
                  selectedPlan={selectedPlan}
                  selectedTestPack={selectedTestPack}
                  selectedUserPack={selectedUserPack}
                  testPack={testPack}
                  userPack={currentUserPack}
                />
                {(invoice.amount < 0 && (
                  <Text as="p" mt={3} mb={0}>
                    <FormattedMessage
                      id="organisations.plan.checkout.credit"
                      values={{
                        credit: (
                          <Strong>
                            <FormattedNumber
                              value={Math.abs(invoice.amount) / 100}
                              style="currency"
                              currency={invoice.currency}
                              minimumFractionDigits={2}
                            />
                          </Strong>
                        ),
                        amount: (
                          <Strong>
                            <FormattedNumber
                              value={subscriptionAmount / 100}
                              style="currency"
                              currency={invoice.currency}
                              minimumFractionDigits={0}
                            />{' '}
                            per {selectedPlan.interval}
                          </Strong>
                        )
                      }}
                    />
                  </Text>
                )) ||
                  null}
              </>
            )}
          </Col>
        </Row>

        <Row>
          <Col span={2}>
            <Table bleed={0}>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colspan={2} borderTopWidth={0}>
                      <LoadingLine />
                    </Td>
                  </Tr>
                ) : (
                  invoice.lines
                    .filter(({ quantity }) => quantity > 0)
                    .map(
                      (
                        {
                          plan,
                          testPack,
                          userPack,
                          amount,
                          currency,
                          description,
                          quantity
                        },
                        index
                      ) => (
                        <Tr key={index}>
                          <Td width="100%" borderTopWidth={index ? 1 : 0}>
                            <Text>
                              {plan?.name || testPack?.name || userPack?.name}
                              {plan && ' Plan'}
                              {(testPack || userPack) && ` x ${quantity}`}
                            </Text>
                            {(plan &&
                              plan.id === selectedPlan.id &&
                              amount > 0) ||
                            (testPack &&
                              testPack.id === selectedTestPack.id &&
                              quantity === selectedTestPack.quantity) ||
                            (userPack &&
                              (!currentUserPack?.id ||
                                userPack.id === currentUserPack?.id) &&
                              amount > 0) ? null : (
                              <>
                                {' '}
                                <Text level="xs">( {description} )</Text>
                              </>
                            )}
                          </Td>
                          <Td borderTopWidth={index ? 1 : 0} textAlign="right">
                            <Text>
                              <FormattedNumber
                                value={amount / 100}
                                style="currency"
                                currency={currency}
                                minimumFractionDigits={2}
                              />
                            </Text>
                          </Td>
                        </Tr>
                      )
                    )
                )}
                {loading ? (
                  <Tr>
                    <Td colspan={2}>
                      <LoadingLine />
                    </Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td>
                      <Text>
                        <FormattedMessage id="organisations.plan.checkout.tax" />
                      </Text>
                    </Td>
                    <Td textAlign="right">
                      <Text>$0.00</Text>
                    </Td>
                  </Tr>
                )}
                {loading ? (
                  <Tr>
                    <Td colspan={2}>
                      <LoadingLine />
                    </Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td>
                      <Strong>
                        <FormattedMessage id="organisations.plan.checkout.total" />
                      </Strong>
                    </Td>
                    <Td textAlign="right">
                      <Strong>
                        {invoice.amount < 0 ? (
                          '$0'
                        ) : (
                          <FormattedNumber
                            value={invoice.amount / 100}
                            style="currency"
                            currency={invoice.currency}
                            minimumFractionDigits={0}
                          />
                        )}
                      </Strong>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Col>
        </Row>

        <Row mt={5}>
          <Col span={2}>
            <Heading as="h2" level="sm">
              <FormattedMessage id="organisations.plan.payment.title" />
            </Heading>
          </Col>
        </Row>

        {loading ? (
          <Row my={4}>
            <Col span={2}>
              <LoadingLine height={64} width="100%" />
            </Col>
          </Row>
        ) : (
          <>
            {showCardForm ? (
              <FormattedMessage
                id={`organisations.plan.actions.${
                  currentPlan.id === 'trial' ? 'start' : 'update'
                }`}
              >
                {action => (
                  <Form
                    onUpdate={handleUpdate}
                    loading={loading}
                    saving={saving}
                    action={action}
                    fields={['company', 'tax']}
                    onCancel={card ? () => setUpdateCard(false) : null}
                    {...(billingInfo || {})}
                  />
                )}
              </FormattedMessage>
            ) : (
              <>
                <Row mb={4}>
                  <Col span={2}>
                    <PaymentMethod
                      onUpdate={() => setUpdateCard(true)}
                      {...billingInfo}
                      {...card}
                    />
                  </Col>
                </Row>
                {loading ? null : (
                  <Button
                    data-qa={`startPlan`}
                    variant="primary"
                    type="submit"
                    disabled={saving}
                    onClick={() => handleUpdate({})}
                    loading={saving}
                  >
                    <FormattedMessage
                      id={`organisations.plan.actions.${
                        currentPlan.id === 'trial' ? 'start' : 'update'
                      }`}
                    />
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </Section>
    </Block>
  )
}

export default Checkout
