import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import ServiceTile, {MICRO} from '../../tiles/service';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import {
  CHARCOAL,
  FOCUS_BLUE,
  ALABASTER,
  ASH,
  CATHEDRAL,
  WHITE,
  SHADOW
} from '../../../style/colors';
import Avatar from '../../avatars/avatar';
import {ALPHA} from '../../../style/color-utils';
import LinkIcon from './icons/link-icon.svg';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
import {STACKUPS_DECISIONS_TOGGLE} from '../../../../bundles/stackups/constants/analytics';
import {ID} from '../../../utils/graphql';
import {formatCount} from '../../../utils/format';
import PrivatePublicIndicator from '../../private-public-indicator';
import timeStamp from '../../../../shared/utils/timestamp';
import {
  POST_TYPE_DESCRIPTIONS,
  POST_TYPE_ICONS,
  POST_TYPE_FREEFORM
} from '../../../../shared/library/cards/post/constants';
import {taggableStack} from '../../composer/utils';
import {renderContext, renderRelationsip} from '../../../../shared/library/cards/post/index.jsx';

const CONTEXT_MARGIN = 7;

const Label = glamorous.div({
  ...BASE_TEXT,
  color: CHARCOAL,
  fontSize: 16,
  letterSpacing: 0.2,
  fontWeight: WEIGHT.BOLD
});

const StyledLinkIcon = glamorous(LinkIcon)({
  marginRight: 5
});

const HeaderPanel = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const Set = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  '>:first-child': {
    marginRight: 5
  },
  marginRight: 15,
  marginBottom: 10
});

const BodyContent = glamorous.div();

const UserPanel = glamorous.div({
  display: 'flex',
  padding: '20px 0',
  width: '100%'
});

const UserName = glamorous.div({
  fontWeight: 'bold',
  fontSize: 14,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between'
});

const UserDetail = glamorous.div({
  marginLeft: 15,
  width: '100%',
  ' a': {
    color: CHARCOAL
  },
  ' a:hover': {
    color: FOCUS_BLUE
  }
});

const AvatarWrapper = glamorous.div({
  marginTop: 5
});

const UserInfo = glamorous.div({
  color: CATHEDRAL
});

const Container = glamorous.div({
  ...BASE_TEXT,
  lineHeight: 1.7,
  letterSpacing: 0.2,
  borderBottom: '1px solid',
  borderColor: ASH,
  padding: '10px 0 20px 0',
  width: '100%'
});

export const ToggleContent = glamorous.a({
  ...BASE_TEXT,
  width: '100%',
  textAlign: 'center',
  textDecoration: 'underline',
  fontSize: 13,
  lineHeight: 5 / 3,
  cursor: 'pointer',
  color: CHARCOAL,
  ':hover': {
    color: CHARCOAL,
    textDecoration: 'none'
  }
});

const Link = glamorous.a({});

const BlogLink = glamorous.div({
  margin: '15px 0',
  borderTop: `solid 1px ${ASH}`,
  borderBottom: `solid 1px ${ASH}`,
  padding: '15px 0',
  ' a': {
    color: CHARCOAL,
    textDecoration: 'underline'
  }
});

const Content = glamorous.div({
  ' .topic, .tool': {
    fontWeight: 'normal',
    background: ALPHA(FOCUS_BLUE, 0.15),
    padding: '0px 2px'
  },
  ' a, a:visited': {
    color: FOCUS_BLUE,
    textDecoration: 'underline',
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  ' pre': {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    background: ALABASTER,
    color: CHARCOAL,
    margin: '15px 0',
    fontFamily: 'monospace',
    padding: 10,
    borderRadius: 0
  },
  ' code': {
    borderRadius: 0,
    background: ALABASTER,
    color: CHARCOAL
  }
});

const DecisionContent = glamorous.div(
  {
    height: 3 * 25, // 3 lines of text
    position: 'relative',
    overflow: 'hidden'
  },
  ({expanded}) => ({
    height: expanded ? 'auto' : 3 * 25,
    ':after': expanded
      ? null
      : {
          content: ' ',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 30,
          background: `linear-gradient(to bottom, ${ALPHA(WHITE, 0)}, ${WHITE} 80%)`
        }
  })
);

const Context = glamorous.div({
  width: '100%',
  marginTop: 0,
  marginBottom: 18,
  display: 'flex',
  alignItems: 'center',
  ...BASE_TEXT,
  flexWrap: 'wrap',
  ' > svg:first-of-type': {
    marginRight: CONTEXT_MARGIN
  },
  ' > a': {
    textDecoration: 'none',
    marginRight: CONTEXT_MARGIN
  },
  ' > a:last-of-type': {
    textDecoration: 'none',
    marginRight: 0
  },
  ' > *': {
    marginBottom: 13
  },
  ' > a > span:last-of-type': {
    fontSize: 14
  }
});

const Noun = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  fontWeight: WEIGHT.BOLD,
  color: SHADOW,
  marginRight: CONTEXT_MARGIN
});

export class AlternateDecisionCard extends Component {
  static propTypes = {
    publicId: PropTypes.string,
    user: PropTypes.object,
    publishedAt: PropTypes.string,
    upvotesCount: PropTypes.number,
    private: PropTypes.bool,
    viewCount: PropTypes.number,
    htmlContent: PropTypes.string,
    services: PropTypes.array,
    topics: PropTypes.array,
    id: ID,
    position: PropTypes.number,
    company: PropTypes.object,
    sendAnalyticsEvent: PropTypes.func,
    link: PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string
    }),
    decisionType: PropTypes.any,
    fromTools: PropTypes.array,
    subjectTools: PropTypes.array,
    toTools: PropTypes.array,
    stack: PropTypes.object
  };

  state = {
    expanded: false,
    truncated: true,
    sendAnalytics: false,
    toggle: false
  };

  container = null;
  assignContainer = el => (this.container = el);

  sendAnalyticsData = (analyticsEventName, toggleStatus = false, expandedStatus = true) => {
    const {
      htmlContent,
      id,
      position,
      services,
      topics,
      user,
      company,
      sendAnalyticsEvent
    } = this.props;
    const userId = user.id;
    const companyName = company ? company.name : null;
    const servicesList = services.map(s => s.name);
    const topicList = topics.map(t => t.name);
    const expanded = expandedStatus;
    const toggle = toggleStatus;
    sendAnalyticsEvent(analyticsEventName, {
      htmlContent,
      id,
      position,
      servicesList,
      topicList,
      userId,
      companyName,
      expanded,
      toggle
    });
  };

  componentDidMount() {
    if (this.container) {
      const {height} = this.container.getBoundingClientRect();
      const actualHeight = this.container.scrollHeight;
      if (actualHeight <= height) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({truncated: true, sendAnalytics: true});
      }
    }
  }

  renderUser() {
    const {user, publishedAt, upvotesCount, viewCount, private: isPrivate, publicId} = this.props;
    const permalink = `/${user.username}/decisions/${publicId}`;

    return (
      <UserPanel>
        <AvatarWrapper>
          <Avatar user={user} size={31} />
        </AvatarWrapper>
        <UserDetail>
          <UserName>
            {user.displayName}
            {isPrivate && <PrivatePublicIndicator typeIndicator="BlueRoundLarge" />}
          </UserName>
          <UserInfo>
            {user.title ? user.title : ''}
            {user.companyName ? ` at ${user.companyName}` : ''}
            {user.title || user.companyName ? ` \u00b7 ` : ''}
            <Link href={permalink}>
              <time>{`${timeStamp(publishedAt)}`}</time>{' '}
              {`\u007c ${upvotesCount} ${
                upvotesCount > 1 ? 'upvotes' : 'upvote'
              } \u00b7 ${formatCount(viewCount)} views`}
            </Link>
          </UserInfo>
        </UserDetail>
      </UserPanel>
    );
  }

  renderServices() {
    return this.props.services.map(s => {
      const serviceImage = s.thumbUrl ? s.thumbUrl : s.imageUrl;
      return (
        <Set key={s.name}>
          <ServiceTile size={MICRO} imageUrl={serviceImage} name={s.name} />
          <Label>{s.name}</Label>
        </Set>
      );
    });
  }

  renderTopics() {
    return this.props.topics.map(t => (
      <Set key={t.name}>
        <Label>#{t.name}</Label>
      </Set>
    ));
  }

  handleToggleContent = () => {
    this.setState({expanded: !this.state.expanded});
  };

  handleToggleClick = () => {
    if (!this.state.expanded) {
      this.sendAnalyticsData(STACKUPS_DECISIONS_TOGGLE, true);
    } else {
      this.sendAnalyticsData(STACKUPS_DECISIONS_TOGGLE, true, false);
    }
    this.handleToggleContent();
  };

  handleSeeMoreClick = () => {
    if (!this.state.expanded) {
      this.sendAnalyticsData(STACKUPS_DECISIONS_TOGGLE);
    } else {
      this.sendAnalyticsData(STACKUPS_DECISIONS_TOGGLE, false, false);
    }
    this.handleToggleContent();
  };

  render() {
    const {expanded, truncated} = this.state;
    const {company, decisionType, services, fromTools, subjectTools, toTools, stack} = this.props;
    let postType, postStructure;
    if (!decisionType) {
      postType = POST_TYPE_FREEFORM;
      postStructure = {subjectTools: services};
    } else {
      postType = decisionType;
      postStructure = {fromTools, subjectTools, toTools};
    }

    const taggedStack = stack ? taggableStack(stack) : null;

    return (
      <Container>
        <HeaderPanel>{this.renderUser()}</HeaderPanel>
        <BodyContent>
          {/* <Tags> */}
          {/* {this.renderServices()} */}
          {/* {this.renderTopics()} */}
          <RenderingTopics
            postType={postType}
            postStructure={postStructure}
            company={company}
            taggedStack={taggedStack}
          />
          {/* </Tags> */}
          <DecisionContent innerRef={this.assignContainer} expanded={expanded}>
            <Content
              dangerouslySetInnerHTML={{
                __html: this.props.htmlContent
              }}
            />
            {this.props.link && (
              <BlogLink>
                <React.Fragment>
                  <StyledLinkIcon />
                  <Link href={this.props.link.url} title={this.props.link.title}>
                    {this.props.link.title}
                  </Link>
                </React.Fragment>
              </BlogLink>
            )}
          </DecisionContent>
        </BodyContent>
        {truncated && (
          <ToggleContent onClick={this.handleSeeMoreClick}>
            {expanded ? 'See less' : 'See more'}
          </ToggleContent>
        )}
      </Container>
    );
  }
}

const RenderingTopics = ({postType, postStructure, company, taggedStack}) => {
  return (
    <Context>
      {POST_TYPE_ICONS[postType]}
      <Noun>{POST_TYPE_DESCRIPTIONS[postType]}</Noun>
      {renderRelationsip(postType, postStructure, () => {})}
      {(company || taggedStack) && renderContext({company, stack: taggedStack})}
    </Context>
  );
};

RenderingTopics.propTypes = {
  postType: PropTypes.string,
  postStructure: PropTypes.object,
  company: PropTypes.object,
  taggedStack: PropTypes.object
};

export default withSendAnalyticsEvent(AlternateDecisionCard);
