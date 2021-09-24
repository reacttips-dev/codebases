import React from 'react'
import { FormattedMessage } from 'react-intl'

import Breadcrumbs from '../../../Breadcrumbs'
import { Section } from '../../../Layout'
import { Flex, Box } from '../../../Grid'
import { TextLink } from '../../../Type'

const Header = ({ path, onBack }) => {
  return (
    <>
      <Section>
        <Flex flexWrap={['wrap', 'nowrap']} alignItems="center">
          <Box flex={1} mb={[4, 0]}>
            <Breadcrumbs>
              <FormattedMessage id={`organisations.plan.${path}.title`} />
            </Breadcrumbs>
          </Box>
          <Box pr={1} width={[1, 'auto']}>
            <TextLink onClick={onBack}>
              <FormattedMessage id={`organisations.plan.${path}.back`} />
            </TextLink>
          </Box>
        </Flex>
      </Section>
    </>
  )
}

export default Header
