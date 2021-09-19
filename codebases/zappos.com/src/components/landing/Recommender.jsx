import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';

import { evRecommendationClick, evRecommendationImpressionWrapper } from 'events/recommendations';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { track } from 'apis/amethyst';
import { buildRecosKey } from 'helpers/RecoUtils';
import marketplace from 'cfg/marketplace.json';
import MelodyCarousel from 'components/common/MelodyCarousel';
import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';

import css from 'styles/components/landing/recommender.scss';

const { search: { msaImageParams } } = marketplace;
export class Recommender extends Component {
  componentDidUpdate() {
    const { recos, slotDetails } = this.props;
    const key = buildRecosKey(slotDetails);
    if (recos.janus?.[key]?.recos?.length && recos.isLoading === false) {
      const recommendationImpression = [{
        numberOfRecommendations: recos.janus[key].recos.length,
        recommendationType: 'PRODUCT_RECOMMENDATION',
        recommendationSource: 'EP13N',
        widgetType: 'SIMILAR_PRODUCT_WIDGET'
      }];
      track(() => ([evRecommendationImpressionWrapper, { recommendationImpression }]));
    }
  }

  render() {
    const { slotName, slotDetails, onComponentClick, recos: { janus = {} }, slotHeartsData } = this.props;
    const { title, widget, monetateId } = slotDetails;
    const { testId } = this.context;
    const janusEntry = janus[buildRecosKey(slotDetails, widget)];
    if (janusEntry) {
      const { recos = [], title: p13nTitle } = janusEntry;
      if (recos.length > 0) {
        return (
          <div
            className={css.recommender}
            data-slot-id={slotName}
            data-monetate-id={monetateId}
            data-test-id={testId('recoCarousel')}>
            <h2 data-test-id={testId('recommenderTitle')}>{title || p13nTitle}</h2>
            <MelodyCarousel>
              {recos.map((reco, index) => <MelodyCardProduct
                msaImageParams={msaImageParams}
                cardData={reco}
                componentStyle="recommender"
                eventLabel="Recommender"
                melodyCardTestId="recommenderProduct"
                onComponentClick={e => {
                  onComponentClick(e);
                  track(() => ([
                    evRecommendationClick, {
                      index,
                      recommendationType: 'PRODUCT_RECOMMENDATION',
                      recommendationValue: reco.productId,
                      RecommendationSource: 'EP13N',
                      widgetType: 'UNKNOWN_RECOMMENDATION_WIDGET'
                    }
                  ]));
                }}
                key={index}
                heartsData={slotHeartsData} />)}
            </MelodyCarousel>
          </div>
        );
      }
    }
    // No recos.
    return null;
  }
}

function mapStateToProps(state) {
  return {
    recos: state.recos
  };
}

Recommender.contextTypes = {
  testId: PropTypes.func.isRequired
};

const ConnectedRecommender = connect(mapStateToProps, {})(Recommender);
export default withErrorBoundary('Recommender', ConnectedRecommender);
