import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {
  Container,
  Title,
  TitleLink,
  MetaPanel,
  MetaPanelWrapper,
  Services,
  ShowMore
} from '../article-card/article-card';
import Share from '../article-card/buttons/share.jsx';
import StoryTagIcon from './icons/story-tag-icon.svg';
import PromotedStoryTagIcon from './icons/promoted-story-tag-icon.svg';
import ViewsIcon from './icons/views-icon.svg';
import {CHARCOAL, MAKO, TARMAC, CATHEDRAL} from '../../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {formatCount} from '../../../../shared/utils/format';
import ServiceTile, {SMALL} from '../../../../shared/library/tiles/service.jsx';
import ServiceListPopover from '../../../../shared/library/popovers/service-list/index';
import ServiceDetailsPopover from '../shared/service-details';
import SharePopover from '../../../../shared/library/popovers/share/index';
import {DEACTIVATE_MODE_CLICK} from '../../../../shared/library/popovers/base';
import {
  FEED_DWELL_CARD,
  FEED_CLICK_CARD,
  FEED_CLICK_CARD_SOURCE_TITLE,
  FEED_CLICK_CARD_SOURCE_ICON,
  FEED_CLICK_CARD_SOURCE_TYPE,
  FEED_CLICK_CARD_SOURCE_AUTHOR,
  FEED_CLICK_CARD_SHARE,
  FEED_HOVER_TOOL_POPOVER,
  FEED_CLICK_TOOL_FOLLOW,
  FEED_CLICK_TOOL_FOLLOW_LOCATION_TOOL_POPOVER
} from '../../constants/analytics';
import {DOMAIN} from '../../constants/utils';
import DwellTracker from '../../../../shared/utils/dwell-tracker';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {withTrackEngagement} from '../../../../shared/enhancers/stream-analytics-enhancer';
import {PHONE} from '../../../../shared/style/breakpoints';
import {CLICK, DWELL} from '../../constants/stream-analytics';

const LOGO_DIMENSION = 52;

export const IconLink = glamorous.a();

const Icon = glamorous.img({
  height: LOGO_DIMENSION,
  width: LOGO_DIMENSION,
  marginRight: 15,
  flexShrink: 0
});

export const StoryTag = glamorous.a({
  display: 'flex'
});

const Header = glamorous.div({
  boxSizing: 'border-box',
  padding: 20,
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  [PHONE]: {
    padding: 10
  }
});

const TitlePanel = glamorous.div({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

export const CardMetadata = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
});

const Byline = glamorous.span({
  ...BASE_TEXT,
  fontSize: 12,
  letterSpacing: 0.2,
  color: MAKO,
  margin: '0 4px 0 8px'
});

export const Author = glamorous.a({
  ...BASE_TEXT,
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

const Views = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  marginRight: 22
});

const ViewsCount = glamorous.span({
  ...BASE_TEXT,
  color: MAKO,
  marginLeft: 8,
  fontSize: 13
});

const Description = glamorous.div({
  marginTop: 14,
  ...BASE_TEXT,
  fontSize: 15,
  lineHeight: '25px',
  letterSpacing: 0.2,
  color: CATHEDRAL
});

export class FeaturedPostCard extends Component {
  static propTypes = {
    sendAnalyticsEvent: PropTypes.func,
    analyticsPayload: PropTypes.object,
    trackEngagement: PropTypes.func,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    author: PropTypes.string,
    authorPath: PropTypes.string,
    views: PropTypes.number,
    path: PropTypes.string,
    services: PropTypes.array,
    maxVisible: PropTypes.number,
    promoted: PropTypes.bool,
    description: PropTypes.string,
    isPrivateMode: PropTypes.bool
  };

  componentDidMount() {
    this.dwellTracker = new DwellTracker(this._el, time => {
      this.props.sendAnalyticsEvent(FEED_DWELL_CARD, {time});
      const {streamId, cardPosition} = this.props.analyticsPayload;
      this.props.trackEngagement(DWELL, streamId, 20, cardPosition);
    });
  }

  handleClick = clickSource => {
    const {trackEngagement, sendAnalyticsEvent, analyticsPayload} = this.props;
    const {streamId, cardPosition} = analyticsPayload;

    sendAnalyticsEvent(FEED_CLICK_CARD, {clickSource});
    trackEngagement(CLICK, streamId, 70, cardPosition);
  };

  render() {
    const {
      title,
      imageUrl,
      author,
      authorPath,
      views,
      path,
      services,
      maxVisible,
      sendAnalyticsEvent,
      promoted,
      description,
      isPrivateMode
    } = this.props;

    const more = services.length > maxVisible ? services.length - maxVisible : null;
    const showMore = more > 0 && maxVisible > 0;

    return (
      <Container innerRef={el => (this._el = el)}>
        <Header>
          <IconLink
            href={path}
            target="_blank"
            onClick={() => this.handleClick(FEED_CLICK_CARD_SOURCE_ICON)}
          >
            <Icon src={imageUrl} alt="Featured Post Hero Image" />
          </IconLink>
          <TitlePanel>
            <Title>
              <TitleLink
                href={path}
                target="_blank"
                onClick={() => this.handleClick(FEED_CLICK_CARD_SOURCE_TITLE)}
              >
                {title}
              </TitleLink>
            </Title>
            <CardMetadata>
              <StoryTag
                target="_blank"
                href="/featured-posts"
                onClick={() => this.handleClick(FEED_CLICK_CARD_SOURCE_TYPE)}
              >
                {promoted ? <PromotedStoryTagIcon /> : <StoryTagIcon />}
              </StoryTag>
              <Byline>by</Byline>
              <Author
                target="_blank"
                href={authorPath}
                onClick={() => this.handleClick(FEED_CLICK_CARD_SOURCE_AUTHOR)}
              >
                {author}
              </Author>
            </CardMetadata>
            {promoted ? <Description>{description}</Description> : null}
          </TitlePanel>
        </Header>
        <MetaPanelWrapper>
          <MetaPanel>
            {views !== null && (
              <Views>
                <ViewsIcon />
                <ViewsCount>{formatCount(views)}</ViewsCount>
              </Views>
            )}
            <SharePopover
              url={DOMAIN + path}
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
          </MetaPanel>
        </MetaPanelWrapper>
      </Container>
    );
  }
}

export default compose(
  withAnalyticsPayload({type: 'story'}),
  withSendAnalyticsEvent,
  withTrackEngagement
)(FeaturedPostCard);
