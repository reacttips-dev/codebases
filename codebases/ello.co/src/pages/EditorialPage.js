import React, { Component } from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadEditorials } from '../actions/editorials'
import StreamContainer from '../containers/StreamContainer'
import { HeroHeader } from '../components/heros/HeroRenderables'
import { MainView } from '../components/views/MainView'
import { trackPostViews } from '../actions/posts'
import { media } from '../styles/jss'
import { maxBreak2 } from '../styles/jso'
import { selectQueryPreview, selectPropsQueryBefore } from '../selectors/routing'
import { selectRandomPageHeader } from '../selectors/page_headers'
import { selectUser } from '../selectors/user'
import { selectHeroDPI } from '../selectors/gui'

const streamStyle = media(maxBreak2, {
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
})

function mapStateToProps(state, props) {
  const pageHeader = selectRandomPageHeader(state)
  const user = pageHeader ? selectUser(state, { userId: pageHeader.get('userId') }) : null
  return {
    dpi: selectHeroDPI(state),
    isPreview: selectQueryPreview(state) === 'true',
    before: selectPropsQueryBefore(state, props),
    pageHeader,
    user,
  }
}

class EditorialPage extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    before: PropTypes.string,
    pageHeader: PropTypes.object,
    user: PropTypes.object,
  }

  static defaultProps = {
    isPreview: false,
    pageHeader: null,
    user: null,
    before: null,
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
    const { dpi, user, pageHeader, before } = this.props
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
      <MainView className="Editorial">
        { hero }
        <StreamContainer
          action={loadEditorials(this.props.isPreview, before)}
          className={`${streamStyle}`}
          paginatorText="Load More"
          paginatorCentered
        />
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(EditorialPage)

