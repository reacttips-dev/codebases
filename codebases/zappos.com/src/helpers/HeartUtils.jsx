import { constructMSAImageUrl } from 'helpers';
import { buildRecosKey } from 'helpers/RecoUtils';
import { toUSD } from 'helpers/NumberFormats';

export function makeHeartClickHandler(heartEventData, clickHandlerDataAndActions) {
  const { heartEventName, unHeartEventName } = heartEventData;
  const { heartProduct, unHeartProduct, toggleHeartingLoginModal, trackEvent, isCustomer } = clickHandlerDataAndActions;
  return function({ styleId }, isHearted) {
    if (isCustomer) {
      if (isHearted) {
        unHeartProduct({ itemId: styleId });
        trackEvent(unHeartEventName, styleId);
      } else {
        heartProduct({ itemId: styleId });
        trackEvent(heartEventName, styleId);
      }
    } else {
      toggleHeartingLoginModal(true, styleId);
    }
  };
}

export function isProductHearted(showFavoriteHeart, hearts = [], styleId) {
  return showFavoriteHeart && styleId && hearts?.indexOf(styleId) > -1;
}

export function makeHandleHeartButtonClick({
  hearts,
  onHeartClick,
  onCollectionToggle,
  productId,
  showFavoriteHeart,
  style
}) {
  return e => {
    const { styleId, basePrice, salePrice } = style;
    const price = basePrice !== salePrice ? salePrice : basePrice;
    const isHearted = isProductHearted(showFavoriteHeart, hearts, styleId);

    // Prevent incorrect tracking events and going to product url
    e.stopPropagation();
    e.preventDefault();
    // Run hearting callback if present
    if (onHeartClick) {
      onCollectionToggle && onCollectionToggle(!isHearted); // show collection if product has not been hearted prior to clicking "Heart"
      onHeartClick({
        styleId,
        productId,
        price
      }, isHearted);
    }
  };
}

// combines list object information with the items
export function makeCollectionInformationWithItems(lists, collections) {
  const collectionWithItems = [];
  if (lists?.length && collections?.length) {
    lists.forEach(list => {
      const correspondingCollection = collections.find(collection => list.listId === collection.listId);
      collectionWithItems.push({
        ...list, ...correspondingCollection
      });
    });
  }

  return collectionWithItems;
}

export function getHeartProps(heartProps, { heartEventName, unHeartEventName }) {
  const {
    hasHearting,
    isCustomer,
    heartProduct,
    hearts,
    products = {},
    toggleHeartingLoginModal,
    trackEvent,
    unHeartProduct,
    isDisplayCount,
    hydraHeartsStars
  } = heartProps || {};
  if (hasHearting) {
    const clickHandlerDataAndActions = { heartProduct, isCustomer, toggleHeartingLoginModal, trackEvent, unHeartProduct };
    return {
      showFavoriteHeart: true,
      onHeartClick: makeHeartClickHandler({ heartEventName, unHeartEventName }, clickHandlerDataAndActions),
      hearts,
      heartsList: products.heartsList,
      isDisplayCount,
      hydraHeartsStars
    };
  }

  return { showFavoriteHeart: false };
}

export function getHeartingStyleIdsForComponent(slotData = {}, recommenderEntries = {}) {
  const results = [];
  Object.values(slotData).forEach(slot => {
    switch (slot.componentName) {
      case 'genericBrandTrending':
        results.push(...(slot.trending?.results || []));
        break;
      case 'productSearch':
        results.push(...(slot.products || []));
        break;
      case 'melodyGrid':
        results.push(...(slot.products || []));
        break;
      case 'recommender':
        const { janus = {} } = recommenderEntries;
        const recosKey = buildRecosKey(slot);
        const { recos } = janus[recosKey] || {};
        if (recos?.length > 0) {
          results.push(...recos);
        }
        break;
    }
  });
  return results
    .map(result => ({ styleId: result.styleId }))
    .filter(result => !!result);
}

export function formatHeartsForMelodyCard(heart) {
  const { imageId, price } = heart;
  return {
    ...heart,
    thumbnailImageId: imageId,
    thumbnailImageUrl: constructMSAImageUrl(imageId, { autoCrop: true, width: 272 }),
    price: typeof price === 'number' ? toUSD(price) : price
  };
}
