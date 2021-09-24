import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import timeStamp from '../../../../shared/utils/timestamp';
import {CATHEDRAL, WHITE, ASH} from '../../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {FEED_CLICK_CARD_USER} from '../../constants/analytics';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {LIGHT, DARK} from '../../constants/utils';
import {ID} from '../../../../shared/utils/graphql';
import PrivatePublicIndicator from '../../../../shared/library/private-public-indicator';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column'
});

const Link = glamorous.a(({theme}) => ({
  color: theme === LIGHT ? CATHEDRAL : WHITE,
  ':hover': {
    color: theme === LIGHT ? CATHEDRAL : ASH
  },
  ':visited': {
    color: theme === LIGHT ? CATHEDRAL : WHITE
  }
}));

export const Name = glamorous(Link)({
  textDecoration: 'none',
  ...BASE_TEXT,
  fontSize: 18,
  fontWeight: WEIGHT.BOLD,
  letterSpacing: 0.3
});

const ByLine = glamorous.div({
  ...BASE_TEXT,
  letterSpacing: 0.2,
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap'
});

const DotSpan = glamorous.span({
  padding: '0 5px'
});

const Permalink = glamorous(Link)();

export class AuthorDetails extends Component {
  static propTypes = {
    sendAnalyticsEvent: PropTypes.func,
    user: PropTypes.shape({
      id: ID,
      displayName: PropTypes.string,
      username: PropTypes.string,
      title: PropTypes.string,
      imageUrl: PropTypes.string,
      path: PropTypes.string,
      companyName: PropTypes.string
    }),
    theme: PropTypes.oneOf([LIGHT, DARK]),
    publishedAt: PropTypes.string,
    permalink: PropTypes.string,
    isPrivate: PropTypes.bool,
    showDate: PropTypes.bool,
    privateMode: PropTypes.any
  };

  static defaultProps = {
    theme: DARK,
    showDate: true
  };

  render() {
    const {user, publishedAt, theme, permalink, isPrivate, showDate, privateMode} = this.props;
    const {title, companyName, path, username, id, displayName} = user;
    return (
      <Container>
        <Name
          href={path}
          rel="author"
          title={displayName}
          target="_blank"
          theme={theme}
          onClick={() =>
            this.props.sendAnalyticsEvent(FEED_CLICK_CARD_USER, {
              username: username,
              userId: id
            })
          }
        >
          {displayName}
        </Name>
        <ByLine>
          {title} {title && companyName ? 'at' : ''} {companyName}
          {(title || companyName) && showDate ? <DotSpan>{'\u00b7'}</DotSpan> : ''}
          {showDate && (
            <Permalink href={permalink} theme={theme}>
              <time>{timeStamp(publishedAt)}</time>
            </Permalink>
          )}
          {showDate && isPrivate && <DotSpan>{'\u00b7'}</DotSpan>}
          {isPrivate && privateMode && <PrivatePublicIndicator typeIndicator="PrivateLock" />}
          {!isPrivate && privateMode && <PrivatePublicIndicator typeIndicator="PublicWorld" />}
        </ByLine>
      </Container>
    );
  }
}

export default compose(
  withAnalyticsPayload({type: 'decision'}),
  withSendAnalyticsEvent
)(AuthorDetails);
