import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Text, Link, Padded, Illustration } from '@invisionapp/helios'
import CouldNotLoadImage from '@invisionapp/helios/illustrations/spot/inspect-could-not-load.svg'
import { GlobalHeader, GlobalHeaderContainer } from '@invisionapp/helios/composites'

import { selectLogo } from './stores/logo'
import { selectTeam } from './stores/team'
import { GlobalStyle } from './layouts/App'

import { GlobalNavigation } from './components/GlobalNavigation'

class AppLoadErrorHandler extends React.Component {
  get name() {
    return this.props.team.name || this.props.backupName
  }

  renderErrorDisplay() {
    return (
      <>
        <GlobalStyle />
        <GlobalHeader globalNav={<GlobalNavigation />} disableNavShadow />
        <GlobalHeaderContainer>
          <ErrorContent>
            <CenteredIllustration order="scene" size="larger">
              <img src={CouldNotLoadImage} alt="We're having trouble loading this section." />
            </CenteredIllustration>
            <Padded bottom="m">
              <Text order="title">Sorry about that!</Text>
            </Padded>
            <Text>
              We{"'"}re having trouble loading this section.
              <br />
              Try <Link onClick={() => this.props.refreshPage()}>refreshing</Link> the page.
            </Text>
          </ErrorContent>
        </GlobalHeaderContainer>
      </>
    )
  }

  render() {
    switch (this.props.appLoadStatus.type) {
      case 'error': {
        return this.renderErrorDisplay()
      }
      default: {
        return this.props.children
      }
    }
  }
}

const ErrorContent = styled.div`
  text-align: center;
`

const CenteredIllustration = styled(Illustration)`
  display: inline-block;
  margin: ${props => props.theme.spacing.xxl} 0 ${props => props.theme.spacing.l};
`

const mapStateToProps = state => {
  return {
    appLoadStatus: state.app.loadStatus,
    logo: selectLogo(state),
    team: selectTeam(state),
    backupName: window.location.hostname.split('.')[0],
    refreshPage() {
      window.location.reload()
    }
  }
}

export default connect(mapStateToProps)(AppLoadErrorHandler)
