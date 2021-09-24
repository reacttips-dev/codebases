import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const Stripe = ({ children }) => {
  const stripe_key = document
    .querySelector('meta[name="stripe-pk"]')
    .getAttribute('content')
  const stripePromise = loadStripe(stripe_key)

  return <Elements stripe={stripePromise}>{children}</Elements>
}

export default Stripe
