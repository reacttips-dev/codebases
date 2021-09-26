import React from 'react'
import styled from 'styled-components'

import { Box } from '../Grid'

import Visa from './Visa'
import Mastercard from './Mastercard'
import Amex from './Amex'
import Diners from './Diners'
import Discover from './Discover'
import JCB from './JCB'
import UnionPay from './UnionPay'

const Wrapper = styled(Box)`
  svg {
    width: auto;
    height: 100%;
  }
`

export const CARD_TYPES = {
  AMERICAN_EXPRESS: 'American Express',
  DINERS_CLUB: 'Diners Club',
  DISCOVER: 'Discover',
  JCB: 'JCB',
  UNIONPAY: 'UnionPay',
  MASTERCARD: 'MasterCard',
  VISA: 'Visa',
  UNKNOWN: 'Unknown'
}

const CreditCard = ({ type, ...props }) => {
  const Icon = type => {
    switch (type) {
      case CARD_TYPES.VISA:
        return Visa
      case CARD_TYPES.MASTERCARD:
        return Mastercard
      case CARD_TYPES.AMERICAN_EXPRESS:
        return Amex
      case CARD_TYPES.DINERS_CLUB:
        return Diners
      case CARD_TYPES.DISCOVER:
        return Discover
      case CARD_TYPES.JCB:
        return JCB
      case CARD_TYPES.UNIONPAY:
        return UnionPay
      default:
        return null
    }
  }

  const Component = Icon(type)

  return <Wrapper {...props}>{!Component || <Component />}</Wrapper>
}

CreditCard.defaultProps = {
  borderColor: 'grey100',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '3px',
  height: 20,
  width: 32
}

export default CreditCard
