import { Outfit } from 'types/outfits';
import {
  OutfitEventShape,
  OutfitItemClick,
  OutfitPageView,
  OutfitStreamClick,
  OutfitStreamImpression
} from 'types/amethyst';
import { OUTFIT_DETAIL_PAGE } from 'constants/amethystPageTypes';

type BaseOutfitEventShape = {
  pageType: string;
  outfit: Outfit;
  productId: string;
  styleId: string;
};
type StreamImpressionParams = Omit<BaseOutfitEventShape, 'outfit'> & {
  viewableImpression: boolean;
  outfits: Outfit|Outfit[];
};

const translateOutfit = ({ id, items }: Outfit): OutfitEventShape => ({
  outfitId: id,
  items: items.map(item => ({ productId: item.productId, styleId: item.styleId, supplementalData: { isInStock: item.inStock, price: item.price } }))
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/OutfitStreamImpression.proto
 *
 * @param {string} pageType
 * @param {array} outfit
 * @param {string} productId
 * @param {string} colorId
 * @param {boolean} viewableImpression
 */
export const evOutfitStreamImpression = ({ pageType, outfits, productId, styleId, viewableImpression }: StreamImpressionParams): OutfitStreamImpression => {
  const outfitsArray = Array.isArray(outfits) ? outfits : [outfits];
  const outfitEventShapes = outfitsArray.map(translateOutfit);
  return {
    outfitStreamImpression: {
      pageType,
      outfit: outfitEventShapes,
      sourceProduct: {
        productId,
        styleId
      },
      viewableImpression
    }
  };
};

export const evOutfitStreamClick = ({ pageType, outfit, allOutfits, productId, styleId }: BaseOutfitEventShape& { allOutfits: Outfit[]}): OutfitStreamClick => {
  const outfitEventShape = translateOutfit(outfit);
  const outfitIndex = allOutfits.indexOf(outfit);
  return {
    outfitStreamClick: {
      pageType,
      index: outfitIndex,
      outfit: outfitEventShape,
      sourceProduct: {
        productId,
        styleId
      }
    }
  };
};

export const evOutfitPageView = (outfit: Outfit): OutfitPageView => {
  const inStockItems = outfit.items.reduce((acc, curr) => (curr.inStock ? acc + 1 : acc), 0);
  const outfitTotalItems = outfit.items.length;
  return {
    outfitPageView: {
      outfit: translateOutfit(outfit),
      inStockItems,
      outfitTotalItems
    }
  };
};

export const evOutfitItemClick = ({ outfit, productId, styleId }: BaseOutfitEventShape): OutfitItemClick => ({
  outfitItemClick: {
    pageType: OUTFIT_DETAIL_PAGE,
    outfit: translateOutfit(outfit),
    product: {
      productId,
      styleId
    }
  }
});
