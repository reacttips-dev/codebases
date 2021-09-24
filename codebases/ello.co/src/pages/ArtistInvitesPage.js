import React, { Component } from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadArtistInvites } from '../actions/artist_invites'
import { trackPostViews } from '../actions/posts'
import StreamContainer from '../containers/StreamContainer'
import { HeroHeader } from '../components/heros/HeroRenderables'
import { MainView } from '../components/views/MainView'
import { selectQueryPreview } from '../selectors/routing'
import { selectRandomPageHeader } from '../selectors/page_headers'
import { selectUser } from '../selectors/user'
import { css } from '../styles/jss'
import { selectHeroDPI } from '../selectors/gui'

const streamStyle = css({
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
})

function mapStateToProps(state) {
  const pageHeader = selectRandomPageHeader(state)
  const user = pageHeader ? selectUser(state, { userId: pageHeader.get('userId') }) : null
  return {
    dpi: selectHeroDPI(state),
    isPreview: selectQueryPreview(state) === 'true',
    user,
    pageHeader,
  }
}

class ArtistInvitesPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    pageHeader: PropTypes.object,
    user: PropTypes.object,
  }

  static defaultProps = {
    isPreview: false,
    pageHeader: null,
    user: null,
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.pageHeader, this.props.pageHeader) ||
      ['dpi'].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }

  componentDidUpdate() {
    const { dispatch, pageHeader } = this.props
    if (pageHeader && pageHeader.get('postToken')) {
      dispatch(trackPostViews([], [pageHeader.get('postToken')], 'promo'))
    }
  }

  render() {
    const { dpi, pageHeader, user } = this.props
    let hero
    if (pageHeader) {
      const header = pageHeader.get('header', '')
      const subheader = pageHeader.get('subheader', '')
      const avatarSources = user.get('avatar', null)
      const username = user.get('username', null)
      const sources = pageHeader.get('image', null)
      hero = (<HeroHeader
        dpi={dpi}
        headerText={header}
        subHeaderText={subheader}
        sources={sources}
        avatarSources={avatarSources}
        username={username}
      />)
    }
    return (
      <MainView className="ArtistInvites">
        {hero}
        <StreamContainer
          action={loadArtistInvites(this.props.isPreview)}
          className={`${streamStyle}`}
          paginatorText="Load More"
        />
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(ArtistInvitesPage)

