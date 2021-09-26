import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { variant } from 'styled-system'

import { Lockup, Row, Col } from '../../../../Layout'
import { Box } from '../../../../Grid'
import { Heading } from '../../../../Type'

import { useSession } from '../../../../../providers/SessionProvider'

import SetPassword from './SetPassword'
import ChangePassword from './ChangePassword'
import GoogleAuth from './GoogleAuth'

const AuthMethodWrapper = styled(Box)(
  {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 3
  },
  variant({
    variants: {
      collapsed: {
        p: 0,
        borderStyle: 'none'
      },
      inactive: { padding: 4, borderColor: 'grey100' },
      active: {
        bg: 'grey50',
        borderColor: 'grey100',
        padding: 4
      }
    }
  })
)

const Authentication = () => {
  const { currentUser } = useSession()

  const isPassword = currentUser.authMethod == 'password'
  const isGoogle = currentUser.authMethod == 'google'

  return (
    <>
      <Lockup id="you.settings.profile.authentication" mb={0} />

      <Row>
        <Col span={2}>
          <AuthMethodWrapper
            mb={4}
            variant={isPassword ? 'active' : 'inactive'}
          >
            {isPassword ? <ChangePassword /> : <SetPassword />}
          </AuthMethodWrapper>

          <Box mb={4}>
            <Heading level="xs">
              <FormattedMessage id="you.settings.profile.authentication.thirdPartyAuth.title" />
            </Heading>
          </Box>

          <AuthMethodWrapper variant={isGoogle ? 'active' : 'collapsed'}>
            <GoogleAuth isInUse={isGoogle} email={currentUser.email} />
          </AuthMethodWrapper>
        </Col>
      </Row>
    </>
  )
}

export default Authentication
