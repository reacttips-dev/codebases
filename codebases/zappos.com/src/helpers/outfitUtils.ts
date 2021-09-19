import {
  BaseOutfitItemApiResponse,
  InStockOutfitItemApiResponse,
  Outfit,
  OutfitApiListResponse,
  OutfitApiResponse,
  OutfitItem
} from 'types/outfits';

const transformOutfitItemResponse = (item: InStockOutfitItemApiResponse|BaseOutfitItemApiResponse): OutfitItem => {
  const base = {
    brand: item.brand,
    category: item.category,
    imageId: item.image_id,
    link: item.link,
    productId: item.product_id,
    productType: item.product_type,
    styleId: item.style_id,
    inStock: item.in_stock
  };
  if (item.in_stock) {
    // override brand field w/ brandName since it's more "up to date"
    const { brand_name: brand, product_name: productName, list_price: listPrice, price } = item;
    return { ...base, brand, productName, listPrice, price };
  }
  return base;

};

// Prioritize in stock items at the front of the array so they get the larger images
const outfitItemComparator = (o1: OutfitItem, o2: OutfitItem): number => {
  if (o1.inStock && o2.inStock) {
    return 0;
  } else if (!o1.inStock && o2.inStock) {
    return 1;
  } else {
    return -1;
  }
};

export const transformOutfitResponse = (outfitApiResponse: OutfitApiResponse, sourceProductId: string, sourceStyleId: string): Outfit => ({
  id: outfitApiResponse.id,
  curatorName: outfitApiResponse.curator_name,
  items: outfitApiResponse.items.map(transformOutfitItemResponse).sort(outfitItemComparator),
  sourceProductId,
  sourceStyleId
});

export const sanitizeApiData = (outfitApiResponse: OutfitApiListResponse, sourceProductId: string, sourceStyleId: string): Outfit[] =>
  outfitApiResponse.outfits
    .map(o => transformOutfitResponse(o, sourceProductId, sourceStyleId))
    .filter(o => (o.items.length > 1 && o.items.length < 10));

export const shareableLink = (outfit: Outfit) => `/outfit/${outfit.id}?productId=${outfit.sourceProductId}&styleId=${outfit.sourceStyleId}`;

