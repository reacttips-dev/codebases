import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { saveProfile } from '../actions/profile'
import OnboardingNavbar from '../components/onboarding/OnboardingNavbar'
import { ONBOARDING_VERSION } from '../constants/application_types'
import CreatorTypeContainer from '../containers/CreatorTypeContainer'
import { css, media, select } from '../styles/jss'
import * as s from '../styles/jso'

const containerStyle = css(
  s.flex,
  s.itemsCenter,
  s.mxAuto,
  s.p10,
  { height: 'calc(100vh - 70px)', marginTop: 70, maxWidth: 490 },
  media(s.minBreak2, s.mt0, { height: 'calc(100hv - 100px)' }),
  select('> div', s.fullWidth),
)

class OnboardingCreatorTypeContainer extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    nextLabel: PropTypes.string,
    onNextClick: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      nextLabel: 'Create Account',
      onNextClick: this.onNextClick,
    }
  }

  onNextClick = () => {
    const { dispatch } = this.props
    dispatch(saveProfile({ web_onboarding_version: ONBOARDING_VERSION }))
    dispatch(push('/onboarding/categories'))
  }

  render() {
    return (
      <div className={containerStyle}>
        <CreatorTypeContainer classModifier="inOnboarding" />
        <OnboardingNavbar />
      </div>
    )
  }
}

export default connect()(OnboardingCreatorTypeContainer)

