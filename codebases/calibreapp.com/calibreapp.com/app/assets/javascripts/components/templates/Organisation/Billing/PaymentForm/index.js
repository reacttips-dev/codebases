import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import Button from '../../../../Button'
import { Heading } from '../../../../Type'
import { Flex, Box } from '../../../../Grid'
import { FieldSet } from '../../../../Forms'
import { Row, Col } from '../../../../Layout'
import { LoadingButton } from '../../../../Loading'

import Address from './Address'
import CityState from './CityState'
import PostcodeCountry from './PostcodeCountry'
import Card from './Card'
import Email from './Email'
import Company from './Company'
import Name from './Name'
import TaxRegion from './TaxRegion'
import TaxId from './TaxId'

const PaymentForm = ({
  action,
  onUpdate,
  onCancel,
  loading,
  saving,
  address,
  city,
  state,
  country,
  postcode,
  taxId,
  taxIdType,
  email,
  company,
  name,
  fields
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [billingDetails, setBillingDetails] = useState({
    company: company || '',
    name: name || '',
    email: email || '',
    taxId: taxId || (fields.includes('tax') ? '' : null),
    taxIdType: taxIdType || (fields.includes('tax') ? '' : null),
    address: address || '',
    city: city || '',
    state: state || '',
    postcode: postcode || '',
    country: country || ''
  })

  const handleSubmit = event => {
    event.preventDefault()
    const card = elements.getElement(CardElement)
    const data = {
      name: billingDetails.name,
      address_line1: billingDetails.address,
      address_city: billingDetails.city,
      address_state: billingDetails.state,
      address_zip: billingDetails.postcode,
      address_country: billingDetails.country
    }
    stripe.createToken(card, data).then(({ token, error }) => {
      if (error) {
        setCardError(error)
        return
      }

      const {
        company,
        email,
        taxId,
        taxIdType,
        //eslint-disable-next-line no-unused-vars
        name,
        ...updatedBillingDetails
      } = billingDetails

      if (fields.includes('company')) {
        updatedBillingDetails.company = company
        updatedBillingDetails.email = email
      }
      if (fields.includes('tax')) {
        updatedBillingDetails.taxId = taxId
        updatedBillingDetails.taxIdType = taxIdType
      }

      onUpdate({ stripeCardToken: token.id, ...updatedBillingDetails })
    })
  }

  const handleChangeCard = event => {
    setCardError(event.error)
    setCardComplete(event.complete)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Row mb={3}>
          <Col span={2} p={4} variant="contained">
            <Box mb={3}>
              <Heading as="h2" level="sm">
                <FormattedMessage id="organisations.payment.new.title" />
              </Heading>
            </Box>

            <FieldSet gridTemplateColumns={['1fr', '1fr', '1fr 1fr']} mb={0}>
              <Box>
                {!fields.includes('company') || (
                  <Company
                    value={billingDetails.company}
                    onChange={company => {
                      setBillingDetails({ ...billingDetails, company })
                    }}
                    loading={loading}
                  />
                )}
                <Name
                  value={billingDetails.name}
                  onChange={name => {
                    setBillingDetails({ ...billingDetails, name })
                  }}
                  loading={loading}
                />
                {!fields.includes('company') || (
                  <Email
                    value={billingDetails.email}
                    onChange={email => {
                      setBillingDetails({ ...billingDetails, email })
                    }}
                    loading={loading}
                  />
                )}
                <Address
                  loading={loading}
                  onUpdate={props =>
                    setBillingDetails({ ...billingDetails, ...props })
                  }
                  {...billingDetails}
                />
                {(!fields.includes('company') && (
                  <CityState
                    loading={loading}
                    onUpdate={props =>
                      setBillingDetails({ ...billingDetails, ...props })
                    }
                    {...billingDetails}
                  />
                )) ||
                  null}
              </Box>

              <Box>
                {(fields.includes('company') && (
                  <CityState
                    loading={loading}
                    onUpdate={props =>
                      setBillingDetails({ ...billingDetails, ...props })
                    }
                    {...billingDetails}
                  />
                )) ||
                  null}
                <PostcodeCountry
                  loading={loading}
                  onUpdate={props =>
                    setBillingDetails({ ...billingDetails, ...props })
                  }
                  {...billingDetails}
                />
                {!fields.includes('tax') || (
                  <Flex>
                    <Box width={1 / 2} mr={1}>
                      <TaxRegion
                        value={billingDetails.taxIdType}
                        onChange={taxIdType => {
                          setBillingDetails({ ...billingDetails, taxIdType })
                        }}
                        loading={loading}
                      />
                    </Box>
                    <Box width={1 / 2} ml={1}>
                      <TaxId
                        value={billingDetails.taxId}
                        onChange={taxId => {
                          setBillingDetails({ ...billingDetails, taxId })
                        }}
                        loading={loading}
                      />
                    </Box>
                  </Flex>
                )}
                <Card
                  loading={!stripe}
                  onChange={handleChangeCard}
                  error={cardError}
                />
              </Box>
            </FieldSet>
          </Col>
        </Row>

        {stripe ? (
          <Flex flexWrap={['wrap', 'nowrap']}>
            {!onCancel || (
              <Box mr={2} width={[1, 'auto']} order={[2, 0]} mt={[2, 0]}>
                <Button onClick={onCancel} variant="tertiary">
                  <FormattedMessage id="organisations.payment.actions.cancel" />
                </Button>
              </Box>
            )}
            <Box>
              <Button
                data-qa="submitPayment"
                variant="primary"
                type="submit"
                disabled={saving || !cardComplete}
                loading={saving}
              >
                {action}
              </Button>
            </Box>
          </Flex>
        ) : (
          <LoadingButton />
        )}
      </form>
    </Box>
  )
}

PaymentForm.defaultProps = {
  fields: []
}

export default PaymentForm
