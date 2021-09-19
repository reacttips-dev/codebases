import LandingPageLink from 'components/landing/LandingPageLink';
import useMartyContext from 'hooks/useMartyContext';
import MelodyGrid from 'components/landing/MelodyGrid';
import MelodyCurated from 'components/landing/MelodyCurated';
import MelodyCarousel from 'components/common/MelodyCarousel';
import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';
import ProductList from 'components/landing/ProductList';
import ProductGrid from 'components/common/ProductGrid';
import ProductCarousel from 'components/common/ProductCarousel';
import ProductResults from 'components/landing/ProductResults';
import ProductImageInline from 'components/landing/ProductImageInline';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { evSearchProductStreamClick, evSearchProductStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/productSearch.scss';

export const ProductSearch = props => {
  const { marketplace: { landing: { hasProductSearchCarousel } } } = useMartyContext();
  const { slotName, slotDetails, onComponentClick, shouldLazyLoad, slotHeartsData } = props;

  if (slotDetails.products?.length > 0) {
    const { style, title, products, monetateId, eventLabel: eventLabelCustom, componentName, gae, ctacopy, ctalink, isCrossSiteSearch, siteName } = slotDetails;
    const eventLabel = eventLabelCustom || style || componentName;
    const commonProps = { ...props, eventLabel, shouldLazyLoad };

    switch (style) {
      case 'melody-grid':
        return <MelodyGrid {...commonProps}/>;
      case 'melody-grid-half':
        return <MelodyGrid {...commonProps} isHalf={true}/>;
      case 'melody-curated':
        return <MelodyCurated {...commonProps}/>;
      case 'image-inline':
        return <ProductImageInline {...commonProps}/>;
      case 'product-list':
        return <ProductList {...commonProps}/>;
      case 'product-grid':
        return <ProductGrid {...commonProps}/>; // Does not support cross site label and modal
      case 'default-results':
        return <ProductResults {...commonProps}/>;
      case 'carousel':
        if (hasProductSearchCarousel) {
          return <ProductCarousel {...commonProps}/>; // Does not support cross site label and modal
        }
        // eslint-disable-next-line no-fallthrough
      default: // style === 'melody' or no style property provided
        return (
          <div className={css.wrap} data-slot-id={slotName} data-monetate-id={monetateId}>
            <h2 className={css.title}>{title}</h2>
            <MelodyCarousel onDidMount={() => track(() => ([evSearchProductStreamImpression, commonProps]))}>
              {products.map((product, index) => <MelodyCardProduct
                cardData={product}
                componentStyle="productSearchNoStyle"
                eventLabel={eventLabel}
                onComponentClick={(evt, product) => {
                  onComponentClick && onComponentClick(evt, product);
                  track(() => ([evSearchProductStreamClick, { ...commonProps, product }]));
                }}
                index={index}
                key={index}
                heartsData={slotHeartsData}
                isCrossSiteSearch={isCrossSiteSearch}
                siteName={siteName}/>)}
            </MelodyCarousel>
            {(ctacopy && ctalink) && <LandingPageLink
              data-eventlabel={eventLabel}
              data-eventvalue={gae || ctacopy}
              className={css.cta}
              onClick={onComponentClick}
              url={ctalink}>
              {ctacopy}
            </LandingPageLink>}
          </div>
        );
    }
  } else {
    return null;
  }
};

export default withErrorBoundary('ProductSearch', ProductSearch);
