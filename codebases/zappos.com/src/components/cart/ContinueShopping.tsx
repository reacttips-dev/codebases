import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import MartyLink from 'components/common/MartyLink';
import { AppState } from 'types/app';
import useMartyContext from 'hooks/useMartyContext';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { buildSeoProductUrl } from 'helpers/SeoUrlBuilder';

import css from 'styles/components/cart/continueShopping.scss';

interface OwnProps {
  onCartContinueShoppingClick?: (...args: any[]) => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export const ContinueShopping = (props: Props) => {
  const { testId } = useMartyContext();
  const {
    onCartContinueShoppingClick,
    landingPage: {
      isLoaded: isLandingLoaded,
      brandId,
      pageInfo: {
        pageType = undefined
      } = {},
      pageName
    },
    product: {
      detail
    },
    products: {
      totalProductCount: isSearchLoaded,
      executedSearchUrl
    }
  } = props;

  const makeUrl = () => {
    // has search been visited?
    if (isSearchLoaded) {
      return executedSearchUrl;
    }

    // has landing page been visited, and are those major landing or brand page?
    if (isLandingLoaded && (pageType === 'Landing' || pageType === 'Brand')) {
      if (pageName) {
        return `/c/${pageName}`;
      }

      // if its not a major brand landing page, take you back to that generic brand page
      if (brandId) {
        return `/brand/${brandId}`;
      }
    }

    // has product page been loaded?
    if (detail) {
      return buildSeoProductUrl(detail);
    }

    return '/';
  };

  return (
    <MartyLink
      onClick={onCartContinueShoppingClick}
      to={makeUrl()}
      className={css.continue}
      data-test-id={testId('continueShopping')}>
      Continue Shopping
    </MartyLink>
  );
};

export const mapStateToProps = (state: AppState) => {
  const {
    landingPage,
    product,
    products
  } = state;

  return {
    landingPage,
    product,
    products
  };
};

const connector = connect(mapStateToProps);
const ConnectedContinueShopping = connector(ContinueShopping);
export default withErrorBoundary('ContinueShopping', ConnectedContinueShopping);
