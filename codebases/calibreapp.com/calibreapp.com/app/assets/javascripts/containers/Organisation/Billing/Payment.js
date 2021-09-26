import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'

import {
  Payment as PaymentQuery,
  UpdateBilling as UpdateBillingMutation
} from '../../../queries/BillingQueries.gql'
import safeError from '../../../utils/safeError'

import Stripe from '../../Stripe'
import { Block, Section, Row, Col, Lockup } from '../../../components/Layout'
import { LoadingLine } from '../../../components/Loading'
import PaymentMethod from '../../../components/PaymentMethod'
import Feedback from '../../../components/templates/Feedback'
import Form from '../../../components/templates/Organisation/Billing/PaymentForm'
import PageTitle from '../../../components/PageTitle'

const Payment = ({
  match: {
    params: { orgId }
  }
}) => {
  const variables = { organisation: orgId }
  const [feedback, setFeedback] = useState({})
  const [updateCard, setUpdateCard] = useState(false)
  const { data, loading } = useQuery(PaymentQuery, { variables })

  const [updateBilling, { loading: saving }] = useMutation(
    UpdateBillingMutation,
    {
      onCompleted: () => {
        setUpdateCard(false)
        setFeedback({
          type: 'success',
          message: 'Your card has been updated.'
        })
      },
      onError: error => {
        setFeedback({ type: 'error', message: safeError(error) })
      }
    }
  )
  const handleUpdate = billingInfo => {
    updateBilling({
      variables: {
        ...variables,
        billingInfo
      }
    })
  }

  const handleCancel = () => setUpdateCard(false)

  const handleDismiss = () => setFeedback({})

  const { organisation } = data || {}
  const { name: organisationName, subscription, billingInfo } =
    organisation || {}
  const { customer } = subscription || {}
  const { card } = customer || {}

  const showCardForm = !organisation ? false : card ? updateCard : true

  return (
    <Stripe>
      <PageTitle
        id="organisations.payment.title"
        breadcrumbs={[organisationName]}
      />
      <Block>
        <Section>
          {(feedback.type && (
            <Feedback
              p={0}
              pb={4}
              duration={0}
              onDismiss={handleDismiss}
              {...feedback}
            />
          )) ||
            null}

          {loading ? (
            <>
              <LoadingLine mb={2} />
            </>
          ) : (
            <Lockup id={`organisations.payment.${card ? 'existing' : 'add'}`} />
          )}

          {(loading && (
            <Row>
              <Col span={2}>
                <LoadingLine height={64} width="100%" />
              </Col>
            </Row>
          )) ||
            (showCardForm ? (
              <FormattedMessage id="organisations.payment.actions.save">
                {action => (
                  <Form
                    onCancel={card ? handleCancel : null}
                    onUpdate={handleUpdate}
                    loading={loading}
                    saving={saving}
                    action={action}
                    {...(billingInfo || {})}
                  />
                )}
              </FormattedMessage>
            ) : (
              <Row>
                <Col span={2}>
                  <PaymentMethod
                    onUpdate={() => setUpdateCard(true)}
                    {...billingInfo}
                    {...card}
                  />
                </Col>
              </Row>
            ))}
        </Section>
      </Block>
    </Stripe>
  )
}

export default Payment
