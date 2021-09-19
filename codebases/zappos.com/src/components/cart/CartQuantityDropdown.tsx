import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { CartItem } from 'types/mafia';
import useMartyContext from 'hooks/useMartyContext';
import {
  onModifyQuantity,
  onRemoveFromCart
} from 'store/ducks/cart/actions';
import {
  cartError,
  changeQuantity,
  fetchCartItems
} from 'actions/cart';
import { translateCartError } from 'apis/mafia';
import JanusPixel from 'components/common/JanusPixel';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/cart/cartQuantityDropdown.scss';

interface OwnProps {
  item: CartItem;
  onChangeQuantityCb: (...args: any[]) => void;
  onChangeQuantityCbDone: () => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

const maxQuantity = 10;

export const makeOptions = (onHand: number, currentVal: number) => {
  /* if we have a ton on hand, just set to 10 */
  if (onHand > maxQuantity) {
    onHand = maxQuantity;
  }

  const options = [];

  for (let i = 1; i <= onHand; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
  }

  if (currentVal > onHand) {
    options.push(<option disabled key={currentVal} value={currentVal}>{currentVal}</option>);
  }

  return options;
};

export const CartQuantityDropdown = ({
  item,
  changeQuantity,
  cartError,
  fetchCartItems,
  onChangeQuantityCb,
  onChangeQuantityCbDone,
  onRemoveFromCart,
  onModifyQuantity
}: Props) => {
  const [isDeleting, setDeleting] = useState(false);

  const { testId, marketplace: { cart: { allowAdjustQuantity } } } = useMartyContext();

  const {
    egc,
    asin,
    quantity,
    stock,
    stockId,
    styleId,
    onHand
  } = item;

  const onChangeQuantity = ({ currentTarget }: React.ChangeEvent<HTMLSelectElement> | React.MouseEvent<HTMLButtonElement>) => {
    const {
      dataset: { asin, cartitemid, isEgc },
      value
    } = currentTarget as HTMLSelectElement | HTMLButtonElement;

    if (!asin) {
      return;
    }

    const quantity = +value; // coerce to number

    onChangeQuantityCb(asin);

    if (quantity === 0) {
      setDeleting(true);
      onRemoveFromCart(asin);
    } else {
      onModifyQuantity(quantity, asin);
    }

    interface ItemData {
      asin: string;
      quantity: number;
      itemType?: string;
      cartItemId?: string;
    }

    const itemData: ItemData = {
      asin,
      quantity
    };

    if (isEgc === 'true' && cartitemid) {
      itemData.itemType = 'egc';
      itemData.cartItemId = cartitemid;
    }

    changeQuantity({ 'items': [itemData] }).then(response => {
      !!quantity && onChangeQuantityCbDone();

      // TODO: remove this logic once https://github01.zappos.net/mweb/marty/issues/6291 is addressed on the mafia side
      if (quantity === 0 && isEgc === 'true') {
        fetchCartItems();
      }

      const error = translateCartError(response);

      if (error) {
        cartError(error);
      }
    });
  };

  const makeJanusPixel = () => {
    const queryParams = {
      teen: styleId,
      child: stockId,
      widget: 'DeleteCart'
    };

    return <JanusPixel queryParams={queryParams} />;
  };

  // if item is an egc, item is out of stock, item does not allow quantity adjustments, do not render dropdown
  if (egc || !stock || !allowAdjustQuantity) {
    return null;
  }

  return (
    <div className={css.container}>
      <label htmlFor={`quantity-${asin}`} data-test-id={testId('quantityDropdownLabel')}>Quantity</label>
      <select
        id={`quantity-${asin}`}
        data-asin={asin}
        value={quantity}
        onChange={onChangeQuantity}
        data-test-id={testId('quantityDropdown')}
        name="quantity">
        <option value={0}>Remove</option>
        { makeOptions(onHand, quantity) }
      </select>
      { isDeleting && makeJanusPixel() }
    </div>
  );
};

const mapDispatchToProps = {
  cartError,
  changeQuantity,
  fetchCartItems,
  onModifyQuantity,
  onRemoveFromCart
};

const connector = connect(null, mapDispatchToProps);
const ConnectedCartQuantityDropdown = connector(CartQuantityDropdown);
export default withErrorBoundary('CartQuantityDropdown', ConnectedCartQuantityDropdown);
