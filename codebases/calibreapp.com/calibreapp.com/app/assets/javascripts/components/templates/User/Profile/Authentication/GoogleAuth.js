import React from 'react'
import { FormattedMessage } from 'react-intl'

import Badge from '../../../../Badge'
import Button from '../../../../Button'
import { Flex, Box } from '../../../../Grid'
import { Text, Strong } from '../../../../Type'
import { GoogleIcon } from '../../../../Icon'

const ConnectGoogleAuth = () => {
  return (
    <form method="post" action="/registrations/google/authorization">
      <input
        type="hidden"
        name="proceed_to"
        value="/you/settings/profile/connect/google"
      />
      <Button type="submit" variant="outlined" icon={<GoogleIcon />}>
        <FormattedMessage id="you.settings.profile.authentication.thirdPartyAuth.google.label" />
      </Button>
    </form>
  )
}

const ActiveGoogleAuth = ({ email }) => {
  return (
    <Flex alignItems="center">
      <Box mr={3}>
        <GoogleIcon width="30" height="30" />
      </Box>
      <Box>
        <Text>
          <FormattedMessage
            id="you.settings.profile.authentication.thirdPartyAuth.google.inUse"
            values={{ email: <Strong>{email}</Strong> }}
          />
        </Text>
      </Box>
      <Box textAlign="right" flex={1}>
        <Badge type="success">
          <FormattedMessage id="you.settings.profile.authentication.currentLabel" />
        </Badge>
      </Box>
    </Flex>
  )
}

const GoogleAuth = ({ isInUse, ...props }) => {
  return isInUse ? <ActiveGoogleAuth {...props} /> : <ConnectGoogleAuth />
}

export default GoogleAuth
