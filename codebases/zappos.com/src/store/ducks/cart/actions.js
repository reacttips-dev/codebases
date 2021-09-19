import {
  CART_PAGEVIEW,
  EVENT_ADD_TO_CART,
  EVENT_CART_CONTINUE_SHOPPING_CLICK,
  EVENT_CART_HEAD_BANNER_CLICK,
  EVENT_CART_MODAL_CLOSE,
  EVENT_CART_QUANTITY,
  EVENT_CART_RECO_CLICK,
  EVENT_MODIFY_QUANTITY,
  EVENT_NAVIGATE_TO_CHECKOUT,
  EVENT_REMOVE_FROM_CART,
  EVENT_VIEW_CART_CLICK
} from 'store/ducks/cart/types';

export const onModifyQuantity = (quantity, asin) => ({
  type: EVENT_MODIFY_QUANTITY,
  quantity,
  asin
});

export const onRemoveFromCart = (asin, isRemoveButton) => ({
  type: EVENT_REMOVE_FROM_CART,
  asin,
  isRemoveButton
});

export const onAddToCart = product => ({
  type: EVENT_ADD_TO_CART,
  product
});

export const onCartUpdated = () => ({
  type: EVENT_CART_QUANTITY
});

export const onNavigateToCheckout = pageType => ({
  type: EVENT_NAVIGATE_TO_CHECKOUT,
  pageType
});

export const onCartView = cart => ({
  type: CART_PAGEVIEW,
  cart
});

export const onCartHeadBannerClick = bannerType => ({
  type: EVENT_CART_HEAD_BANNER_CLICK,
  bannerType
});

export const onCartContinueShoppingClick = () => ({
  type: EVENT_CART_CONTINUE_SHOPPING_CLICK
});

export const onViewCartClick = () => ({
  type: EVENT_VIEW_CART_CLICK
});

export const onCartModalClose = () => ({
  type: EVENT_CART_MODAL_CLOSE
});

export const onCartRecoClick = (productId, index) => ({
  type: EVENT_CART_RECO_CLICK,
  productId,
  index
});
