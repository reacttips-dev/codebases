import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CHARCOAL, GUNSMOKE, MAKO} from '../../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {
  Container,
  TitlePanel,
  MetaPanel,
  MetaPanelWrapper,
  Services
} from '../article-card/article-card';
import {CardMetadata} from '../featured-post-card/featured-post-card';
import ComparisonTagIcon from './icons/comparison-tag-icon.svg';
import Alternative from './alternative';
import ServiceTile, {SMALL} from '../../../../shared/library/tiles/service.jsx';
import ServiceDetailsPopover from '../shared/service-details';
import Share from '../article-card/buttons/share.jsx';
import SharePopover from '../../../../shared/library/popovers/share/index';
import {DEACTIVATE_MODE_CLICK} from '../../../../shared/library/popovers/base';
import {
  FEED_DWELL_CARD,
  FEED_CLICK_CARD,
  FEED_CLICK_CARD_SOURCE_CARD,
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
import {PHONE} from '../../../../shared/style/breakpoints';

export const ClickableCard = glamorous.a({
  width: '100%',
  textDecoration: 'none'
});

const Title = glamorous.div({
  display: 'block',
  textDecoration: 'none',
  ...BASE_TEXT,
  fontSize: 20,
  fontWeight: WEIGHT.BOLD,
  WebkitFontSmoothing: 'auto !important',
  letterSpacing: 0.3,
  color: CHARCOAL,
  marginBottom: 5
});

export const ComparisonTag = glamorous.div({
  display: 'flex'
});

export const FunctionName = glamorous.div({
  ...BASE_TEXT,
  fontSize: 12,
  letterSpacing: 0.2,
  color: MAKO,
  textDecoration: 'none',
  marginLeft: 10
});

const Alternatives = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 27,
  marginBottom: 7,
  [PHONE]: {
    justifyContent: 'space-around'
  }
});

const ComparatorWrapper = glamorous.div({
  height: 59,
  display: 'flex',
  alignItems: 'center'
});

const Comparator = glamorous.div({
  ...BASE_TEXT,
  borderRadius: '50%',
  width: 30,
  height: 30,
  marginLeft: 41,
  marginRight: 41,
  fontSize: 15,
  color: GUNSMOKE,
  border: `1px solid ${ASH}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [PHONE]: {
    margin: 0
  }
});

export class StackupCard extends Component {
  static propTypes = {
    sendAnalyticsEvent: PropTypes.func,
    functionName: PropTypes.string,
    title: PropTypes.string,
    path: PropTypes.string,
    services: PropTypes.array,
    isPrivateMode: PropTypes.bool
  };

  componentDidMount() {
    this.dwellTracker = new DwellTracker(this._el, time =>
      this.props.sendAnalyticsEvent(FEED_DWELL_CARD, {time})
    );
  }

  render() {
    const {services, title, functionName, path} = this.props;
    return (
      <Container innerRef={el => (this._el = el)}>
        <ClickableCard
          href={path}
          target="_blank"
          onClick={() =>
            this.props.sendAnalyticsEvent(FEED_CLICK_CARD, {
              clickSource: FEED_CLICK_CARD_SOURCE_CARD
            })
          }
        >
          <TitlePanel>
            <Title>{title}</Title>
            <CardMetadata>
              <ComparisonTag>
                <ComparisonTagIcon />
              </ComparisonTag>
              {functionName !== null && <FunctionName>{`/ ${functionName}`}</FunctionName>}
            </CardMetadata>
            <Alternatives>
              {services.map((service, i) => (
                <React.Fragment key={service.id}>
                  <Alternative
                    name={service.name}
                    imageUrl={service.imageUrl}
                    stacks={service.stacks}
                  />
                  {i !== services.length - 1 && (
                    <ComparatorWrapper>
                      <Comparator>VS</Comparator>
                    </ComparatorWrapper>
                  )}
                </React.Fragment>
              ))}
            </Alternatives>
          </TitlePanel>
        </ClickableCard>
        <MetaPanelWrapper>
          <MetaPanel>
            <SharePopover
              url={DOMAIN + path}
              title={title}
              analyticsEventName={FEED_CLICK_CARD_SHARE}
              deactivateMode={DEACTIVATE_MODE_CLICK}
            >
              <Share />
            </SharePopover>
            <Services>
              {services.map(service => (
                <ServiceDetailsPopover
                  key={service.id}
                  showJobs={!this.props.isPrivateMode}
                  service={service}
                  onActivate={() =>
                    this.props.sendAnalyticsEvent(FEED_HOVER_TOOL_POPOVER, {
                      id: service.id,
                      name: service.name
                    })
                  }
                  onFollowToggle={() => {
                    this.props.sendAnalyticsEvent(FEED_CLICK_TOOL_FOLLOW, {
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
  withAnalyticsPayload({type: 'stackup'}),
  withSendAnalyticsEvent
)(StackupCard);
