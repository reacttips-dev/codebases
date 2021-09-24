/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router'
import { before, css, hover, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import BackgroundImage from '../assets/BackgroundImage'
import ImageAsset from '../assets/ImageAsset'
import { ArrowIcon } from '../assets/Icons'
import { RoundedRect } from '../buttons/Buttons'
import ArtistInviteSubmissionsContainer from '../../containers/ArtistInviteSubmissionsContainer'

const gridContainerStyle = css(
  s.block,
  s.mr20,
  s.ml20,
  s.mb40,
  s.bgcF2,
  s.fontSize14,
  s.sansRegular,
  s.transitionBgColor,
  { width: 'calc(50% - 40px)' },
  media(
    s.maxBreak4,
    s.mr10,
    s.ml10,
    s.mb20,
    { width: 'calc(50% - 20px)' },
  ),
  media(
    s.maxBreak2,
    s.mr0,
    s.ml0,
    s.mb10,
    s.fullWidth,
  ),
  hover(s.bgcE5),
)

const imageContainerStyle = css(
  s.maxViewWidth,
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.relative,
  { height: 235, margin: '0 auto' },
  media(s.minBreak2, { height: 220 }, parent('.ArtistInvitesDetail', s.mb40, { height: 555 }, media(s.minBreak3, s.mb60))),
  parent('a:hover', select('> .BackgroundImage::before', { backgroundColor: 'rgba(0, 0, 0, 0.5)' })),
  parent('.ArtistInvitesDetail', s.mb20),
)

const logoImageStyle = css(
  { maxHeight: 155 },
  s.px20,
  s.zIndex1,
  media(s.minBreak2, { maxHeight: 140 }, parent('.ArtistInvitesDetail', { maxHeight: 190 })),
)

const contentContainerStyle = css(
  s.p10,
  s.relative,
  media(s.maxBreak2, s.relative),
  media(s.minBreak3, s.py20, s.px20),
)

const detailsStyle = css(
  s.block,
  s.fullWidth,
  s.clearFix,
)

const titleStyle = css(
  s.block,
  s.sansBlack,
  s.fontSize24,
  media(s.minBreak3, s.mb20),
  parent(
    '.ArtistInvites',
    s.truncate,
  ),
  parent(
    '.ArtistInvitesDetail',
    media(s.minBreak2, { marginTop: -5 }),
    media(s.minBreak3, s.mb0, s.fontSize38, { marginTop: -10 }),
  ),
)

const inviteTypeStyle = css(
  s.colorA,
  s.my0,
  media(s.minBreak3, { width: 'calc(100% - 210px)', float: 'left' }),
  media(s.maxBreak3, s.mb10),
  parent(
    '.ArtistInvites',
    s.truncate,
  ),
  parent(
    '.ArtistInvitesDetail',
    s.fontSize24,
    s.sansLight,
    s.fullWidth,
    {
      float: 'none',
      clear: 'both',
    },
    media(s.minBreak3, s.fontSize38, s.fit),
  ),
)

const textStatusStyle = css(
  s.fontSize24,
  s.mb0,
  s.mt20,
  s.truncate,
  modifier('.closed', { color: '#fe0404' }),
  modifier('.open', { color: '#00d100' }),
  modifier('.preview', { color: '#0409fe' }),
  modifier('.selecting', { color: '#ffb100' }),
  modifier('.upcoming', { color: '#c000ff' }),
  parent(
    '.ArtistInvitesDetail',
    s.sansLight,
    s.fullWidth,
    {
      float: 'none',
      clear: 'both',
    },
    media(
      s.minBreak3,
      s.fontSize38,
    ),
  ),
  media(
    s.maxBreak3,
    s.fullWidth,
  ),
)

const bulletStatusStyle = css(
  { ...textStatusStyle },
  { float: 'left', width: '210px' },
  s.fontSize14,
  s.mt0,
  media(
    s.maxBreak3,
    s.fullWidth,
    {
      float: 'none',
      clear: 'both',
    },
  ),
  before(
    {
      borderRadius: 5,
      content: '""',
      height: 10,
      width: 10,
    },
    s.inlineBlock,
    s.mr20,
  ),
  modifier('.closed', before({ backgroundColor: '#fe0404' })),
  modifier('.open', before(s.bgcGreen)),
  modifier('.preview', before({ backgroundColor: '#0409fe' })),
  modifier('.selecting', before({ backgroundColor: '#ffb100' })),
  modifier('.upcoming', before({ backgroundColor: '#c000ff' })),
)

const dateRangeStyle = css(
  s.colorA,
  s.my0,
  s.truncate,
  { float: 'right', width: '180px' },
  media(
    s.maxBreak3,
    s.fullWidth,
    {
      float: 'none',
      clear: 'both',
    },
  ),
  parent(
    '.ArtistInvitesDetail',
    s.fullWidth,
    {
      float: 'none',
      clear: 'both',
    },
    s.fontSize24,
    s.sansLight,
    media(s.minBreak3, s.fontSize38),
  ),

)

const shortDescriptionStyle = css(
  s.block,
  s.mt20,
  select('& br', { display: 'none' }),
  select('& p:last-child', s.mb0),
  media(s.maxBreak3, s.mt20),
)

const getStatusText = (status) => {
  switch (status) {
    case 'closed':
      return 'Invite Closed'
    case 'open':
      return 'Open For Submissions'
    case 'preview':
      return 'Preview'
    case 'selecting':
      return 'Selections In Progress'
    case 'upcoming':
      return 'Upcoming'
    default:
      return null
  }
}

const renderTextStatus = status => (
  <p className={`${textStatusStyle} ${status}`}>
    {getStatusText(status)}
  </p>
)

const renderBulletStatus = status => (
  <p className={`${bulletStatusStyle} ${status}`}>
    {getStatusText(status)}
  </p>
)

function getSecondsRemaining(closedAt) {
  const remaining = moment(closedAt).unix() - moment().unix()
  return remaining < 0 ? 0 : remaining
}

class ArtistInviteCountDown extends PureComponent {
  static propTypes = {
    status: PropTypes.string.isRequired,
    openedAt: PropTypes.string.isRequired,
    closedAt: PropTypes.string.isRequired,
    className: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { secondsRemaining: getSecondsRemaining(props.closedAt) }
    this.timer = 0;
  }

  componentDidMount() {
    const { status } = this.props
    if (status === 'open') {
      this.interval = setInterval(this.tick, 1000)
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  tick = () => {
    const { closedAt } = this.props
    this.setState({ secondsRemaining: getSecondsRemaining(closedAt) })
  }

  countDown() {
    const { secondsRemaining } = this.state
    const pad = n => `${n}`.padStart(2, '0')
    const r = moment.duration(secondsRemaining, 'seconds')
    if (r.asDays() > 2.0) {
      return `${Math.floor(r.asDays())} Days Remaining`
    }
    return `${pad(Math.floor(r.asHours()))}:${pad(r.minutes())}:${pad(r.seconds())} Remaining`
  }

  renderByStatus() {
    const { status, openedAt } = this.props
    switch (status) {
      case 'preview':
      case 'upcoming':
        return ''
      case 'open':
        return this.countDown()
      case 'selecting':
        return 'Hold Tight'
      case 'closed':
        return moment(openedAt).format('MMMM YYYY')
      default:
        return ''
    }
  }

  render() {
    const { className } = this.props
    return (
      <p className={className}>{this.renderByStatus()}</p>
    )
  }

}

export const ArtistInviteGrid = ({
  closedAt,
  dpi,
  headerImage,
  inviteType,
  logoImage,
  openedAt,
  redirectUrl,
  shortDescription,
  slug,
  status,
  title,
}, { onClickArtistInviteDetail }) => {
  const link = redirectUrl || `/creative-briefs/${slug}`
  const target = redirectUrl ? '_blank' : null
  return (
    <Link
      to={link}
      target={target}
      className={gridContainerStyle}
      onClick={onClickArtistInviteDetail}
    >
      <div className={imageContainerStyle}>
        <BackgroundImage className="hasOverlay3" dpi={dpi} sources={headerImage} />
        <ImageAsset className={logoImageStyle} src={logoImage.getIn(['optimized', 'url'])} />
      </div>
      <div className={contentContainerStyle}>
        <h2 className={titleStyle}>{title}</h2>
        <div className={detailsStyle}>
          <p className={inviteTypeStyle}>{inviteType}</p>
          {renderBulletStatus(status)}
          <ArtistInviteCountDown
            className={dateRangeStyle}
            status={status}
            openedAt={openedAt}
            closedAt={closedAt}
          />
        </div>
        <div
          className={shortDescriptionStyle}
          dangerouslySetInnerHTML={{ __html: shortDescription }}
        />
      </div>
    </Link>
  )
}

ArtistInviteGrid.defaultProps = {
  redirectUrl: null,
}
ArtistInviteGrid.propTypes = {
  closedAt: PropTypes.string.isRequired,
  dpi: PropTypes.string.isRequired,
  headerImage: PropTypes.object.isRequired,
  inviteType: PropTypes.string.isRequired,
  logoImage: PropTypes.object.isRequired,
  openedAt: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  shortDescription: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
ArtistInviteGrid.contextTypes = {
  onClickArtistInviteDetail: PropTypes.func.isRequired,
}

const detailContainerStyle = css(
  s.fullWidth,
  s.px10,
  s.mxAuto,
  media(s.minBreak2, s.px20),
  media(s.minBreak4, s.px0),
  select('& .ArrowIcon', { transform: 'rotate(90deg)' }),
  select(
    '& .RoundedRect',
    s.my20,
    media(
      s.minBreak2,
      modifier('.ScrollButton', s.my40),
      modifier('.SubmitButton', s.mt0, s.mb30),
    ),
    media(
      s.minBreak3,
      modifier('.ScrollButton', s.my60),
      modifier('.SubmitButton', { marginBottom: 50 }),
    ),
  ),
)

const upcomingDetailContainerStyle = css(
  { ...detailContainerStyle },
  { paddingBottom: 60 },
)

const detailContentContainerStyle = css(
  s.maxSiteWidthPadded, { margin: '0 auto' },
  media(s.maxBreak4, s.pr0, s.pl0),
)

const contentColumnStyle = css(
  s.alignTop,
  s.fit,
  s.inlineBlock,
  media(
    s.minBreak2,
    s.mr20,
    s.mb20,
    { width: 'calc(50% - 10px)' },
    select(':nth-child(2n)', s.mr0),
  ),
  media(
    s.minBreak3,
    s.mr40,
    s.mb40,
    { width: 'calc(50% - 20px)' },
  ),
)

const guideStyle = css(
  s.colorA,
  s.fontSize14,
  select('& .GuideHeader', s.fontSize24, s.mb20, s.sansBlack, s.truncate, media(s.minBreak3, s.fontSize38)),
  select('& .GuideContent', media(s.minBreak2, s.mb30), media(s.minBreak3, s.mb60)),
)

export const ArtistInviteDetail = ({
  closedAt,
  description,
  dpi,
  guide,
  hasSubmissions,
  hasLoaded,
  sendResultStatus,
  headerImage,
  inviteType,
  isLoggedIn,
  links,
  logoImage,
  openedAt,
  slug,
  status,
  title,
}, {
  onClickScrollToContent,
  onClickSubmit,
}) => (
  <div>
    <article className={(status === 'upcoming') ? upcomingDetailContainerStyle : detailContainerStyle}>
      <div className={imageContainerStyle}>
        <BackgroundImage className="hasOverlay3" dpi={dpi} sources={headerImage} />
        <ImageAsset className={logoImageStyle} src={logoImage.getIn(['optimized', 'url'])} />
      </div>
      <div className={detailContentContainerStyle}>
        <div className={contentColumnStyle}>
          <h1 className={titleStyle}>{title}</h1>
          <p className={inviteTypeStyle}>{inviteType}</p>
          {renderTextStatus(status)}
          <ArtistInviteCountDown
            className={dateRangeStyle}
            status={status}
            openedAt={openedAt}
            closedAt={closedAt}
          />
          {status !== 'upcoming' && hasLoaded &&
            <RoundedRect className="ScrollButton GreenBorder" onClick={onClickScrollToContent}>
              <ArrowIcon />
              See Submissions
            </RoundedRect>
          }
          {status !== 'upcoming' && !hasLoaded &&
            <RoundedRect className="ScrollButton BlackBorder" onClick={onClickScrollToContent}>
              Loading Submissions…
            </RoundedRect>
          }
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <div className={contentColumnStyle}>
          {status === 'open' &&
            <RoundedRect className="SubmitButton Green isXL" onClick={onClickSubmit}>
              SUBMIT
            </RoundedRect>
          }
          {guide.map(g => (
            <div className={guideStyle} key={`guide_${g.get('title')}`}>
              <h3 className="GuideHeader">{g.get('title')}</h3>
              <div className="GuideContent" dangerouslySetInnerHTML={{ __html: g.get('renderedBody') }} />
            </div>
          ))}
        </div>
      </div>
    </article>
    {status !== 'upcoming' &&
      <ArtistInviteSubmissionsContainer
        links={links}
        slug={slug}
        status={status}
        isLoggedIn={isLoggedIn}
        sendResultStatus={sendResultStatus}
        hasSubmissions={hasSubmissions}
        hasLoaded={hasLoaded}
      />
    }
  </div>
)
ArtistInviteDetail.propTypes = {
  closedAt: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dpi: PropTypes.string.isRequired,
  guide: PropTypes.object.isRequired,
  hasSubmissions: PropTypes.bool.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  sendResultStatus: PropTypes.func.isRequired,
  headerImage: PropTypes.object.isRequired,
  inviteType: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  links: PropTypes.object.isRequired,
  logoImage: PropTypes.object.isRequired,
  openedAt: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
ArtistInviteDetail.contextTypes = {
  onClickScrollToContent: PropTypes.func.isRequired,
  onClickSubmit: PropTypes.func.isRequired,
}
