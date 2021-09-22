import * as React from 'react'
import styled from 'styled-components'
import { browserHistory } from 'react-router'
import WarningIcon from '@invisionapp/helios/icons/Warning'
import { Link, Button } from '@invisionapp/helios'
import ModalContent from '../Modal/ModalContent'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import Heading from '../modals/Heading'
import SubHeading from '../modals/SubHeading'
import Wrapper from '../modals/Wrapper'

const PreSSOModal = props => {
  const { closePortal, isVisible, onBack } = props

  return (
    <ModalContent
      closePortal={closePortal}
      closeWarning={<ModalCloseWarning />}
      isVisible={isVisible}
      onBack={onBack}
      showWarning={false}
    >
      <Wrapper centered>
        <StyledWarningIcon fill="text-lightest" />
        <Heading order="title" size="smaller" color="text-darker">
          Use SSO instead of 2FA?
        </Heading>
        <SubHeading order="subtitle">
          Your team currently uses two-factor authentication (2FA). If you turn on single
          sign-on (SSO), 2FA will be turned off.
        </SubHeading>

        <Actions>
          <StyledButton
            order="primary"
            size="larger"
            onClick={() => browserHistory.push('/teams/settings/sso')}
          >
            Use SSO
          </StyledButton>

          <Link order="tertiary" onClick={closePortal}>
            KEEP 2FA
          </Link>
        </Actions>
      </Wrapper>
    </ModalContent>
  )
}

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.xl};
`

const StyledButton = styled(Button)`
  margin-bottom: ${props => props.theme.spacing.sm};
`

const StyledWarningIcon = styled(WarningIcon)`
  width: 200px;
  height: 200px;
  padding-bottom: ${props => props.theme.spacing.xl};
`

export default PreSSOModal
