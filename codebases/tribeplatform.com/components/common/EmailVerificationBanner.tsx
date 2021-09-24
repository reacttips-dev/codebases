import React from 'react'

import { Alert, AlertIcon, AlertProps, Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useAuthMember from 'hooks/useAuthMember'

import { isAdminEmailNotConfirmed } from 'utils/auth'

export const EMAIL_VERIFICATION_BANNER_HEIGHT = 48
const EMAIL_VERIFICATION_BANNER_ID = 'email-verification-banner'

interface EmailVerificationBannerProps extends AlertProps {
  isCentered?: boolean
}

export const EmailVerificationBanner = ({
  isCentered,
  ...rest
}: EmailVerificationBannerProps) => {
  const { authUser } = useAuthMember()

  if (!isAdminEmailNotConfirmed(authUser)) {
    return null
  }

  return (
    <Alert
      status="info"
      justifyContent={isCentered ? 'center' : 'flex-start'}
      borderRadius={isCentered ? 'sm' : 0}
      mb={isCentered ? 1 : 0}
      bgColor="info.base"
      id={EMAIL_VERIFICATION_BANNER_ID}
      {...rest}
    >
      {!isCentered && <AlertIcon color="info.strong" />}
      <Text textStyle="regular/medium">
        <Trans
          i18nKey="member:admin.email_confirmation_message"
          defaults="Please <0>confirm your email address</0> to invite members."
        >
          <Link
            color="info.strong"
            fontSize="md"
            href={`/auth/verify?memberId=${authUser?.id}`}
          />
        </Trans>
      </Text>
    </Alert>
  )
}
