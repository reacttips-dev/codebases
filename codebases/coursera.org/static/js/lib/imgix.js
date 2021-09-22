/**
 *  Imgix is a service that we use to dynamically resize and optimize images
 *  It supports many different transforms,
 *  however to start we're only supporting the ones in QUERY_MAP
 */

import Uri from 'jsuri';

import config from 'js/app/config';
import path from 'js/lib/path';
import { prodAssetsRoot } from 'js/constants/cloudfront';

// Some older code passed src with this prefixed already, so we remove it to
// be consistent. We use regex to be agnostic to CDN domain that Edge may have
// replaced in the HTML stream.
const REDUNDANT_PREFIX = /https:\/\/.+\/api\/utilities\/v1\/imageproxy\//;
const DEVELOPMENT_PREFIX = 'https://assets.dev-coursera.org:9443/';
const ASSET_PREFIX = 'imageAssetProxy.v1';
const warned = {};

const QUERY_MAP = Object.freeze({
  format: 'fm',
  quality: 'q',
  blur: 'blur',
  width: 'w',
  height: 'h',
  dpr: 'dpr',
  mask: 'mask',
  brightness: 'bri',
  fit: 'fit',
  exposure: 'exp',
  auto: 'auto',
  bg: 'bg',
  maxWidth: 'max-w',
  invert: 'invert',
  px: 'px',
});

const DEFAULT_OPTIONS = Object.freeze({
  auto: 'format,compress', // http://www.imgix.com/docs/reference/automatic#param-auto

  // Ensure page is fully loaded before checking window. Prevents SSR and CSR mismatch 
  dpr: (typeof document !== 'undefined' && document.readyState === 'complete' && window.devicePixelRatio) || 1,
});

function constructUrl(src, queryParams = {}) {
  const paramKeys = Object.keys(queryParams);
  const fullUrl = paramKeys.reduce((uri, key) => uri.addQueryParam(key, queryParams[key]), new Uri(src));

  return fullUrl.toString();
}

function processImage(src, longOptions = {}) {
  if (!src) {
    return '';
  }

  // dev asset can't be optimized
  if (src.indexOf(DEVELOPMENT_PREFIX) >= 0) {
    // happens only in local development

    // keep track of warned src so we don't warn again
    if (!warned[src]) {
      console.warn('Local image asset cannot be used with image optimization proxy', src);
    }
    warned[src] = true;
    return '';
  }

  let realSrc = src.replace(REDUNDANT_PREFIX, '');

  if (realSrc.indexOf(ASSET_PREFIX) === -1) {
    realSrc = config.url.imageProxyRoot + realSrc;
  }
  const shortOptions = Object.assign({}, DEFAULT_OPTIONS);
  Object.keys(longOptions).forEach(function(longKey) {
    const shortKey = QUERY_MAP[longKey];
    if (shortKey) {
      shortOptions[shortKey] = longOptions[longKey];
    }
  });

  return constructUrl(realSrc, shortOptions);
}

 function getOptimizedSrcs(src, width, height, imgParams) {
    // Handle pathological case of missing src. This will show up as missing
    // in the browser, with the alt tag. We do this instead of passing the
    // unoptimized URL so that the developer can see the failure in the
    // render.
    if (!src) return {};

    const isAbsoluteAlready = src.slice(0, 4) === 'http' || src.slice(0, 2) === '//';

    const absoluteSrc = isAbsoluteAlready ? src : path.join(prodAssetsRoot, src);

    const options = Object.assign({ width, height }, imgParams);

    // Craft image URLs for each device-pixel-ratio, ignoring the passed in value.
    return {
      dpr1: processImage(absoluteSrc, Object.assign(options, { dpr: 1 })),
      // 2x is HiDPI like Macbook Pro, plus many phones
      dpr2: processImage(absoluteSrc, Object.assign(options, { dpr: 2 })),
      // 3x is supported on iPhone 6 and Nexus 6
      dpr3: processImage(absoluteSrc, Object.assign(options, { dpr: 3 })),
      // Uses configuration for LQIP as suggested by imgix: https://blog.imgix.com/2016/06/01/lqip-your-images
      degraded: processImage(absoluteSrc, Object.assign(options, { blur: 200, px: 16 })),
    };
  }

export default {
  processImage,
  getOptimizedSrcs
};

export { processImage, getOptimizedSrcs };
