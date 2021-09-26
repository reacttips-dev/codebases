import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Block, Section } from '../../../Layout'
import { Flex, Box } from '../../../Grid'
import Breadcrumbs from '../../../Breadcrumbs'
import { TextLink } from '../../../Type'
import { GuideButton } from '../../../Button'
import Tooltip from '../../../Tooltip'

import Confirmation from '../../ApiTokens/Confirmation'

import truncate from '../../../../utils/smart-truncate'

const TokenConfirmation = ({ apiToken, tokenName }) => {
  return (
    <>
      <Block>
        <Section>
          <Flex flexWrap={['wrap', 'nowrap']} alignItems="center">
            <Box flex={1} mb={[4, 0]}>
              <Breadcrumbs>
                <TextLink to={`/you/settings/tokens`}>
                  <FormattedMessage id="you.settings.accessTokens.heading" />
                </TextLink>
                <Tooltip label={tokenName}>
                  <div>{truncate(tokenName, 25)}</div>
                </Tooltip>
              </Breadcrumbs>
            </Box>
            <Box pr={1} width={[1, 'auto']}>
              <GuideButton href="/docs/account-and-billing/manage-api-tokens">
                <FormattedMessage id="you.settings.accessTokens.actions.guide" />
              </GuideButton>
            </Box>
          </Flex>
        </Section>

        <Confirmation
          apiToken={apiToken}
          tokenName={tokenName}
          returnToUrl={`/you/settings/tokens`}
        />
      </Block>
    </>
  )
}

export default TokenConfirmation
