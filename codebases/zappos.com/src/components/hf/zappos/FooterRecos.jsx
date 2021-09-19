import { Component } from 'react';

import { evRecommendationClick, evRecommendationImpressionWrapper } from 'events/recommendations';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import Link from 'components/hf/HFLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import MelodyCarousel from 'components/common/MelodyCarousel';
import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';
import { track } from 'apis/amethyst';
import marketplace from 'cfg/marketplace.json';

import css from 'styles/components/hf/zappos/footerRecos.scss';

const { search: { msaImageParams } } = marketplace;

const widgetType = 'YOUR_RECENTLY_VIEWED_WIDGET';
const recommendationSource = 'EP13N';
const recommendationType = 'PRODUCT_RECOMMENDATION';

export class FooterRecos extends Component {
  componentDidMount() {
    const { recos } = this.props;
    const recommendationImpression = [{
      numberOfRecommendations: recos.recs.length,
      recommendationType,
      widgetType,
      recommendationSource
    }];
    track(() => ([
      evRecommendationImpressionWrapper, { recommendationImpression }
    ]));
  }

  render() {
    const { recos, heartsData = {} } = this.props;
    if (recos && recos.recs && recos.recs.length) {
      const { title, recs } = recos;
      return (
        <aside className={css.container} id="martyFooterRecentlyViewed" aria-label={title}>
          <h2>{title}</h2>
          <MelodyCarousel>
            {recs.map((v, index) =>
              <MelodyCardProduct
                onComponentClick={() => {
                  trackEvent('TE_FOOTER_RECENTLY_VIEWED_RECO', v.item_id);
                  trackLegacyEvent('AmazonReco', 'Zappos.footer.vH*pd_vh', v.item_id);
                  track(() => ([
                    evRecommendationClick, {
                      index,
                      recommendationType,
                      recommendationValue: v.item_id,
                      recommendationSource,
                      widgetType
                    }
                  ]));
                }}
                key={`${v.item_id}-${v.imageId}`}
                msaImageParams={msaImageParams}
                cardData={v}
                shouldLazyLoad={true}
                linkElOverride={Link}
                heartsData={heartsData}
              />
            )}
          </MelodyCarousel>
        </aside>
      );
    }
    return null;
  }
}

export default withErrorBoundary('FooterRecos', FooterRecos);
