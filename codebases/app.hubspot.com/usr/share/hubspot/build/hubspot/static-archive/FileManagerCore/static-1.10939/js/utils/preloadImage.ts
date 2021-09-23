import Url from 'urlinator/Url';
import { splitNameAndExtension } from './file';
var cache = {};

var successNoop = function successNoop(__meta) {};

var errorNoop = function errorNoop(__err) {};

export default function preloadImage(src) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : successNoop;
  var errCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : errorNoop;

  if (cache[src]) {
    callback(cache[src]);
    return function () {};
  }

  var img = new window.Image();
  var cancelled = false;

  var loadHandler = function loadHandler() {
    if (cancelled) {
      return;
    }

    var parsed = new Url(src);
    var segments = parsed.pathname.split('/');

    var _splitNameAndExtensio = splitNameAndExtension({
      name: segments[segments.length - 1]
    }),
        name = _splitNameAndExtensio.name,
        extension = _splitNameAndExtensio.extension;

    var meta = {
      url: src,
      width: img.width,
      height: img.height,
      name: name,
      extension: extension
    };
    cache[src] = meta;
    callback(meta);
  };

  var errorHandler = function errorHandler(error) {
    if (cancelled) {
      return;
    }

    cache[src] = false;
    errCallback({
      url: src,
      error: error
    });
  };

  img.src = src;
  img.addEventListener('load', loadHandler);
  img.addEventListener('error', errorHandler);
  return function () {
    if (cancelled) {
      return;
    }

    cancelled = true;
    img.removeEventListener('load', loadHandler);
    img.removeEventListener('error', errorHandler);
  };
}