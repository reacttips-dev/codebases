import PropTypes from 'prop-types';
import React from 'react';
import { APP_STORE_STARS, APP_STORE_RATING_COUNTS } from 'bundles/mobile/common/constants';
import 'css!bundles/mobile/components/__styles__/MobilePromoRatings';

class MobilePromoRatings extends React.Component {
  static propTypes = {
    userAgent: PropTypes.object.isRequired,
    showReviewCount: PropTypes.bool,
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'userAgent' does not exist on type 'Reado... Remove this comment to see the full error message
    const { userAgent, showReviewCount } = this.props;
    if (!userAgent.isIOS && !userAgent.isAndroid) {
      return null;
    }
    const platform = userAgent.isAndroid ? 'android' : 'ios';
    const numStars = Math.round(APP_STORE_STARS[platform] * 2) / 2;
    const numReviews = APP_STORE_RATING_COUNTS[platform];
    return (
      <span className="rc-MobilePromoRatings">
        <span className="stars">
          {[1, 2, 3, 4, 5].map((curStar) => {
            const iconKey = `${curStar}~promoRatingsStar`;
            if (numStars + 0.5 < curStar) {
              return <i key={iconKey} className="cif-star-empty" />;
            } else if (numStars + 0.5 === curStar) {
              return <i key={iconKey} className="cif-star-half-empty" />;
            } else {
              return <i key={iconKey} className="cif-star" />;
            }
          })}
        </span>
        {showReviewCount && <span className="review-count">{`(${numReviews}+)`}</span>}
      </span>
    );
  }
}

export default MobilePromoRatings;
