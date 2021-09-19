import cn from 'classnames';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import InstagramPic from './InstagramPic';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { fetchInstagramPics } from 'actions/landing/instagram';
import { landing, links } from 'cfg/marketplace.json';
import { Loader } from 'components/Loader';

import css from 'styles/components/landing/instagram.scss';

export class Instagram extends Component {
  componentDidMount() {
    const { fetchInstagramPics, slotDetails } = this.props;

    // for backwards-compatibility: old busted jawn calls UGC client-side; new hotness where ZCS calls UGC server-side
    fetchInstagramPics(slotDetails.images && { success: true, message: slotDetails.images });
  }

  makeInstagramPics() {
    const { instagram: { instagramData: { instaImages } }, onComponentClick, shouldLazyLoad, slotDetails: { limit } } = this.props;
    const { instagramComponent: { numberOfImages } } = landing;
    const maxImages = limit || numberOfImages;

    return instaImages
      .slice(0, maxImages)
      .map((m, i) => {
        const { createdTime } = m;
        return <InstagramPic
          className={css.instagramPic}
          key={createdTime}
          index={i}
          imageDetails={m}
          onComponentClick={onComponentClick}
          shouldLazyLoad={shouldLazyLoad}/>;
      });
  }

  render() {
    const { isLoading, slotName, slotIndex, slotDetails, onComponentClick, instagram: { instagramData } } = this.props;
    if (!isLoading) {
      const { maintext, ctalink, monetateId } = slotDetails;
      const { instagramLink } = links.social;
      // we aren't using <Link> because social links are absolute urls
      if (instagramData.instaImages?.length > 0) {
        const instagramTile = <a
          className={css.instagramPic}
          href={ctalink || instagramLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onComponentClick}
          data-eventlabel="Instagram"
          data-slotindex={slotIndex}
          data-eventvalue="instagramtitle">
          <div className={css.innerTile}>
            <h2 className={cn(css.instaTileElement, css.heading)}>{maintext}</h2>
            <div>
              <p className={cn(css.instaTileElement, css.instaTileBtn)}>@{slotDetails.handle}</p>
            </div>
          </div>
        </a>;

        return (
          <div
            className={css.instagramWrapper}
            data-slot-id={slotName}
            data-monetate-id={monetateId}
            role="list"
          >
            {instagramTile}
            {this.makeInstagramPics()}
          </div>
        );
      } else {
        return null;
      }
    } else {
      return <Loader />;
    }
  }
}

Instagram.propTypes = {
  slotDetails: PropTypes.object.isRequired,
  onComponentClick: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    instagram: state.instagram
  };
}

const ConnectedInstagram = connect(mapStateToProps,
  {
    fetchInstagramPics
  })(Instagram);
export default withErrorBoundary('Instagram', ConnectedInstagram);
