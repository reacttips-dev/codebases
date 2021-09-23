'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import debounce from 'transmute/debounce';
import get from 'transmute/get';
import isEmpty from 'transmute/isEmpty';
import invariant from 'react-utils/invariant';
/**
 * makeRequestBody - A function that, given an object of requestKeys to
 * requestOptions (the options passed to `fetch`), returns a value that will be
 * passed to the API and used to build the request. Note that APIs can modifiy
 * this value after it's received, this just builds the parameter that's passed
 * to `api`.
 *
 * makeRequestKey - A pure function that, given requestOptions, returns a unique
 * key for a request. This key will be used to index the cache and to identify
 * duplicate requests. This key must always be the same for a given input of
 * request options.
 *
 * api - The API to call with the batched requests. This API should always return
 * data in the format described below. It will received a single object as an
 * argument with a key in it called requestBody which is the request body
 * created by makeRequestBody
 *
 * Required api return format example:
 * {
 *   [requestKey]: <value that will be returned by the request matching the requestKey>
 * }
 *
 * requestKey in the above example is the same value that's returned by
 * makeRequestKey. The client requires the result of the API to be mapped to
 * existing requestKey's so it knows which value to resolve each promise with.
 *
 * options - An object of options to configure the client.
 *   - MAX_REQUEST_SIZE - The maximum number of requests the client will queue
 *     before it fires a request to the batch api. Defaults to 50.
 */

var BatchRequestClient = /*#__PURE__*/function () {
  function BatchRequestClient(_ref) {
    var _this = this;

    var api = _ref.api,
        makeRequestBody = _ref.makeRequestBody,
        makeRequestKey = _ref.makeRequestKey,
        _ref$options = _ref.options;
    _ref$options = _ref$options === void 0 ? {
      MAX_REQUEST_SIZE: 50
    } : _ref$options;
    var MAX_REQUEST_SIZE = _ref$options.MAX_REQUEST_SIZE;

    _classCallCheck(this, BatchRequestClient);

    this.fetchQueuedRequests = function () {
      if (isEmpty(_this.queuedRequests)) {
        return;
      }

      var requestOptionsByKey = Object.keys(_this.queuedRequests).reduce(function (acc, key) {
        return Object.assign({}, acc, _defineProperty({}, key, _this.queuedRequests[key].requestOptions));
      }, {});
      _this.requestsInProgress = Object.assign({}, _this.requestsInProgress, {}, _this.queuedRequests);
      _this.queuedRequests = {};

      var requestBody = _this.makeRequestBody(requestOptionsByKey);

      _this.api({
        requestBody: requestBody
      }).then(function (response) {
        return Object.keys(response).forEach(function (requestKey) {
          var request = get(requestKey, _this.requestsInProgress);

          if (request) {
            var results = response[requestKey];
            request.entry.resolve(results);
            _this.cache[requestKey] = results;
            delete _this.requestsInProgress[requestKey];
          }
        });
      }).done();
    };

    this.debouncedFetchQueuedRequests = debounce(500, this.fetchQueuedRequests);

    this.queueRequest = function (requestKey, requestOptions) {
      if (_this.cache[requestKey]) {
        return Promise.resolve(_this.cache[requestKey]);
      }

      var existingRequest = _this.requestsInProgress[requestKey] || _this.queuedRequests[requestKey]; // If the request already exists just return the existing promise. We don't
      // support changing request options for requests that are already queued.

      if (existingRequest) {
        return existingRequest.entry.promise;
      }

      var entry = {};
      var promise = new Promise(function (resolve, reject) {
        entry.resolve = resolve;
        entry.reject = reject;
      });
      entry.promise = promise;
      _this.queuedRequests[requestKey] = {
        entry: entry,
        requestOptions: requestOptions
      }; // If we hit the max size for a request send one off, otherwise call the
      // debounced version to wait a bit for any other requests before firing

      if (Object.keys(_this.queuedRequests).length >= _this.MAX_REQUEST_SIZE) {
        _this.fetchQueuedRequests();
      } else {
        _this.debouncedFetchQueuedRequests();
      }

      return entry.promise;
    };

    invariant(typeof api === 'function', 'api function must be provided to BatchRequestClient');
    invariant(typeof makeRequestBody === 'function', 'makeRequestBody function must be provided to BatchRequestClient');
    invariant(typeof makeRequestKey === 'function', 'makeRequestKey function must be provided to BatchRequestClient');
    invariant(MAX_REQUEST_SIZE && MAX_REQUEST_SIZE > 1, 'MAX_REQUEST_SIZE must be at least 2');
    this.cache = {};
    this.queuedRequests = {};
    this.requestsInProgress = {};
    this.api = api;
    this.makeRequestBody = makeRequestBody;
    this.makeRequestKey = makeRequestKey;
    this.MAX_REQUEST_SIZE = MAX_REQUEST_SIZE;
  }

  _createClass(BatchRequestClient, [{
    key: "fetch",
    value: function fetch(requestOptions) {
      var requestKey = this.makeRequestKey(requestOptions);
      return this.queueRequest(requestKey, requestOptions);
    }
  }]);

  return BatchRequestClient;
}();

export default BatchRequestClient;