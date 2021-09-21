import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SponsorshipsPageScreen from './SponsorshipsPageScreen';
import { receivePageMetadata as receivePageMetadataImport } from '../../pageMetadata';

const mapDispatchToProps = dispatch => ({
  receivePageMetadata: metadata =>
    dispatch(receivePageMetadataImport(metadata)),
});

const FACEBOOK_SOCIAL_IMAGE =
  'https://d12xoj7p9moygp.cloudfront.net/images/social/opengraph-sponsorships.png';
const TWITTER_SOCIAL_IMAGE =
  'https://d12xoj7p9moygp.cloudfront.net/images/social/opengraph-twitter-sponsorships.png';

class SponsorshipsPageScreenContainer extends React.Component {
  UNSAFE_componentWillMount() {
    const { receivePageMetadata } = this.props;
    receivePageMetadata({
      title: 'Anchor Sponsorships',
      description: 'A new world for podcast advertising.',
      image: FACEBOOK_SOCIAL_IMAGE,
      twitterImage: TWITTER_SOCIAL_IMAGE,
    });
  }

  render() {
    return <SponsorshipsPageScreen {...this.props} />;
  }
}

SponsorshipsPageScreenContainer.propTypes = {
  receivePageMetadata: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(SponsorshipsPageScreenContainer);
