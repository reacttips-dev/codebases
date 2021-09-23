'use es6';

export function validateColor(props, propName, componentName) {
  if (props[propName] && !/^#[0-9a-fA-F]{3,6}$/.test(props[propName])) {
    return new Error(componentName + ".props." + propName + " Validation failed!");
  }

  return null;
}
export var isValidFavorites = function isValidFavorites(favorites) {
  return favorites && Array.isArray(favorites) && favorites.length > 0;
};