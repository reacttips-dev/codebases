import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cn from 'classnames';
import { stringify } from 'query-string';

import { onRemoveFromCart } from 'store/ducks/cart/actions';
import { setFederatedLoginModalVisibility } from 'actions/headerfooter';
import useMartyContext from 'hooks/useMartyContext';
import { cartIsLoading, changeQuantity, showCartModal } from 'actions/cart';
import { fetchHeartList, heartProduct } from 'actions/hearts';
import { toUSD } from 'helpers/NumberFormats';
import ProductUtils from 'helpers/ProductUtils';
import CartQuantityDropdown from 'components/cart/CartQuantityDropdown';
import ProductImage from 'components/cart/ProductImage';
import { SmallLoader } from 'components/Loader';
import ItemDescription from 'components/cart/ItemDescription';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import FinalSale from 'components/common/FinalSale';
import { trackEvent } from 'helpers/analytics';
import { CartItem as CartItemType } from 'types/mafia';
import { AppState } from 'types/app';

import css from 'styles/components/cart/cartItem.scss';

interface OwnProps {
  children?: React.ReactNode;
  className?: string;
  hasFullDetails?: boolean;
  hideFavorite?: boolean;
  allowAdjustQuantity?: boolean;
  isFavorite?: boolean;
  isModal?: boolean;
  isRecommendedFit?: boolean;
  isUnavailable?: boolean;
  item: CartItemType | any; // TODO ts type this to heart item once cloudlist API is typed
  showFixedQuantity?: boolean;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export const CartItem = ({
  addedStockId,
  cartIsLoading,
  changeQuantity,
  onRemoveFromCart,
  children,
  className,
  hasFullDetails = true,
  heartProduct,
  fetchHeartList,
  hideFavorite = false,
  isCustomer,
  isFavorite = false,
  isModal = false,
  isRecommendedFit = false,
  isUnavailable = false,
  item,
  routing,
  setFederatedLoginModalVisibility,
  showCartModal,
  showFixedQuantity = false
}: Props) => {
  const [updating, setUpdating] = useState<void | string>();

  const {
    testId,
    marketplace: { authUrl, checkout: { allowMoveToFavorites }, hasFederatedLogin }
  } = useMartyContext();

  const onItemUpdate = (asin: string) => {
    cartIsLoading();
    setUpdating(asin);
  };

  const onItemUpdateDone = () => {
    setUpdating();
  };

  const onRemoveItem = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    const { asin } = currentTarget.dataset;

    if (asin) {
      onItemUpdate(asin);
      const itemData = { asin, quantity: 0 };
      changeQuantity({ 'items': [itemData] });
      onRemoveFromCart(asin, true);
    }
  };

  const onMoveToFavorites = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    const { asin } = currentTarget.dataset;

    if (isCustomer) {
      if (asin) {
        onItemUpdate(asin);
        const itemData = { asin, quantity: 0 };

        const callback = () => {
          changeQuantity({ 'items': [itemData] });
          fetchHeartList({ suppressAuthCatch: true });
          trackEvent('TE_CART_ADDTOFAVORITES', asin);
        };

        heartProduct({ subItemId: asin }, callback);
      }
    } else {
      if (hasFederatedLogin) {
        const { locationBeforeTransitions: { pathname, query } } = routing;
        const returnTo = encodeURIComponent(`${pathname}?${stringify({ ...query })}`);
        showCartModal(false);
        setFederatedLoginModalVisibility(true, { returnTo });
      } else {
        window.location.href = `${authUrl}/cart`;
      }
    }
  };

  const makeCartActions = () => {
    if (!hasFullDetails) {
      return null;
    }

    const { asin, egc } = item;

    if (showFixedQuantity) {
      return (
        <dl className={cn(css.actions, css.fixedQuantity)}>
          <dt>Quantity</dt>
          <dd>{showFixedQuantity}</dd>
        </dl>
      );
    }

    return (
      <div className={css.actions}>
        {
          <CartQuantityDropdown
            item={item}
            onChangeQuantityCb={onItemUpdate}
            onChangeQuantityCbDone={onItemUpdateDone} />
        }

        { (!hideFavorite && allowMoveToFavorites && !(egc || isUnavailable))
          && <button
            type="button"
            className={css.moveToFavs}
            aria-label="Move to Favorites"
            onClick={onMoveToFavorites}
            data-test-id={testId('moveToFavoritesButton')}
            data-asin={asin}>Move to</button>
        }

        <button
          type="button"
          aria-label="Remove Item"
          onClick={onRemoveItem}
          data-test-id={testId('removeButton')}
          data-asin={asin}>Remove</button>
      </div>
    );
  };

  const makePrice = ({ price, originalPrice, finalSale }: CartItemType, stock: number, isUnavailable: boolean) => {
    if (isUnavailable) {
      return (
        <em className={css.unavailable} data-test-id={testId('unavailable')}>Unavailable</em>
      );
    }

    const isDiscounted = ProductUtils.isStyleOnSale({ originalPrice, price });

    return (
      <>
        <em className={cn(css.price, { [css.discount]: isDiscounted })} data-test-id={testId('price')}>{toUSD(stock * price)}</em>
        { isDiscounted && <span data-test-id={testId('msrpPrice')}>MSRP: {toUSD(stock * originalPrice)}</span>}
        { stock !== 1 && <span className={css.each}>{toUSD(price)} each</span> }
        { finalSale && <FinalSale /> }
      </>
    );
  };

  const { egc, asin, stockId, quantity = 1 } = item;

  const stock = isFavorite ? 1 : quantity;

  const testIdName = egc ? 'giftCardItem' : isFavorite ? 'favItem' : 'cartItem';

  return (
    <div
      data-test-id={testId(testIdName)}
      className={cn(className, css.container, {
        [css.favorite]: isFavorite,
        [css.compress]: isModal,
        [css.fade]: addedStockId && addedStockId === stockId
      })}>
      { asin === updating && <div className={css.updating}><SmallLoader /></div> }
      <ProductImage
        tabIndex={-1}
        ariaHidden={true}
        item={item}
        className={css.image} />
      <div className={css.midColumn}>
        <ItemDescription
          isUnavailable={isUnavailable}
          isModal={isModal}
          item={item}
          isRecommendedFit={isRecommendedFit}
        />

        { makeCartActions() }

        <div className={css.priceContainer}>
          { children }
          { makePrice(item, stock, isUnavailable) }
        </div>
      </div>

    </div>
  );
};

export function mapStateToProps(state: AppState) {
  const { cart: { addedStockId = undefined } = {}, cookies, routing } = state;
  const isCustomer = !!cookies['x-main'];

  return {
    addedStockId,
    isCustomer,
    routing
  };
}

const mapDispatchToProps = {
  cartIsLoading,
  changeQuantity,
  heartProduct,
  fetchHeartList,
  setFederatedLoginModalVisibility,
  showCartModal,
  onRemoveFromCart
};

const connector = connect(mapStateToProps, mapDispatchToProps);
const ConnectedCartItem = connector(CartItem);
export default withErrorBoundary('CartItem', ConnectedCartItem);
