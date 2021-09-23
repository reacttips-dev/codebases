import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import QuicksilverAppScreen from './QuicksilverAppScreen';
import { receivePageMetadata as receivePageMetadataImport } from '../../pageMetadata';
import { FACEBOOK_SOCIAL_IMAGE, TWITTER_SOCIAL_IMAGE } from './constants';

const mapDispatchToProps = dispatch => ({
  receivePageMetadata: metadata =>
    dispatch(receivePageMetadataImport(metadata)),
});

class QuicksilverAppScreenContainer extends React.Component {
  UNSAFE_componentWillMount() {
    const { receivePageMetadata } = this.props;
    receivePageMetadata({
      title: 'Make your own podcast.',
      description:
        "Now it's easy to get heard on Spotify with our new podcast creation app, Anchor.",
      image: FACEBOOK_SOCIAL_IMAGE,
      twitterImage: TWITTER_SOCIAL_IMAGE,
    });
  }

  render() {
    return <QuicksilverAppScreen {...this.props} />;
  }
}

QuicksilverAppScreenContainer.propTypes = {
  receivePageMetadata: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(QuicksilverAppScreenContainer);
