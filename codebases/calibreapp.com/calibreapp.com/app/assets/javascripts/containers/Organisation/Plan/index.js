import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { injectIntl } from 'react-intl'

import {
  List as PlansQuery,
  UpdatePlan as CheckoutMutation,
  ValidatePlan as ValidatePlanMutation
} from '../../../queries/PlanQueries.gql'
import Header from '../../../components/templates/Organisation/Plan/Header'
import Cart from '../../../components/templates/Organisation/Plan/Cart'
import Checkout from '../../../components/templates/Organisation/Plan/Checkout'
import Stripe from '../../Stripe'
import safeError from '../../../utils/safeError'
import useFeedback from '../../../hooks/useFeedback'
import PageTitle from '../../../components/PageTitle'
import { LoadingPage } from '../../../components/Loading'

const Organisation = injectIntl(
  ({
    history,
    match: {
      params: { orgId }
    },
    intl
  }) => {
    const { setFeedback } = useFeedback()
    const [planDetails, setPlanDetails] = useState({ interval: 'month' })
    const [checkoutPlan, setCheckoutPlan] = useState(null)
    const [planFeedback, setPlanFeedback] = useState({})

    const variables = { organisation: orgId }
    const { data, loading } = useQuery(PlansQuery, { variables })

    const { organisation } = data || {}
    const { subscription, name } = organisation || {}
    const { plan, testPack, status, userPack } = subscription || {}

    useEffect(() => {
      setPlanDetails({
        ...planDetails,
        plan,
        currentPlan: plan || {},
        testPack,
        currentTestPack: testPack || {},
        currentUserPack: userPack,
        userPack,
        interval: (plan && plan.interval) || planDetails.interval,
        status
      })
    }, [loading])

    const handleOnBack = () => {
      checkoutPlan
        ? setCheckoutPlan(null)
        : history.push(`/organisations/${orgId}/billing`)
    }

    const [updatePlan, { loading: saving }] = useMutation(CheckoutMutation, {
      onCompleted: ({
        updateBilling: {
          billingInfo: { email }
        }
      }) => {
        setFeedback({
          location: 'billing',
          type: 'success',
          message: intl.formatMessage(
            {
              id: `organisations.plan.checkout.success`
            },
            {
              email: email
            }
          )
        })
        history.push(`/organisations/${orgId}/billing`)
      },
      onError: error => {
        setPlanFeedback({ type: 'error', message: safeError(error) })
      }
    })

    const [validatePlan, { loading: loadingValidation }] = useMutation(
      ValidatePlanMutation,
      {
        onCompleted: ({ validatePlan }) => {
          setCheckoutPlan(validatePlan)
          window.scrollTo(0, 0)
        },
        onError: error => {
          setPlanFeedback({ type: 'error', message: safeError(error) })
        }
      }
    )

    const handleCheckout = ({ plan, testPack, billingInfo }) => {
      updatePlan({
        variables: {
          ...variables,
          plan: plan.id,
          testPack: {
            plan: testPack.id,
            quantity: testPack.quantity
          },
          billingInfo
        }
      })
    }

    const handleContinue = ({ plan, testPack, interval, userPack }) => {
      const details = { ...planDetails, plan, testPack, interval, userPack }
      setPlanDetails(details)
      validatePlan({
        variables: {
          ...variables,
          plan: plan.id,
          testPack: {
            plan: testPack.id,
            quantity: testPack.quantity
          },
          userPack: {
            plan: userPack.id,
            quantity: userPack.quantity
          }
        }
      })
    }

    return (
      <>
        <PageTitle id="organisations.plan.title" breadcrumbs={[name]} />
        <Header
          path={checkoutPlan ? 'checkout' : 'cart'}
          onBack={handleOnBack}
        />
        {checkoutPlan ? (
          <Stripe>
            <Checkout
              {...data}
              invoice={checkoutPlan}
              feedback={planFeedback}
              onDismiss={() => setPlanFeedback({})}
              planDetails={planDetails}
              onUpdate={handleCheckout}
              saving={saving}
            />
          </Stripe>
        ) : !planDetails.plan ? (
          <LoadingPage />
        ) : (
          <Cart
            {...data}
            planDetails={planDetails}
            onContinue={handleContinue}
            saving={loadingValidation}
            feedback={planFeedback}
            onDismiss={() => setPlanFeedback({})}
          />
        )}
      </>
    )
  }
)

export default Organisation
