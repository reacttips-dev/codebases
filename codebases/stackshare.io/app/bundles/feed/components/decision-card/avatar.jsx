import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {FEED_CLICK_CARD_USER} from '../../constants/analytics';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {ID} from '../../../../shared/utils/graphql';
import LazyLoadImage from '../../../../shared/utils/lazy-loading-images';

const Container = glamorous.a({
  height: 50,
  marginRight: 15
});

const Image = glamorous.img({
  height: 50,
  width: 50,
  borderRadius: '50%'
});

export class Avatar extends Component {
  static propTypes = {
    sendAnalyticsEvent: PropTypes.func,
    user: PropTypes.shape({
      id: ID,
      displayName: PropTypes.string,
      username: PropTypes.string,
      title: PropTypes.string,
      imageUrl: PropTypes.string,
      thumbUrl: PropTypes.string,
      path: PropTypes.string,
      companyName: PropTypes.string
    }),
    lazyLoad: PropTypes.bool
  };

  static defaultProps = {
    lazyLoad: true
  };

  render() {
    const {user, lazyLoad} = this.props;
    const image = user.thumbUrl ? user.thumbUrl : user.imageUrl;
    return (
      <Container
        href={user.path}
        target="_blank"
        onClick={() =>
          this.props.sendAnalyticsEvent(FEED_CLICK_CARD_USER, {
            username: user.username,
            userId: user.id
          })
        }
      >
        {lazyLoad ? (
          <LazyLoadImage>
            <Image src={image} alt={`Avatar of ${user.username}`} height={50} width={50} />
          </LazyLoadImage>
        ) : (
          <Image src={image} alt={`Avatar of ${user.username}`} height={50} width={50} />
        )}
      </Container>
    );
  }
}

export default compose(
  withAnalyticsPayload({type: 'decision'}),
  withSendAnalyticsEvent
)(Avatar);
