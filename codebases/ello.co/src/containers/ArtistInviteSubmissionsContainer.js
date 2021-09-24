import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { loadArtistInviteSubmissions } from '../actions/artist_invites'
import {
  selectSubmissionType,
  selectPathname,
} from '../selectors/routing'
import { selectInnerWidth } from '../selectors/gui'
import { updateQueryParams } from '../helpers/uri_helper'
import { css, media, parent, select } from '../styles/jss'
import * as s from '../styles/jso'
import StreamContainer from './StreamContainer'
import SelectionTabSwitcher from './../components/artist_invites/ArtistInviteAdminRenderables'

const KEYS = ['unapprovedSubmissions', 'approvedSubmissions', 'selectedSubmissions', 'declinedSubmissions']

const containerStyle = css(
  { paddingBottom: 50 },
)

const titleWrapperStyle = css(
  s.block,
  s.maxSiteWidth,
  s.fullWidth,
  s.px10,
  s.mxAuto,
  media(s.minBreak2, s.px20),
  media(s.minBreak4, s.px0),
)

const tabsWrapperStyle = css(
  { ...titleWrapperStyle },
  select('& ul',
    s.flex,
    s.flexNoWrap,
    s.justifySpaceBetween,
    s.pt30,
    s.pb20,
    s.fullWidth,
    s.resetList,
    select('& li',
      { width: 'calc(25% - 20px)' },
      media(s.maxBreak2,
        s.fullWidth,
        s.mb10,
      ),
    ),

    media(s.maxBreak2,
      s.block,
      s.pt10,
      s.pb0,
    ),
  ),
)

const titleStyle = css(
  s.block,
  s.fullWidth,
  s.sansBlack,
  s.colorA,
  s.fontSize24,
  media(s.minBreak3, s.mb20, parent('.ArtistInvitesDetail', s.mb0, s.fontSize38)),
)

const mapStateToProps = (state, props) => {
  const links = (props.links || Immutable.Map([])).filter(l => l.get('type') === 'artist_invite_submission_stream')
  const selectedKey = links.size > 0 ? selectSubmissionType(state, props) || KEYS[0] : KEYS[0]
  return {
    links,
    selectedKey,
    pathname: selectPathname(state),
    streamAction: links.size > 0 ? loadArtistInviteSubmissions(links.getIn([selectedKey, 'href']), selectedKey, props.slug) : null,
    innerWidth: selectInnerWidth(state),
  }
}

class ArtistInviteSubmissionsContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hasLoaded: PropTypes.bool,
    hasSubmissions: PropTypes.bool,
    innerWidth: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    links: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    selectedKey: PropTypes.string.isRequired,
    sendResultStatus: PropTypes.func,
    slug: PropTypes.string.isRequired,
    status: PropTypes.string,
    streamAction: PropTypes.object,
  }

  static defaultProps = {
    hasLoaded: false,
    hasSubmissions: false,
    sendResultStatus: null,
    status: null,
    streamAction: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      explainerKeyOpen: null,
    }

    this.onClickExplainerToggle = this.onClickExplainerToggle.bind(this)
  }

  componentWillMount() {
    const { streamAction } = this.props

    this.state = { streamAction }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.streamAction && nextProps.streamAction) {
      this.setState({ streamAction: nextProps.streamAction })
    }
  }

  componentDidUpdate() {
    if (this.props.innerWidth > 639) {
      this.onClickExplainerToggle(null)
    }
  }

  onClickExplainerToggle = (key) => {
    const { explainerKeyOpen } = this.state
    let newExplainerKeyOpen = null

    if (key !== explainerKeyOpen) {
      newExplainerKeyOpen = key
    }

    this.setState({
      explainerKeyOpen: newExplainerKeyOpen,
    })

    // set state with explainer tip key open
  }

  onClickSubmissionType = (e, key) => {
    const { links, slug, pathname, dispatch } = this.props

    e.preventDefault()

    if (e.target.tagName !== 'BUTTON') {
      const search = updateQueryParams({ submissionType: key })
      this.setState({ streamAction: loadArtistInviteSubmissions(links.getIn([`${key}`, 'href']), key, slug) })
      dispatch(push({ pathname, search }))
    }
  }

  renderAdmin() {
    const { selectedKey, links, sendResultStatus, innerWidth } = this.props
    const { streamAction } = this.state
    return (
      <div>
        <div className={tabsWrapperStyle}>
          <h2 className={titleStyle}>Submissions —</h2>
          <ul>
            {KEYS.map((key) => {
              const submissionStream = links.get(key)
              const label = submissionStream.get('label').replace('Approved', 'Accepted')
              const isActive = selectedKey === key
              return (
                <SelectionTabSwitcher
                  key={key}
                  dataKey={key}
                  isActive={isActive}
                  label={label}
                  innerWidth={innerWidth}
                  explainerKeyOpen={this.state.explainerKeyOpen}
                  onClickExplainerToggle={() => this.onClickExplainerToggle(key)}
                  onClick={e => this.onClickSubmissionType(e, key)}
                />
              )
            })}
          </ul>
        </div>
        {streamAction &&
          <StreamContainer
            action={streamAction}
            key={`submissionStream_${selectedKey}`}
            paginatorText="Load More"
            paginatorCentered
            sendResultStatus={sendResultStatus}
          />
        }
      </div>
    )
  }

  renderNormal() {
    const { links, slug, status, sendResultStatus, hasSubmissions, hasLoaded } = this.props

    // zero state
    if (hasLoaded && !hasSubmissions) {
      return (
        <div className="StreamContainer ZeroState">
          <h1 className={titleStyle}>
            No Submissions
            {(status !== 'closed') &&
              <span> Yet</span>
            }
          </h1>
        </div>
      )
    }

    // state for results
    switch (status) {
      case 'closed':
        return (
          <div>
            <StreamContainer
              action={loadArtistInviteSubmissions(links.getIn([KEYS[2], 'href']), KEYS[2], slug, 'Selections')}
              hasShowMoreButton
              key={`submissionStream_${KEYS[2]}`}
              paginatorText="Load More"
              paginatorCentered
              shouldInfiniteScroll={false}
              sendResultStatus={sendResultStatus}
            />
            <StreamContainer
              action={loadArtistInviteSubmissions(links.getIn([KEYS[1], 'href']), KEYS[1], slug, 'Submissions')}
              hasShowMoreButton
              key={`submissionStream_${KEYS[1]}`}
              paginatorText="Load More"
              paginatorCentered
              shouldInfiniteScroll={false}
              sendResultStatus={sendResultStatus}
            />
          </div>
        )
      case 'open':
      case 'selecting':
        return (
          <div>
            <StreamContainer
              action={loadArtistInviteSubmissions(links.getIn([KEYS[1], 'href']), KEYS[1], slug, 'Submissions')}
              hasShowMoreButton
              key={`submissionStream_${KEYS[1]}`}
              paginatorText="Load More"
              paginatorCentered
              shouldInfiniteScroll={false}
              sendResultStatus={sendResultStatus}
            />
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const { links, isLoggedIn } = this.props
    if (links.size === 0) { return null }
    return (
      <section className={`Submissions ${containerStyle}`}>
        {links.size >= 3 && isLoggedIn && this.renderAdmin()}
        {links.size > 0 && links.size < 3 && this.renderNormal()}
      </section>
    )
  }
}

export default connect(mapStateToProps)(ArtistInviteSubmissionsContainer)

