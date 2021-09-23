import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { trackEvent } from '../actions/analytics'
import { GUI } from '../constants/action_types'
import { saveAvatar, saveCover } from '../actions/profile'
import OnboardingSettings from '../components/onboarding/OnboardingSettings'
import { selectDPI, selectIsMobile, selectOnboardToArtistInvite } from '../selectors/gui'
import {
  selectAvatar,
  selectCoverImage,
  selectIsAvatarBlank,
  selectIsCoverImageBlank,
  selectIsInfoFormBlank,
} from '../selectors/profile'


function mapStateToProps(state) {
  const avatar = selectAvatar(state)
  const coverImage = selectCoverImage(state)
  const dpi = selectDPI(state)
  const isAvatarBlank = selectIsAvatarBlank(state)
  const isCoverImageBlank = selectIsCoverImageBlank(state)
  const isMobile = selectIsMobile(state)
  const isInfoFormBlank = selectIsInfoFormBlank(state)
  const isNextDisabled = isAvatarBlank && isCoverImageBlank && isInfoFormBlank
  const onboardToArtistInvite = selectOnboardToArtistInvite(state)
  return {
    avatar,
    coverImage,
    dpi,
    isAvatarBlank,
    isCoverImageBlank,
    isMobile,
    isNextDisabled,
    onboardToArtistInvite,
  }
}

class OnboardingSettingsContainer extends PureComponent {

  static propTypes = {
    avatar: PropTypes.object,
    coverImage: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isAvatarBlank: PropTypes.bool.isRequired,
    isCoverImageBlank: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isNextDisabled: PropTypes.bool.isRequired,
    onboardToArtistInvite: PropTypes.object,
  }

  static defaultProps = {
    avatar: null,
    coverImage: null,
    onboardToArtistInvite: null,
  }

  static childContextTypes = {
    avatar: PropTypes.object,
    coverImage: PropTypes.object,
    dpi: PropTypes.string.isRequired,
    isAvatarBlank: PropTypes.bool,
    isCoverImageBlank: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func,
    onNextClick: PropTypes.func,
    saveAvatar: PropTypes.func,
    saveCover: PropTypes.func,
  }

  getChildContext() {
    const {
      avatar, dispatch, coverImage, dpi, isAvatarBlank, isCoverImageBlank, isMobile, isNextDisabled,
    } = this.props
    return {
      avatar,
      coverImage,
      dpi,
      isAvatarBlank,
      isCoverImageBlank,
      isMobile,
      nextLabel: 'Get Hired & Collaborate',
      onDoneClick: isNextDisabled ? null : this.onDoneClick,
      onNextClick: this.onNextClick,
      saveAvatar: bindActionCreators(saveAvatar, dispatch),
      saveCover: bindActionCreators(saveCover, dispatch),
    }
  }

  onDoneClick = () => {
    const { dispatch, onboardToArtistInvite } = this.props
    dispatch(trackEvent('Onboarding.Settings.Done.Clicked'))
    this.trackOnboardingEvents()
    if (onboardToArtistInvite) {
      dispatch({
        type: GUI.COMPLETE_ONBOARD_TO_ARTIST_INVITE,
        payload: {},
      })
      dispatch(push(`/creative-briefs/${onboardToArtistInvite.get('slug')}`))
    } else {
      dispatch(push('/following'))
    }
  }

  onNextClick = () => {
    const { dispatch } = this.props
    this.trackOnboardingEvents()
    dispatch(push('/onboarding/collaborate'))
  }

  trackOnboardingEvents = () => {
    const { dispatch, isAvatarBlank, isCoverImageBlank } = this.props
    if (!isAvatarBlank) {
      dispatch(trackEvent('Onboarding.Settings.Avatar.Completed'))
    }
    if (!isCoverImageBlank) {
      dispatch(trackEvent('Onboarding.Settings.CoverImage.Completed'))
    }
    if (document.getElementById('name').value.length) {
      dispatch(trackEvent('Onboarding.Settings.Name.Completed'))
    }
    if (document.getElementById('unsanitized_short_bio').value.length) {
      dispatch(trackEvent('Onboarding.Settings.Bio.Completed'))
    }
    if (document.getElementById('external_links').value.length) {
      dispatch(trackEvent('Onboarding.Settings.Links.Completed'))
    }
  }

  render() {
    return <OnboardingSettings isNextDisabled={this.props.isNextDisabled} />
  }
}

export default connect(mapStateToProps)(OnboardingSettingsContainer)

