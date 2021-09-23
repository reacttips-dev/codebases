import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { trackEvent } from '../actions/analytics'
import { openOmnibar } from '../actions/omnibar'
import {
  ArtistInviteDetail,
  ArtistInviteGrid,
} from '../components/artist_invites/ArtistInviteRenderables'
import { getEditorId } from '../components/editor/Editor'
import { EDITOR, GUI } from '../constants/action_types'
import * as ElloAndroidInterface from '../lib/android_interface'
import { scrollToPosition } from '../lib/jello'
import {
  selectArtistInvite,
  selectClosedAt,
  selectDescription,
  selectGuide,
  selectHeaderImage,
  selectId,
  selectInviteType,
  selectLinks,
  selectLogoImage,
  selectOpenedAt,
  selectRedirectUrl,
  selectShortDescription,
  selectSlug,
  selectStatus,
  selectSubmissionBodyBlock,
  selectTitle,
} from '../selectors/artist_invites'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDPI, selectIsCompletingOnboardingWithArtistInvite } from '../selectors/gui'

function mapStateToProps(state, props) {
  return {
    // artistInvite fields
    artistInvite: selectArtistInvite(state, props),
    closedAt: selectClosedAt(state, props),
    description: selectDescription(state, props),
    guide: selectGuide(state, props),
    headerImage: selectHeaderImage(state, props),
    id: selectId(state, props),
    inviteType: selectInviteType(state, props),
    links: selectLinks(state, props),
    logoImage: selectLogoImage(state, props),
    openedAt: selectOpenedAt(state, props),
    redirectUrl: selectRedirectUrl(state, props),
    shortDescription: selectShortDescription(state, props),
    slug: selectSlug(state, props),
    status: selectStatus(state, props),
    submissionBodyBlock: selectSubmissionBodyBlock(state, props),
    title: selectTitle(state, props),
    // other
    dpi: selectDPI(state),
    isLoggedIn: selectIsLoggedIn(state),
    isCompletingOnboarding: selectIsCompletingOnboardingWithArtistInvite(state),
  }
}

class ArtistInviteContainer extends PureComponent {
  static propTypes = {
    artistInvite: PropTypes.object.isRequired,
    closedAt: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    guide: PropTypes.object.isRequired,
    headerImage: PropTypes.object.isRequired,
    inviteType: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    kind: PropTypes.oneOf(['detail', 'grid']).isRequired,
    links: PropTypes.object.isRequired,
    logoImage: PropTypes.object.isRequired,
    openedAt: PropTypes.string.isRequired,
    redirectUrl: PropTypes.string,
    shortDescription: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    submissionBodyBlock: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isCompletingOnboarding: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    redirectUrl: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
    onLaunchNativeEditor: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    onClickArtistInviteDetail: PropTypes.func,
    onClickScrollToContent: PropTypes.func,
    onClickSubmit: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickArtistInviteDetail: this.onClickArtistInviteDetail,
      onClickScrollToContent: this.onClickScrollToContent,
      onClickSubmit: this.onClickSubmit,
    }
  }

  componentWillMount() {
    this.state = {
      hasSubmissions: false,
      hasLoaded: false,
    }
    const { redirectUrl, kind } = this.props
    if (redirectUrl && redirectUrl !== '') {
      if (kind === 'detail') {
        const win = window.open(redirectUrl, '_blank')
        win.focus()
      }
      const { dispatch } = this.props
      dispatch(replace({ pathname: '/creative-briefs' }))
    }
  }

  componentDidUpdate() {
    const { dispatch, isCompletingOnboarding, kind } = this.props
    if (isCompletingOnboarding && kind === 'detail') {
      this.openArtistInviteOmnibar()
      dispatch({
        type: GUI.RESET_ONBOARD_TO_ARTIST_INVITE,
        payload: {},
      })
    }
  }

  onClickArtistInviteDetail = () => {
    const { dispatch, slug } = this.props
    dispatch(trackEvent('clicked_artist_invite_detail', { slug }))
  }

  onClickScrollToContent = () => {
    scrollToPosition(0, document.querySelector('.Submissions').offsetTop)
  }

  onClickSubmit = () => {
    const { artistInvite, dispatch, isLoggedIn } = this.props
    if (isLoggedIn) {
      this.openArtistInviteOmnibar()
    } else {
      const { onClickOpenRegistrationRequestDialog } = this.context
      dispatch({
        type: GUI.START_ONBOARD_TO_ARTIST_INVITE,
        payload: {
          artistInvite,
        },
      })
      onClickOpenRegistrationRequestDialog('artist-invites')
    }
  }

  openArtistInviteOmnibar = () => {
    const { artistInvite, dispatch } = this.props
    const editorId = getEditorId()
    dispatch({
      type: EDITOR.ADD_ARTIST_INVITE,
      payload: {
        editorId,
        artistInvite,
      },
    })
    if (ElloAndroidInterface.supportsNativeEditor()) {
      dispatch(trackEvent('opened_omnibar'))
      this.context.onLaunchNativeEditor(null, false, null)
    } else {
      dispatch(openOmnibar())
      scrollToPosition(0, 0)
    }
  }

  handleResultStatus = (numberResults) => {
    let hasSubmissions = false
    const hasLoaded = (numberResults !== null)

    if (numberResults > 0) {
      hasSubmissions = true
    }

    this.setState({
      hasSubmissions,
      hasLoaded,
    })
  }

  render() {
    const {
      closedAt,
      description,
      dpi,
      guide,
      headerImage,
      inviteType,
      isLoggedIn,
      kind,
      links,
      logoImage,
      openedAt,
      redirectUrl,
      shortDescription,
      slug,
      status,
      submissionBodyBlock,
      title,
    } = this.props
    switch (kind) {
      case 'detail':
        return (
          <ArtistInviteDetail
            closedAt={closedAt}
            description={description}
            dpi={dpi}
            guide={guide}
            hasSubmissions={this.state.hasSubmissions}
            hasLoaded={this.state.hasLoaded}
            sendResultStatus={numberResults => this.handleResultStatus(numberResults)}
            headerImage={headerImage}
            inviteType={inviteType}
            isLoggedIn={isLoggedIn}
            links={links}
            logoImage={logoImage}
            openedAt={openedAt}
            slug={slug}
            status={status}
            submissionBodyBlock={submissionBodyBlock}
            title={title}
          />
        )
      case 'grid':
        return (
          <ArtistInviteGrid
            closedAt={closedAt}
            dpi={dpi}
            headerImage={headerImage}
            inviteType={inviteType}
            logoImage={logoImage}
            openedAt={openedAt}
            redirectUrl={redirectUrl}
            shortDescription={shortDescription}
            slug={slug}
            status={status}
            title={title}
          />
        )
      default:
        return null
    }
  }
}

export default connect(mapStateToProps)(ArtistInviteContainer)

