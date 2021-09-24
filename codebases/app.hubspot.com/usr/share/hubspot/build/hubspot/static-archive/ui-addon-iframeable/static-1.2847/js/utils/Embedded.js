'use es6';

import enviro from 'enviro';
import { parse } from './Params';
export var isTopLevelWindowSupported = function isTopLevelWindowSupported() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      enableTopLevelEmbed = _ref.enableTopLevelEmbed,
      enableTopLevelEmbedForTestOnly = _ref.enableTopLevelEmbedForTestOnly;

  var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.top;
  return window === top && (enableTopLevelEmbed || enviro.isQa() && enableTopLevelEmbedForTestOnly);
};
export var getEmbeddedPropsFromQueryParams = function getEmbeddedPropsFromQueryParams() {
  var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.search;
  return parse(search);
};
export var getTopLevelEmbeddedContextDefaults = function getTopLevelEmbeddedContextDefaults() {
  return {
    embedId: 'top',
    group: 'iframeable',
    name: 'embed-top',
    appData: {
      info: {},
      name: 'unknown',
      url: ''
    }
  };
};