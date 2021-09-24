import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Block, Banner } from '../../../Layout'
import { Box } from '../../../Grid'
import Breadcrumbs from '../../../Breadcrumbs'
import { TextLink } from '../../../Type'
import { GuideButton } from '../../../Button'
import Form from '../../ApiTokens/Form'

const Manage = ({ action, ...props }) => {
  return (
    <Block>
      <Banner>
        <Box flex={1} mb={[4, 0]}>
          <Breadcrumbs>
            <TextLink to={`/you/settings/tokens`}>
              <FormattedMessage id="you.settings.accessTokens.title" />
            </TextLink>
            <FormattedMessage
              id={`you.settings.accessTokens.${action}.title`}
            />
          </Breadcrumbs>
        </Box>
        <Box pr={1} width={[1, 'auto']}>
          <GuideButton href="/docs/account-and-billing/manage-api-tokens">
            <FormattedMessage id="you.settings.accessTokens.actions.guide" />
          </GuideButton>
        </Box>
      </Banner>
      <Form
        {...props}
        submitButtonText={`you.settings.accessTokens.actions.${action}`}
      />
    </Block>
  )
}

export default Manage
