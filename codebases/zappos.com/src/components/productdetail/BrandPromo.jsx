import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { setInlineBackgroundColor } from 'helpers/LandingPageUtils';

import styles from 'styles/components/productdetail/brandPromo.scss';

export const BrandPromo = ({ data }, { testId }) => {
  if (data === 'no-promo-data') {
    return false;
  }
  const { type, images, bgcolor, link, componentName } = data;
  if (componentName === 'imageGrid') {
    const { src: logoSrc, alt: logoAlt, href: logoHref, title: logoTitle } = images[0];
    const { src: brandSrc } = images[1];
    switch (type) {
      case 'logo-with-image':
        return (
          <div id="moreFromBrand" className={styles.wrap} data-test-id={testId('brandPromo')}>
            <div className={styles.logoContainer} style={setInlineBackgroundColor(bgcolor)}>
              <Link className={styles.logoImg} to={logoHref} data-test-id={testId('brandPromoLogo')}><img src={logoSrc} alt={logoAlt} title={logoTitle} /></Link>
              <Link className={styles.logoButton} to={link} data-test-id={testId('brandPromoButton')}>Explore Brand</Link>
            </div>
            <img
              className={styles.brandImg}
              alt={logoAlt}
              src={brandSrc}
              data-test-id={testId('brandPromoMainImage')}/>
          </div>
        );
      // These other types currently aren't being used (did a search on Symphony)
      // Will create a separate ticket to style these since we need to get pdp dialed up
      case 'logo-without-image':
      case 'square-logo-with-full-image':
      case 'square-logo-with-image':
      case 'square-logo-without-image':
      default:
        return false;
    }
  } else {
    return false;
  }
};

BrandPromo.contextTypes = {
  testId: PropTypes.func.isRequired
};

export default withErrorBoundary('BrandPromo', BrandPromo);
