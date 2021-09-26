import React from 'react'
import { CardElement } from '@stripe/react-stripe-js'

import { Text, TextLink } from '../../../../Type'
import { FieldGroup, Input } from '../../../../Forms'
import { PadlockIcon } from '../../../../Icon'
import theme from '../../../../../theme'

const CardField = ({ onChange }) => {
  const options = {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: theme.colors.grey200,
        color: theme.colors.grey400,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883'
        },
        '::placeholder': {
          color: theme.colors.grey300
        }
      },
      invalid: {
        iconColor: theme.colors.red300,
        color: theme.colors.red300
      }
    }
  }

  return <CardElement options={options} onChange={onChange} />
}

const Card = ({ error, loading, onChange }) => {
  return (
    <>
      <FieldGroup label="Card" mb={2} error={error && error.message}>
        <Input
          as="div"
          inputStyle={(error && 'error') || 'base'}
          loading={loading}
        >
          <CardField onChange={onChange} />
        </Input>
      </FieldGroup>
      <Text level="xs">
        <PadlockIcon mr="5px" />
        All payments are securely handled by{' '}
        <TextLink href="https://stripe.com">Stripe</TextLink>.
      </Text>
    </>
  )
}

export default Card
