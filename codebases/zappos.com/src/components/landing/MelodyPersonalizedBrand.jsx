import { Component } from 'react';
import { connect } from 'react-redux';

import { MartyContext } from 'utils/context';
import { evRecommendationClick } from 'events/recommendations';
import { track } from 'apis/amethyst';
import VipOnlyLogo from 'components/icons/vipDashboard/VipOnlyLogo';
import MelodyCarousel from 'components/common/MelodyCarousel';
import MelodyCardCategory from 'components/common/melodyCard/MelodyCardCategory';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/landing/melodyPersonalizedBrand.scss';

const widgetType = 'BRAND_RECOMMENDATION_WIDGET';
const recommendationSource = 'ZAPPOS_DATA_SCIENCE';
const recommendationType = 'BRAND_RECOMMENDATION';

export class MelodyPersonalizedBrand extends Component {
  handleClick = (e, index, id) => {
    const { onComponentClick } = this.props;
    onComponentClick(e);
    track(() => ([
      evRecommendationClick, {
        index,
        recommendationType,
        recommendationValue: id,
        recommendationSource,
        widgetType
      }
    ]));
  };

  makeHeadingText = isTrending => {
    const { firstName } = this.props;
    if (isTrending) {
      return 'Trending Brands';
    }
    return firstName ?
      `${firstName}, You Might Like These Brands` :
      'Brands For You';
  };

  makeBrandPromo = () => (
    <p className={css.brandPromo}>
      <VipOnlyLogo />
      Bonus Points
    </p>
  );

  render() {
    return (
      <MartyContext.Consumer>
        { ({ marketplace }) => {
          const {
            slotName,
            slotDetails: { brands, monetateId },
            shouldLazyLoad
          } = this.props;
          const { desktopBaseUrl, hasRewardsTransparency } = marketplace;

          if (brands && brands.length) {
            const recoSource = brands[0].recommendationSource;
            const isTrending = recoSource && recoSource === 'TRENDING_BRANDS';

            return (
              <div className={css.wrap} data-slot-id={slotName} data-monetate-id={monetateId}>
                <h2 className={css.heading}>
                  {this.makeHeadingText(isTrending)}
                </h2>
                <MelodyCarousel>
                  {brands.map((brand, index) => {
                    const { headerImageUrl, name, cleanName, id, brandUrl, brandPromo } = brand;
                    const link = brandUrl || `/search/null/filter/brandNameFacet/${encodeURIComponent(name)}`;
                    const cardData = {
                      image: `${desktopBaseUrl}${headerImageUrl}`,
                      name,
                      alt: name,
                      gae: cleanName,
                      link
                    };

                    return (
                      <MelodyCardCategory
                        cardData={cardData}
                        eventLabel="melodyPersonalizedBrand"
                        melodyCardTestId="melodyPersonalizedBrand"
                        onComponentClick={e => {
                          this.handleClick(e, index, id);
                        }}
                        shouldLazyLoad={shouldLazyLoad}
                        key={id}>
                        { (brandPromo && hasRewardsTransparency) && this.makeBrandPromo() }
                      </MelodyCardCategory>
                    );
                  })}
                </MelodyCarousel>
              </div>
            );
          }
          return false;
        }}
      </MartyContext.Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    firstName: state.holmes.firstName
  };
}

const ConnectedMelodyPersonalizedBrand = connect(mapStateToProps, {})(MelodyPersonalizedBrand);
export default withErrorBoundary('MelodyPersonalizedBrand', ConnectedMelodyPersonalizedBrand);
