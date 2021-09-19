import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import ImageLazyLoader from 'components/common/ImageLazyLoader';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import ProductUtils from 'helpers/ProductUtils';
import { constructMSAImageUrl } from 'helpers';
import { LANDING_PAGE } from 'constants/amethystPageTypes';

import css from 'styles/components/landing/shopTheLookCard.scss';

const ADD_TO_CART_ERROR = 'ADD_TO_CART_ERROR';
const SELECT_DIMENSIONS = 'SELECT_DIMENSIONS';
const FAVORITE_ITEM = 'FAVORITE_ITEM';
const UNFAVORITE_ITEM = 'UNFAVORITE_ITEM';

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case ADD_TO_CART_ERROR:
      return { ...state, error: true };
    case SELECT_DIMENSIONS: {
      return { ...state, selectedDimensions: { ...state.selectedDimensions, ...payload }, error: false };
    }
    case FAVORITE_ITEM: {
      return { ...state, isFavorite: true };
    }
    case UNFAVORITE_ITEM: {
      return { ...state, isFavorite: false };
    }
  }
};

export const initialState = {
  selectedDimensions:{},
  error: false,
  isFavorite: false
};

export const ShopTheLookCard = ({
  cardData,
  changeQuantity,
  showCartModal,
  heartProduct,
  unHeartProduct,
  hearts,
  styleId,
  isCustomer,
  toggleHeartingLoginModal
}, { marketplace }) => {

  const [state, dispatch] = useReducer(reducer, initialState);
  const { error, selectedDimensions, isFavorite } = state;
  const { brandName, productName, styles = [], oos, sizing: { stockData, dimensions } } = cardData;
  const { cart: { cartName }, hasHearting } = marketplace;
  const { colorId, price } = styles[0];
  const msaImageId = styles[0]?.images[0]?.imageId;
  const msaOpts = {
    height: 500,
    width: 500,
    autoCrop: true
  };
  const msaImageUrl = constructMSAImageUrl(msaImageId, msaOpts);
  const imgProps = { alt: `Product Image of ${brandName} ${productName}`, src: msaImageUrl, className: css.productImage };

  // UI updates for client-side favorites when hearts update
  useEffect(() => {
    if (hearts.some(heart => heart === styleId)) {
      dispatch({ type: FAVORITE_ITEM });
    } else {
      dispatch({ type: UNFAVORITE_ITEM });
    }
  }, [hearts, styleId]);

  const handleDimensionChange = e => {
    const { value, dataset: { dimensionId } } = e.target;
    if (value) {
      dispatch({ type: SELECT_DIMENSIONS, payload: { [dimensionId]: value } });
      return;
    }
    // If they don't select a correct size, set it to default empty string
    dispatch({ type: SELECT_DIMENSIONS, payload: { [dimensionId]: '' } });
  };

  const handleFavorite = () => {
    if (!isCustomer) {
      toggleHeartingLoginModal(true, styleId);
    } else {
      if (isFavorite) {
        dispatch({ type: UNFAVORITE_ITEM }); // To show immediate UI updates
        unHeartProduct({ itemId: styleId, sourcePage: LANDING_PAGE });
      } else {
        dispatch({ type: FAVORITE_ITEM }); // To show immediate UI updates
        heartProduct({ itemId: styleId, sourcePage: LANDING_PAGE });
      }
    }
  };

  const handleAddToCart = async e => {
    e.preventDefault();
    try {
      const stock = ProductUtils.getStockBySize(stockData, colorId, selectedDimensions);
      await changeQuantity({ items: [{ stockId: stock.id, quantity: 1, quantityAddition: true }] });
      showCartModal(true, stock.id);
    } catch (error) {
      dispatch({ type: ADD_TO_CART_ERROR });
    }
  };

  return (
    <li className={css.card}>
      <ImageLazyLoader className={css.productImageContainer} imgProps={imgProps} />
      <form method="POST" onSubmit={handleAddToCart} className={css.productInfo}>
        <h3 className={css.brandName}>{brandName}</h3>
        <p>{productName}</p>
        <p>{price}</p>
        <label htmlFor={`favorite-${styleId}`} className="screenReadersOnly">{isFavorite ? 'Remove' : 'Add'} {brandName} {productName} to favorites.</label>
        {hasHearting &&
          <button
            type="button"
            id={`favorite-${styleId}`}
            className={cn(css.heartContainer, { [css.heartActive]: isFavorite })}
            onClick={handleFavorite}
          />
        }
        {dimensions.map(dimension => {
          const { name, units, id } = dimension;
          const dimensionId = `d${id}`;
          return (
            <DimensionDropdown
              key={name}
              dimensionId={dimensionId}
              name={name}
              units={units}
              handleDimensionChange={handleDimensionChange}
            />
          );
        })}
        {error && <span className={css.errorMessage}>Oops, something went wrong.</span>}
        <button
          type="submit"
          className={css.addToBag}
          disabled={oos}
        >
          {oos ? 'Out of Stock' : `Add to ${cartName}`}
        </button>
      </form>
    </li>);
};

ShopTheLookCard.contextTypes = {
  marketplace: PropTypes.object
};

export const DimensionDropdown = ({ dimensionId, name, units, handleDimensionChange }) => {
  const { values } = units[0];
  return (
    <>
      <label htmlFor={name} className="screenReadersOnly">Select a {name}</label>
      <select
        id={name}
        name={name}
        onChange={handleDimensionChange}
        data-dimension-id={dimensionId}
        className={css.selectSize}
        required
      >
        <option value="" defaultValue>Select {name}</option>
        {values.map(({ id, value }) =>
          <option key={id} value={id}>{value}</option>
        )}
      </select>
    </>
  );
};

export default withErrorBoundary('ShopTheLookCard', ShopTheLookCard);
