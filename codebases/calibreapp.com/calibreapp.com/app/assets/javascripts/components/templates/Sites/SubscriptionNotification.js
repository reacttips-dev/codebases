import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns'

import FeedbackBlock from '../../FeedbackBlock'
import { Strong } from '../../Type'

const SubscriptionNotification = ({ status, orgId, trialEndAt, isAdmin }) => {
  const planPath = `/organisations/${orgId}/billing/plan`

  if (status === 'trialing')
    return (
      <FeedbackBlock type="warning" mb={4}>
        You’re currently on a free Trial with{' '}
        <Strong color="inherit">
          {formatDistanceToNow(parseISO(trialEndAt))}
        </Strong>{' '}
        left.
        {isAdmin ? (
          <>
            {' '}
            <Link to={planPath}>Choose a plan now</Link>.
          </>
        ) : null}
      </FeedbackBlock>
    )

  if (status == 'trial_expired' || status === 'trial_canceled')
    return (
      <FeedbackBlock type="warning" mb={4}>
        Your trial has ended.{' '}
        {isAdmin ? (
          <>
            <Link to={planPath}>Choose a plan</Link> to continue monitoring your
            Sites.
          </>
        ) : (
          <>Contact a team admin to choose a plan.</>
        )}
      </FeedbackBlock>
    )

  if (status === 'past_due')
    return (
      <FeedbackBlock type="warning" mb={4}>
        <Strong color="inherit">We couldn’t process your payment.</Strong>{' '}
        {isAdmin ? (
          <>
            <Link to={`/organisations/${orgId}/billing/payment`}>
              Update your payment details
            </Link>{' '}
            to avoid disruptions in monitoring.
          </>
        ) : (
          <>Contact a team admin to update the billing method.</>
        )}
      </FeedbackBlock>
    )

  if (status === 'canceled')
    return (
      <FeedbackBlock type="warning" mb={4}>
        Your plan has been cancelled.{' '}
        {isAdmin ? (
          <>
            <Link to={planPath}>Choose a plan</Link> to continue monitoring your
            Sites.
          </>
        ) : (
          <>Contact a team admin to choose a plan.</>
        )}
      </FeedbackBlock>
    )

  return null
}

export default SubscriptionNotification
