'use es6';

export var getShouldUsePreviewSize = function getShouldUsePreviewSize(image) {
  return image.get('height') <= image.get('width');
};