import cleanQuery from './cleanQuery';
import { GET, POST, setBaseRequestProps } from 'unified-navigation-ui/utils/API';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
import { text } from '../../utils/NavI18n';
import isQA from 'unified-navigation-ui/utils/isQA';
var corrId;
export function search(_ref, successCallback) {
  var query = _ref.query,
      types = _ref.types,
      limit = _ref.limit,
      offset = _ref.offset,
      offsetA = _ref.offsetA,
      offsetB = _ref.offsetB,
      nextOffset = _ref.nextOffset,
      nextOffsetA = _ref.nextOffsetA,
      nextOffsetB = _ref.nextOffsetB,
      wasCorrected = _ref.wasCorrected;
  var encoded = encodeURIComponent(cleanQuery(query));

  var getLocalFromGlobalI18n = function getLocalFromGlobalI18n() {
    if (!window.I18n) {
      return 'en';
    } else {
      var _I18n = window.I18n,
          lang = _I18n.lang,
          langEnabled = _I18n.langEnabled;

      if (lang.indexOf('en') > -1 || !langEnabled) {
        return 'en';
      } else {
        return lang;
      }
    }
  };

  var localeParam = "&locale=" + (text('LANG_FROM_NAVCONFIG') || getLocalFromGlobalI18n());
  var typeParam = '';

  if (types) {
    for (var i = 0; i < types.length; i++) {
      typeParam += "&type=" + types[i];
    }
  }

  var limitParam = limit ? "&limit=" + limit : '';
  var offsetParam = offset ? "&offset=" + offset : '';
  var offsetAParam = offsetA ? "&offsetA=" + offsetA : '';
  var offsetBParam = offsetB ? "&offsetB=" + offsetB : '';
  var nextOffsetParam = nextOffset ? "&nextOffset=" + nextOffset : '';
  var nextOffsetAParam = nextOffsetA ? "&nextOffsetA=" + nextOffsetA : '';
  var nextOffsetBParam = nextOffsetB ? "&nextOffsetB=" + nextOffsetB : '';
  var wasCorrectedParam = wasCorrected ? '&wasCorrected=true' : '';
  var path = "/search/v2/search?query=" + encoded + "&portalId=" + getPortalId() + localeParam + typeParam + limitParam + offsetParam + nextOffsetParam + offsetAParam + offsetBParam + nextOffsetAParam + nextOffsetBParam + wasCorrectedParam;

  var setReturnables = function setReturnables(response) {
    corrId = response && response.correlationId;
    successCallback(response);
  };

  GET(path, setReturnables, {
    localOverride: 'NAVIGATION_SEARCH_ENV',
    subDomain: 'api',
    maxRetries: 5,
    onError: function onError(code) {
      if (code === 400) {
        successCallback({});
        return true;
      }

      return false;
    }
  });
}
export function getRecents(successCallback) {
  var path = "/search/v2/recent?portalId=" + getPortalId();
  GET(path, successCallback, {
    localOverride: 'NAVIGATION_SEARCH_ENV',
    subDomain: 'api',
    maxRetries: 2
  });
}
export function saveRecentSearch(data, testCorrId) {
  var payload = Object.assign({
    correlationId: corrId || testCorrId
  }, data);
  var path = "/search/v2/recent?portalId=" + getPortalId() + "&query=" + (data.query || null);
  POST(path, payload, undefined, {
    localOverride: 'NAVIGATION_SEARCH_ENV'
  });
}
export function sendFeedback(_ref2) {
  var body = _ref2.body,
      onSuccess = _ref2.onSuccess,
      onFail = _ref2.onFail;
  var payload = Object.assign({
    portalId: getPortalId()
  }, body);
  var path = "/search-feedback/v1/feedback?portalId=" + getPortalId();
  var baseUrl = isQA() ? "https://api.hubspotqa.com" : "https://api.hubspot.com";
  var request = new XMLHttpRequest();
  request.open('POST', "" + baseUrl + path);
  setBaseRequestProps(request, {});

  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      onSuccess();
    } else {
      onFail();
    }
  };

  request.onerror = function () {
    onFail();
  };

  request.send(JSON.stringify(payload));
}
export function getCustomObjects(successCallback) {
  var path = "/crm-object-schemas/v3/schemas?portalId=" + getPortalId();
  GET(path, successCallback, {
    localOverride: 'NAVIGATION_SEARCH_ENV',
    subDomain: 'api',
    maxRetries: 2
  });
}