/* eslint css-modules/no-unused-class: [2, { markAsUsed: ['modalContent', 'modalOverlay'] }] */
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { connect, ConnectedProps } from 'react-redux';
import debounce from 'lodash.debounce';
import { Link } from 'react-router';
import cn from 'classnames';

import { AppState } from 'types/app';
import { EmptyObject } from 'types/utility';
import { CartItem as CartItemType, CartResponse } from 'types/mafia';
import useMartyContext from 'hooks/useMartyContext';
import { pageTypeChange } from 'actions/common';
import { setFederatedLoginModalVisibility } from 'actions/headerfooter';
import { CART_PAGE_MODAL } from 'constants/amethystPageTypes';
import { onCartModalClose, onCartView, onViewCartClick } from 'store/ducks/cart/actions';
import {
  fetchCartItems,
  navigateToCheckout,
  showCartModal,
  syncCartLocalStorage
} from 'actions/cart';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import JanusPixel from 'components/common/JanusPixel';
import { ensureNoClass, pluralize } from 'helpers/index';
import { toUSD } from 'helpers/NumberFormats';
import { groupCartItemsBySizePrediction } from 'helpers/CartUtils';
import { isDesktop } from 'helpers/ClientUtils';
import useEvent from 'hooks/useEvent';
import FocusTrap from 'components/common/FocusTrap';
import { SmallLoader } from 'components/Loader';
import CartItem from 'components/cart/CartItem';
import EmptyCart from 'components/cart/EmptyCart';
import CartErrors from 'components/cart/CartErrors';
import RewardsTransparency from 'components/common/RewardsTransparency';

import modalCSS from 'styles/components/common/modal.scss';
import css from 'styles/components/cart/cartModal.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

const isNonEmptyCartObject = (response: CartResponse | EmptyObject): response is CartResponse => (response as CartResponse).activeItems !== undefined;

export const CartModal = (props: PropsFromRedux) => {
  const { testId, router, marketplace } = useMartyContext();
  const { hasFederatedLogin, cart: { restoreEmptyCart, cartName, showFitRecommendations }, checkout: { checkoutUrl } } = marketplace;
  const [sourcePageType, setSourcePageType] = useState();

  const {
    cart: {
      cartObj: cart,
      cartCount,
      loading,
      isLoaded,
      isModalShowing,
      addedStockId
    },
    fetchCartItems,
    syncCartLocalStorage,
    showCartModal,
    setFederatedLoginModalVisibility,
    onCartView,
    onCartModalClose,
    onViewCartClick,
    pageTypeChange,
    isCustomer,
    navigateToCheckout,
    sourcePageType: sourcePageTypeProp
  } = props;

  const {
    activeItems = [],
    savedItems = [],
    subtotal
  } = cart;

  // fetch cart
  useEffect(() => {
    if (!isLoaded) {
      fetchCartItems().then(response => {
        onCartView({ ...response, isCartModal: true });
      });
    } else if (isNonEmptyCartObject(cart)) {
      restoreEmptyCart && syncCartLocalStorage(cart);
      onCartView({ ...cart, isCartModal: true });
    }
  }, [cart, fetchCartItems, isLoaded, syncCartLocalStorage, onCartView, restoreEmptyCart]);

  // cart modal toaster for mobile, or scrolling to top + scroll lock on desktop
  useEffect(() => {
    if (!isDesktop()) {
      setTimeout(() => {
        showCartModal(false);
      }, 5000);
    } else {
      toggleDesktopModal();
    }
    // on unmount remove the scrollLock class to allow scrolling again
    return () => {
      ensureNoClass(document.documentElement, 'scrollLock');
    };
  }, [showCartModal]);

  // on mount
  useEffect(() => {
    setSourcePageType(sourcePageTypeProp);
    pageTypeChange('cartModal');
  }, [pageTypeChange, setSourcePageType, sourcePageTypeProp]);

  useEvent(document.body, 'keydown', ((e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      onHideModal();
    }
  }) as EventListener);

  // when browser is resized, if it's no longer desktop, hide the modal
  useEvent(window, 'resize', useCallback(
    debounce(() => !isDesktop() && showCartModal(false), 500), []
  ));

  // When cart modal is used like an actual modal on desktop, lock scroll of the body and throw aria-hidden on the root element
  // This is skipped on mobile when it is used more as a sticky header confirmation
  const toggleDesktopModal = () => {
    document.documentElement.classList.toggle('scrollLock');
    const root: HTMLElement | null = document.getElementById('root');

    if (root) {
      if (root.hasAttribute('aria-hidden')) {
        root.removeAttribute('aria-hidden');
      } else {
        root.setAttribute('aria-hidden', 'true');
      }
    }
  };

  const onHideModal = () => {
    toggleDesktopModal();
    pageTypeChange(sourcePageType);
    showCartModal(false);
    onCartModalClose();
  };

  const onClickedViewCart = () => {
    onViewCartClick();
    onHideModal();
  };

  const onCheckingOut = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // order below matters, as hiding modal will update pageType before the redirect logic can grab it from state
    navigateToCheckout(router, CART_PAGE_MODAL);
    onHideModal();
  };

  const handleFederatedSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    showCartModal(false);
    setFederatedLoginModalVisibility(true, {
      returnTo: encodeURIComponent(location.pathname)
    });
  };

  const makeEmptyCart = () => (
    <EmptyCart
      onLinkClick={onHideModal}
      className={css.empty}
      isCustomer={isCustomer}
      handleFederatedSignIn={handleFederatedSignIn}
    >
      { !isCustomer &&
          <div className={css.signIn}>
            <Link to={hasFederatedLogin ? '/federated-login' : '/login'} onClick={hasFederatedLogin ? handleFederatedSignIn : undefined} data-test-id={testId('signInButton')}>Sign In</Link>
          </div>
      }
    </EmptyCart>
  );

  const makeCartItems = () => {
    // Create three sets of cartItems, those with both correct and incorrect size predictions, and those without
    const { itemsWithFitRecommended, itemsWithFitNotRecommended, itemsWithNoRecommendationAvailable } = groupCartItemsBySizePrediction(activeItems);
    const numberOfNotRecommended = itemsWithFitNotRecommended.length;
    return (
      <>
        <div className={css.itemContainer}>
          <CartErrors isModal={true} />
          {showFitRecommendations
            ?
              <>
                {Boolean(numberOfNotRecommended) &&
                  <div className={css.fitNotRecommended}>
                    <p className={css.fitCallout}>{numberOfNotRecommended === 1 ? 'This' : 'These'} {pluralize('size', numberOfNotRecommended)} might not fit you!</p>
                    <p>Our handy-dandy sizing feature suggests that {pluralize('this', numberOfNotRecommended)} {pluralize('size', numberOfNotRecommended)} might not be the best fit for you.</p>
                    {itemsWithFitNotRecommended.map((item: CartItemType) =>
                      <CartItem
                        className={css.item}
                        item={item}
                        isModal={true}
                        key={item.cartItemId}
                        allowAdjustQuantity={false}
                      />
                    )}
                  </div>
                }
                {itemsWithFitRecommended.map((item: CartItemType) =>
                  <CartItem
                    className={css.item}
                    item={item}
                    isModal={true}
                    isRecommendedFit={true}
                    key={item.cartItemId}
                  />
                )}
                {itemsWithNoRecommendationAvailable.map((item: CartItemType) =>
                  <CartItem
                    className={css.item}
                    item={item}
                    isModal={true}
                    key={item.cartItemId}
                  />
                )}
              </>
            :
              <>
                {activeItems.map(item => {
                  const { cartItemId } = item;
                  return <CartItem
                    className={css.item}
                    item={item}
                    isModal={true}
                    key={cartItemId} />;
                })}
              </>
          }
          {savedItems?.map(item =>
            <CartItem
              className={css.item}
              item={item}
              isModal={true}
              isUnavailable={true}
              key={item.cartItemId} />
          )}
        </div>

        { makeCartFooter() }
      </>
    );
  };

  const makeHeader = () => (
    <p className={css.header} id="modalDescription" data-test-id={testId('cartModalHeader')}>
      { addedStockId
        ? <><span className={css.check} /> Added to {cartName}</>
        : `My ${cartName}`
      }
    </p>
  );

  const makeCartFooter = () => (
    <div className={css.footer}>
      <p className={css.subtotal}>
        <span data-test-id={testId('cartQuantity')}>{cartName} Subtotal ({cartCount} {pluralize('item', cartCount)})</span>
        { subtotal && <span data-test-id={testId('subtotal')}>{toUSD(subtotal.amount)}</span> }
      </p>

      <form onSubmit={onCheckingOut} action={`${checkoutUrl}/initiate`} method="post">
        <Link
          to="/cart"
          onClick={onClickedViewCart}
          className={css.secondaryCTA}
          data-test-id={testId('viewCart')}>View {cartName}</Link>

        <button
          type="submit"
          disabled={loading}
          className={css.primaryCTA}
          data-test-id={testId('proceedToCheckout')}>{ loading ? 'Updating...' : 'Proceed to Checkout'}</button>
      </form>
    </div>
  );

  const makeJanusPixel = () => {
    const addedProduct = activeItems?.find(item => item.stockId === addedStockId);

    if (!addedProduct) {
      return null;
    }

    const { stockId, styleId } = addedProduct;

    const queryParams = {
      teen: styleId,
      child: stockId,
      widget: 'RecordCart'
    };

    return <JanusPixel queryParams={queryParams} />;
  };

  if (!isModalShowing) {
    return null;
  }

  return createPortal(
    <FocusTrap active={isModalShowing} shouldFocusFirstElement>
      {focusRef => (
          <>
          <div
            className={css.container}
            role="dialog"
            aria-modal="true"
            aria-describedby="modalDescription"
            ref={focusRef as React.MutableRefObject<HTMLDivElement>}
          >
            { addedStockId && makeJanusPixel() }
            <div className={css.modal} data-test-id={testId('cartModal')}>
              <div className={cn(modalCSS.header, css.modalHeader)}>
                { makeHeader() }
                <button
                  type="button"
                  onClick={onHideModal}
                  className={modalCSS.close}
                  data-test-id={testId('closeModal')}
                  aria-label="Close"/>
              </div>
              {
                isLoaded && cart
                  ? <>
                      <RewardsTransparency isForCartModal={true} />
                        {
                          activeItems.length
                            ? makeCartItems()
                            : makeEmptyCart()
                        }
                    </>
                  : <SmallLoader />
              }
            </div>
          </div>
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        {/*
          react-modal does onclick on divs
          https://github.com/reactjs/react-modal/blob/master/src/components/ModalPortal.js
        */}
        <div onClick={onHideModal} onKeyPress={onHideModal} className={css.wrapper} />
        </>
      )}
    </FocusTrap>,
    document.body
  );
};

export function mapStateToProps(state: AppState) {
  const { cart, cookies, pageView: { pageType: sourcePageType } } = state;
  const isCustomer = !!cookies['x-main'];

  return {
    cart,
    isCustomer,
    sourcePageType
  };
}

const mapDispatchToProps = {
  fetchCartItems,
  showCartModal,
  syncCartLocalStorage,
  navigateToCheckout,
  onCartView,
  onCartModalClose,
  onViewCartClick,
  pageTypeChange,
  setFederatedLoginModalVisibility
};

const connector = connect(mapStateToProps, mapDispatchToProps);
const ConnectedCartModal = connector(CartModal);
export default withErrorBoundary('CartModal', ConnectedCartModal);
