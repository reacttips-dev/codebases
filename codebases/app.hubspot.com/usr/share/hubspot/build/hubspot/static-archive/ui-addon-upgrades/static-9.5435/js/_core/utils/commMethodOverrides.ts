import { parse } from 'hub-http/helpers/params';
import enviro from 'enviro';

var getQueryParam = function getQueryParam(param) {
  // Accessing `window.top` throws when we're on a
  // different domain (e.g. Wordpress)
  try {
    return parse(window.top.location.search.substring(1))[param];
  } catch (_) {
    return '';
  }
};

export var HAS_ASSIGNABLE_OVERRIDE = enviro.isQa() && getQueryParam('assignable') === 'true';
export var HAS_UNASSIGNABLE_OVERRIDE = enviro.isQa() && getQueryParam('assignable') === 'false';
export var HAS_RETAIL_OVERRIDE = enviro.isQa() && getQueryParam('isRetail') === 'true';