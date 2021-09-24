export const AD_LAYER = 'layer';
export const AD_CATEGORY = 'category';
export const AD_FUNCTION = 'function';

export const adProperty = (object, property) => {
  return object && object[property] ? object[property].name : null;
};
