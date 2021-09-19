import React from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import SiteAwareMetadata from 'components/SiteAwareMetadata';
import ContinueShopping from 'components/cart/ContinueShopping';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import EmptyBox from 'images/empty-cart.svg';

import css from 'styles/components/cart/emptyCart.scss';

interface EmptyCartProps {
  onLinkClick?: (...args: any[]) => void;
  handleFederatedSignIn?: (...args: any[]) => void;
}

interface Props extends EmptyCartProps {
  isCustomer: boolean;
  className?: string;
  children: React.ReactNode;
}

export const EmptyCustomerCart = ({ onLinkClick }: EmptyCartProps) => {
  const {
    testId,
    marketplace: {
      defaultMeta: { title },
      cart: { cartName, shopWomensUrl, shopMenUrl, shopShoesUrl, shopBrandText }
    }
  } = useMartyContext();
  return (
    <>
      <p>Fill up your {cartName} by checking out all the awesome things you can buy on {title} or by adding items from Your Favorites!</p>
      <div className={css.links}>
        <Link onClick={onLinkClick} to={shopWomensUrl} data-test-id={testId('shopWomens')}>Shop Women's</Link>
        <Link onClick={onLinkClick} to={shopMenUrl} data-test-id={testId('shopMens')}>Shop Men's</Link>
        <Link
          className={css.shoes}
          onClick={onLinkClick}
          to={shopShoesUrl}
          data-test-id={testId('shopShoes')}>Shop Shoes</Link>
        <Link onClick={onLinkClick} to="/c/brands" data-test-id={testId('brandsLink')}>{shopBrandText}</Link>
      </div>
    </>
  );
};

export const EmptyAnonymousCart = ({ onLinkClick, handleFederatedSignIn }: EmptyCartProps) => {
  const {
    testId,
    marketplace: {
      cart: { cartName, shopBrandText },
      defaultMeta: { title },
      hasFederatedLogin
    }
  } = useMartyContext();

  return (
    <>
      <p>Nothing to see here yet! Sign in to see items that you've previously placed in your {cartName} or check out all the awesome things you can buy on {title}!</p>
      <div className={css.links}>
        <Link onClick={hasFederatedLogin ? handleFederatedSignIn : f => f} to={hasFederatedLogin ? '/federated-login' : '/login'} data-test-id={testId('signIn')}>Sign In</Link>
        <Link onClick={onLinkClick} to="/" data-test-id={testId('homeLink')}>Home Page</Link>
        <Link onClick={onLinkClick} to="/c/brands" data-test-id={testId('brandsLink')}>{shopBrandText}</Link>
        <Link onClick={onLinkClick} to="/c/contact-us" data-test-id={testId('contactUs')}>Contact Us</Link>
      </div>
    </>
  );
};

export const EmptyCart = ({ onLinkClick, isCustomer, className, children, handleFederatedSignIn }: Props) => {
  const { testId, marketplace: { cart:{ cartName } } } = useMartyContext();

  return (
    <SiteAwareMetadata>
      <div className={cn(css.container, className)} data-test-id={testId('emptyCart')}>

        <ContinueShopping />

        <h1>My {cartName}</h1>

        { isCustomer
          ? <EmptyCustomerCart onLinkClick={onLinkClick} />
          : <EmptyAnonymousCart onLinkClick={onLinkClick} handleFederatedSignIn={handleFederatedSignIn} />
        }
        <img src={EmptyBox} alt="" />

        { children }
      </div>
    </SiteAwareMetadata>
  );
};

const WithErrorBoundaryEmptyCart = withErrorBoundary('EmptyCart', EmptyCart);
export default WithErrorBoundaryEmptyCart;
