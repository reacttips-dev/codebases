import React, {Component, Fragment} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {grid} from '../../../../shared/utils/grid';
import timeStamp from '../../../../shared/utils/timestamp';
import {
  ASH,
  CATHEDRAL,
  CHARCOAL,
  CONCRETE,
  TARMAC,
  WHITE,
  MAKO
} from '../../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import WebsiteIcon from '../../../../shared/library/links/website-icon.svg';
import Share from './buttons/share.jsx';
import Flag from '../shared/flag';
import Points from './buttons/points.jsx';
import RedditIcon from '../../../../shared/library/icons/sources/reddit.svg';
import HackerNewsIcon from '../../../../shared/library/icons/sources/hacker-news.svg';
import RSSIcon from '../../../../shared/library/icons/sources/rss.svg';
import LobstersIcon from '../../../../shared/library/icons/sources/lobsters.svg';
import BlogPostIcon from './icons/blog-post-icon.svg';
import {
  FEED_CLICK_ARTICLE_POINTS,
  FEED_CLICK_CARD,
  FEED_CLICK_CARD_SHARE,
  FEED_CLICK_CARD_SOURCE_DOMAIN,
  FEED_CLICK_CARD_SOURCE_TITLE,
  FEED_CLICK_CARD_SOURCE_AUTHOR,
  FEED_CLICK_TOOL_FOLLOW,
  FEED_CLICK_TOOL_FOLLOW_LOCATION_TOOL_POPOVER,
  FEED_DWELL_CARD,
  FEED_HOVER_TOOL_POPOVER,
  FEED_CLICK_CARD_TYPE_ARTICLE
} from '../../constants/analytics';
import ServiceTile, {SMALL} from '../../../../shared/library/tiles/service.jsx';
import ServiceListPopover from '../../../../shared/library/popovers/service-list/index';
import ServiceDetailsPopover from '../shared/service-details';
import SharePopover from '../../../../shared/library/popovers/share/index';
import DwellTracker from '../../../../shared/utils/dwell-tracker';
import {stripURL} from '../../../../shared/utils/strip-text';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {withTrackEngagement} from '../../../../shared/enhancers/stream-analytics-enhancer';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';
import {DEACTIVATE_MODE_CLICK} from '../../../../shared/library/popovers/base';
import {CLICK, DWELL} from '../../constants/stream-analytics';
import {PHONE} from '../../../../shared/style/breakpoints';
import {ID} from '../../../../shared/utils/graphql';

export const SOURCE_TYPE_REDDIT = 'reddit';
export const SOURCE_TYPE_HACKER_NEWS = 'hacker-news';
export const SOURCE_TYPE_RSS = 'rss';
export const SOURCE_TYPE_BLOG = 'blog';
export const SOURCE_TYPE_LOBSTERS = 'lobsters';
export const MIN_WIDTH = 636;

export const Container = glamorous.article({
  ...BASE_TEXT,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 4,
  border: `1px solid ${ASH}`,
  boxShadow: `0 1px 0 0 ${ASH}`,
  backgroundColor: WHITE,
  [PHONE]: {
    width: 'calc(100vw - 20px)'
  }
});

const InfoContainer = glamorous.div({
  display: 'flex'
});

const Info = glamorous.div({});

const OwnerIconLink = glamorous.a({
  marginRight: grid(2)
});

const OwnerIcon = glamorous.img({
  width: 52,
  height: 52,
  borderRadius: 2,
  flexShrink: 0
});

export const Title = glamorous.h2({
  display: 'block',
  ...BASE_TEXT,
  fontSize: 20,
  fontWeight: WEIGHT.BOLD,
  WebkitFontSmoothing: 'auto !important',
  letterSpacing: 0.3,
  marginBottom: 5,
  marginTop: 0,
  color: CHARCOAL
});

export const TitleLink = glamorous.a({
  color: CHARCOAL,
  textDecoration: 'none',
  ':visited': {
    color: CHARCOAL
  },
  ':hover': {
    color: TARMAC
  }
});

const Description = glamorous.div({
  marginTop: 14,
  ...BASE_TEXT,
  fontSize: 15,
  lineHeight: '25px',
  letterSpacing: 0.2,
  color: CATHEDRAL,
  wordWrap: 'break-word',
  '> a': {
    textDecoration: 'underline'
  }
});

const PublishTime = glamorous.time({
  color: CONCRETE,
  marginRight: grid(2)
});

export const TitlePanel = glamorous.header({
  boxSizing: 'border-box',
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

export const MetaPanel = glamorous.div({
  boxSizing: 'border-box',
  padding: `15px 0`,
  display: 'flex',
  flexDirection: 'row',
  borderTop: `1px solid ${ASH}`,
  width: '100%'
});

export const MetaPanelWrapper = glamorous.div({
  boxSizing: 'border-box',
  width: '100%',
  padding: '0 20px',
  display: 'flex'
});

export const Services = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  justifyContent: 'flex-end',
  '> *': {
    marginLeft: grid(1)
  }
});

export const ShowMore = glamorous.div({
  width: 32,
  height: 32,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...BASE_TEXT,
  color: CHARCOAL,
  cursor: 'pointer'
});

const CardMetadata = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  letterSpacing: 0.2,
  flexWrap: 'wrap'
});

const BlogPostIconContainer = glamorous.div({
  display: 'flex',
  alignItems: 'center'
});

const Byline = glamorous.span({
  fontSize: 12,
  letterSpacing: 0.2,
  color: MAKO,
  margin: '0 4px 0 8px'
});

export const Author = glamorous.a({
  marginRight: grid(2),
  fontSize: 12,
  letterSpacing: 0.2,
  color: MAKO,
  fontWeight: WEIGHT.BOLD,
  textDecoration: 'none',
  ':visited': {
    color: CHARCOAL
  },
  ':hover': {
    color: TARMAC
  }
});

export const DomainLink = glamorous.a({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
});

const HostName = glamorous.span({
  color: TARMAC,
  marginLeft: grid(1)
});

const FlagContainer = glamorous.span({
  marginLeft: grid(1),
  display: 'flex'
});

export class ArticleCard extends Component {
  static propTypes = {
    id: ID,
    currentUser: PropTypes.object,
    sendAnalyticsEvent: PropTypes.func,
    analyticsPayload: PropTypes.object,
    trackEngagement: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string,
    owner: PropTypes.object,
    url: PropTypes.string,
    services: PropTypes.array,
    maxVisible: PropTypes.number,
    createdAt: PropTypes.any,
    flagged: PropTypes.bool,
    isPrivateMode: PropTypes.bool,
    source: PropTypes.shape({
      type: PropTypes.oneOf([
        SOURCE_TYPE_REDDIT,
        SOURCE_TYPE_HACKER_NEWS,
        SOURCE_TYPE_LOBSTERS,
        SOURCE_TYPE_BLOG,
        SOURCE_TYPE_RSS
      ]),
      count: PropTypes.number,
      url: PropTypes.string
    })
  };

  handleClick = clickSource => {
    const {trackEngagement, sendAnalyticsEvent, analyticsPayload} = this.props;
    const {streamId, cardPosition} = analyticsPayload;

    sendAnalyticsEvent(FEED_CLICK_CARD, {clickSource});
    trackEngagement(CLICK, streamId, 70, cardPosition);
  };

  handleArticlePointsClick = () => {
    this.props.sendAnalyticsEvent(FEED_CLICK_ARTICLE_POINTS);
  };

  renderSource(source) {
    const {type, count} = source;

    if (type === SOURCE_TYPE_BLOG || type === SOURCE_TYPE_RSS) return null;

    const {url} = this.props;
    const link = source.url || url;
    let fill = '#ffb500';
    let icon = <RSSIcon />;
    let displayCount = count;
    let label = null;

    switch (type) {
      case SOURCE_TYPE_REDDIT:
        fill = '#ff623d';
        icon = <RedditIcon />;
        break;
      case SOURCE_TYPE_HACKER_NEWS:
        fill = '#ff7d00';
        icon = <HackerNewsIcon />;
        break;
      case SOURCE_TYPE_LOBSTERS:
        fill = '#ac473e';
        icon = <LobstersIcon />;
        break;
    }

    return (
      <Points
        count={displayCount}
        icon={icon}
        fill={fill}
        link={link}
        label={label}
        onClick={this.handleArticlePointsClick}
      />
    );
  }

  componentDidMount() {
    this.dwellTracker = new DwellTracker(this._el, time => {
      this.props.sendAnalyticsEvent(FEED_DWELL_CARD, {time});
      const {streamId, cardPosition} = this.props.analyticsPayload;
      this.props.trackEngagement(DWELL, streamId, 20, cardPosition);
    });
  }

  componentWillUnmount() {
    if (this.dwellTracker) {
      this.dwellTracker.destroy();
    }
  }

  render() {
    const {
      id,
      currentUser,
      title,
      description,
      owner,
      url,
      services,
      maxVisible,
      createdAt,
      source,
      flagged,
      sendAnalyticsEvent,
      analyticsPayload,
      isPrivateMode
    } = this.props;

    const more = services.length > maxVisible ? services.length - maxVisible : null;
    const showMore = more > 0 && maxVisible > 0;
    const isBlogPostOrRSS = source.type === SOURCE_TYPE_BLOG || source.type === SOURCE_TYPE_RSS;

    let formattedDescription = description;
    if (formattedDescription && formattedDescription.length > 300) {
      formattedDescription = formattedDescription.match(/^.{300}\w*/)[0] + ' ' + '\u2026';
    }

    return (
      <Container innerRef={el => (this._el = el)} data-testid="articleCard">
        <TitlePanel>
          <InfoContainer>
            {isBlogPostOrRSS && owner && (
              <OwnerIconLink href={url}>
                <OwnerIcon src={owner.imageUrl} />
              </OwnerIconLink>
            )}
            <Info>
              <Title>
                <TitleLink
                  href={url}
                  target="_blank"
                  rel="nofollow"
                  onClick={() => this.handleClick(FEED_CLICK_CARD_SOURCE_TITLE)}
                >
                  {title}
                </TitleLink>
              </Title>
              <CardMetadata>
                {createdAt && <PublishTime>{timeStamp(createdAt)}</PublishTime>}
                {isBlogPostOrRSS && (
                  <Fragment>
                    <BlogPostIconContainer>
                      <BlogPostIcon />
                    </BlogPostIconContainer>
                    <Byline>by</Byline>
                    <Author
                      target="_blank"
                      href={owner.canonicalUrl}
                      onClick={() => this.handleClick(FEED_CLICK_CARD_SOURCE_AUTHOR)}
                    >
                      {owner.name}
                    </Author>
                  </Fragment>
                )}
                {!isBlogPostOrRSS && (
                  <Fragment>
                    <DomainLink
                      href={url}
                      target="_blank"
                      onClick={() => this.handleClick(FEED_CLICK_CARD_SOURCE_DOMAIN)}
                    >
                      <WebsiteIcon />
                      <HostName>{stripURL(url)}</HostName>
                    </DomainLink>
                  </Fragment>
                )}
              </CardMetadata>
            </Info>
          </InfoContainer>
          <Description>{formattedDescription}</Description>
        </TitlePanel>
        <MetaPanelWrapper>
          <MetaPanel>
            {this.renderSource(source)}
            <SharePopover
              url={url}
              title={title}
              analyticsEventName={FEED_CLICK_CARD_SHARE}
              deactivateMode={DEACTIVATE_MODE_CLICK}
            >
              <Share />
            </SharePopover>
            <Services>
              {showMore && (
                <ServiceListPopover services={services}>
                  <ShowMore>+{more}</ShowMore>
                </ServiceListPopover>
              )}
              {services.slice(0, maxVisible).map(service => (
                <ServiceDetailsPopover
                  showJobs={!isPrivateMode}
                  key={service.id}
                  service={service}
                  onActivate={() =>
                    sendAnalyticsEvent(FEED_HOVER_TOOL_POPOVER, {
                      id: service.id,
                      name: service.name
                    })
                  }
                  onFollowToggle={() => {
                    sendAnalyticsEvent(FEED_CLICK_TOOL_FOLLOW, {
                      state: !service.following ? 'follow' : 'unfollow',
                      id: service.id,
                      name: service.name,
                      location: FEED_CLICK_TOOL_FOLLOW_LOCATION_TOOL_POPOVER
                    });
                  }}
                >
                  <ServiceTile
                    size={SMALL}
                    name={service.name}
                    href={service.canonicalUrl}
                    imageUrl={service.imageUrl}
                  />
                </ServiceDetailsPopover>
              ))}
            </Services>
            <FlagContainer>
              {currentUser && currentUser.canIModerate && (
                <Flag
                  itemId={id}
                  itemType={FEED_CLICK_CARD_TYPE_ARTICLE}
                  flagged={flagged}
                  analyticsPayload={analyticsPayload}
                />
              )}
            </FlagContainer>
          </MetaPanel>
        </MetaPanelWrapper>
      </Container>
    );
  }
}

export default compose(
  withAnalyticsPayload({type: 'article'}),
  withSendAnalyticsEvent,
  withTrackEngagement,
  withCurrentUser
)(ArticleCard);
