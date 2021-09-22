import React, { useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { Link, Padded, Toast } from '@invisionapp/helios'
import { appContext, appShell } from '../inGlobalContext'
import { useLoadPaywalls } from '../ops/paywalls'

class App extends React.Component {
  componentDidMount() {
    this.props.checkAction()
    this.props.startLocationListener()

    // If the auth session hint is true, we can expect that the user will
    // not land in a redirect to login flow and can render/mount the app early

    if (appContext && appShell.user.hasAuthedSessionHint()) {
      const { MOUNT } = appShell.events.COMMAND_TYPES
      appContext.resolveCommand(MOUNT)
    }
  }

  renderUndo() {
    const { flash, flashUndo } = this.props
    return flash.undoId ? (
      <Padded horizontal="xs">
        <Link onClick={() => flashUndo(flash.undoId)}>Undo</Link>
      </Padded>
    ) : null
  }

  render() {
    const { children, flash, lockedBodyScroll } = this.props

    return (
      <Wrapper locked={lockedBodyScroll}>
        <GlobalStyle />

        {children}

        {flash.show && (
          // Place toast on top of all modals
          <Toast placement="top-center" status={flash.status} style={{ zIndex: 1001 }}>
            {flash.message}
          </Toast>
        )}
      </Wrapper>
    )
  }
}

const AppWrapper = props => {
  const { checkPaywall, paywall } = props
  const [isPaywallLoading, loadPaywalls] = useLoadPaywalls()

  useEffect(() => {
    const getPaywall = async () => {
      const response = await loadPaywalls()
      response.checkBanners('team-management-web')
      checkPaywall(response)
    }

    if (!isPaywallLoading && Object.keys(paywall).length === 0) {
      getPaywall()
    }
  }, [checkPaywall, isPaywallLoading, loadPaywalls, paywall])

  return <App {...props} paywall={paywall} />
}

const Wrapper = styled.div`
  ${props => (props.locked ? 'overflow: hidden; height: 100vh;' : '')}
  display: flex;
  min-height: 100%;
  flex-direction: column;
`

export const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  * {
    box-sizing: inherit;

    &::before,
    &::after {
      box-sizing: inherit;
    }
  }

  body {
    background-color: ${({ theme }) => theme.palette.structure.lightest};
  }

  html, button, input, select, textarea {
    color: ${({ theme }) => theme.palette.text.regular};
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 400;
    line-height: 20px;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  strong {
    font-weight: 500;
  }

  .modal-content {
    display: flex;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`

export default AppWrapper
