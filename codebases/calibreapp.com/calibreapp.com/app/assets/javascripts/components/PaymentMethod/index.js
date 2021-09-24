import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import countryList from 'country-list'

import { CreditCardIcon } from '../Icon'
import { Section } from '../Layout'
import { Flex, Box } from '../Grid'
import { Text, Strong } from '../Type'
import Button from '../Button'

const CardSection = styled(Section)``
CardSection.defaultProps = {
  p: undefined,
  py: 2
}

const PaymentMethod = ({
  brand,
  expiry,
  last4,
  name,
  address,
  city,
  state,
  postcode,
  country,
  onUpdate
}) => (
  <Box variant="contained" px={4} py={3}>
    <CardSection>
      <Flex flexWrap={['wrap', 'nowrap']}>
        <Box flex={1} width={[1, 'auto']}>
          <Strong>
            <FormattedMessage id="organisations.payment.card" />
          </Strong>
        </Box>
        <Box textAlign={['left', 'right']} width={[1, 'auto']}>
          <Flex alignItems="center">
            <Box mr={2}>
              <CreditCardIcon type={brand} />
            </Box>
            <Box flex={1}>
              <Text>
                {brand} ending in {last4} (Expiring {expiry})
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </CardSection>

    <CardSection>
      <Flex flexWrap={['wrap', 'nowrap']}>
        <Box flex={1} width={[1, 'auto']}>
          <Strong>
            <FormattedMessage id="organisations.payment.name" />
          </Strong>
        </Box>
        <Box textAlign={['left', 'right']} width={[1, 'auto']}>
          {name ? name : <Text color="grey300">Name not provided</Text>}
        </Box>
      </Flex>
    </CardSection>

    <CardSection>
      <Flex flexWrap={['wrap', 'nowrap']}>
        <Box flex={1} width={[1, 'auto']}>
          <Strong>
            <FormattedMessage id="organisations.payment.address" />
          </Strong>
        </Box>
        <Box textAlign={['left', 'right']} width={[1, 'auto']}>
          {address ? (
            <Text>
              {address}
              <br />
              {city} {state}
              {postcode ? `, ${postcode}` : null}
              <br />
              {country ? countryList.getName(country) : null}
            </Text>
          ) : (
            <Text color="grey300">Address not provided</Text>
          )}
        </Box>
      </Flex>

      <Box mt={4}>
        <Button variant="tertiary" onClick={onUpdate}>
          <FormattedMessage id="organisations.payment.actions.update" />
        </Button>
      </Box>
    </CardSection>
  </Box>
)

export default PaymentMethod
