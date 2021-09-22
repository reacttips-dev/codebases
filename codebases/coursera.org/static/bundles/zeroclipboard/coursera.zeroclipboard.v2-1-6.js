'use strict';

import $ from 'jquery';
import ZeroClipboard from 'js/vendor/ZeroClipboard.v2-1-6';
import config from 'js/app/config';
import path from 'js/lib/path';

var swfPath = path.join(config.url.app_assets, 'bundles/zeroclipboard/ZeroClipboard.swf');

ZeroClipboard.config({
  swfPath: swfPath,
});

var _private = {
  constants: {
    'data.clipboard': 'clipboard.me',
  },

  getClipboard: function (el) {
    return $(el).data(_private.constants['data.clipboard']);
  },

  makeClipboard: function (el) {
    var $el = $(el);
    var clipboard = new ZeroClipboard(el);
    $el.data(_private.constants['data.clipboard'], clipboard);
    return clipboard;
  },
};

var external = function () {
  if (!ZeroClipboard.isFlashUnusable()) {
    return _private.getClipboard.apply(null, arguments) || _private.makeClipboard.apply(this, arguments);
  }
};

external.isEnabled = function () {
  return !ZeroClipboard.isFlashUnusable();
};

export default external;
