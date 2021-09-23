'use es6';

import { resize } from 'FileManagerCore/utils/resize';
export default function getOptimizedImage(file, imageOptimizationSetting) {
  var optimizableUrlKeys = ['url', 'friendly_url', 'alt_url'];
  var resizeParams = {
    width: parseInt(file.get('width'), 10) - 1,
    quality: imageOptimizationSetting
  };
  return optimizableUrlKeys.reduce(function (optimizedFile, urlKey) {
    return optimizedFile.set(urlKey, resize(file.get(urlKey), resizeParams));
  }, file);
}