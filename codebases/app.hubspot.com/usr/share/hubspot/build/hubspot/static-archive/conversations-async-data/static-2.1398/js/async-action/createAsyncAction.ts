import invariant from '../lib/invariant';
import isActionType from '../lib/isActionType';

var isFunction = function isFunction(maybeFn) {
  return typeof maybeFn === 'function';
};

var isObject = function isObject(maybeObj) {
  return typeof maybeObj === 'object' && !Array.isArray(maybeObj);
};

var areValidActionTypes = function areValidActionTypes(actionTypes) {
  return isObject(actionTypes) && isActionType(actionTypes.SUCCEEDED) && isActionType(actionTypes.STARTED) && isActionType(actionTypes.FAILED);
};

var buildAsyncActionDispatcher = function buildAsyncActionDispatcher(_ref) {
  var actionTypes = _ref.actionTypes,
      failureMetaActionCreator = _ref.failureMetaActionCreator,
      successMetaActionCreator = _ref.successMetaActionCreator,
      toRecordFn = _ref.toRecordFn;
  return function (requestPromise, requestArgs) {
    return function (dispatch) {
      var STARTED = actionTypes.STARTED,
          SUCCEEDED = actionTypes.SUCCEEDED,
          FAILED = actionTypes.FAILED;
      dispatch({
        type: STARTED,
        payload: {
          requestArgs: requestArgs
        }
      });
      requestPromise.then(function (resp) {
        var payload = {
          requestArgs: requestArgs,
          data: toRecordFn(resp)
        };
        dispatch({
          type: SUCCEEDED,
          payload: payload,
          meta: successMetaActionCreator(payload)
        });
      }, function (error) {
        var payload = {
          requestArgs: requestArgs,
          error: error
        };
        dispatch({
          type: FAILED,
          payload: payload,
          meta: failureMetaActionCreator(payload)
        });
      }) // @ts-expect-error - done is not on the native Promise prototype
      .done();
      return;
    };
  };
};
/**
 * createAsyncAction is a utility for creating generic thunks that
 * make some asynchronous request.
 *
 * Use Cases:
 * - Fetch an individual record with a custom error metadata builder
 * - Fetch a list of records
 *
 * @param {Object|Map} props
 * @param {Object} [props.actionTypes] an object containing string values for 'SUCCEEDED',
 *                                     'FAILED', and 'STARTED' keys.
 * @param {Function} [props.requestFn] a request function that returns a promise
 * @param {Function} [props.toRecordFn] converts the resolved value from requestFn to a record
 * @param {Function} [props.failureMetaActionCreator] builds a `meta` object on failure
 * @param {Function} [props.successMetaActionCreator] builds a `meta` object on success
 *
 * @example <caption>An individual record is fetched</caption>
 * const Thread = Record({threadId: null})
 * const fetchThread = createAsyncAction({
 *   actionTypes: {
 *     SUCCEEDED: 'FETCH_THREAD_SUCCEEDED',
 *     STARTED: 'FETCH_THREAD_STARTED',
 *     FAILED: "FETCH_THREAD_FAILED",
 *   },
 *   requetsFn: fetchThreadClient,
 *   toRecordFn: Thread,
 *   failureMetaActionCreator: (error) => {
 *     if(error.status === 404) {
 *       return alertMeta
 *     }
 *   }
 * })
 *
 * dispatch(fetchThread({threadId: 123}))
 *
 * @example <caption>A list of records is fetched</caption>
 * const Thread = Record({threadId: null})
 * const fetchThreads = createAsyncAction({
 *   actionTypes: {
 *     SUCCEEDED: 'FETCH_THREADS_SUCCEEDED',
 *     STARTED: 'FETCH_THREADS_STARTED',
 *     FAILED: "FETCH_THREADS_FAILED",
 *   },
 *   requetsFn: fetchThreadsClient,
 *   toRecordFn: (threads) => List(threads.map(Thread)),
 * })
 *
 * dispatch(fetchThreads({threadListId: 321}))
 */


export var createAsyncAction = function createAsyncAction(_ref2) {
  var actionTypes = _ref2.actionTypes,
      requestFn = _ref2.requestFn,
      toRecordFn = _ref2.toRecordFn,
      _ref2$failureMetaActi = _ref2.failureMetaActionCreator,
      failureMetaActionCreator = _ref2$failureMetaActi === void 0 ? function () {
    return {};
  } : _ref2$failureMetaActi,
      _ref2$successMetaActi = _ref2.successMetaActionCreator,
      successMetaActionCreator = _ref2$successMetaActi === void 0 ? function () {
    return {};
  } : _ref2$successMetaActi;
  invariant(areValidActionTypes(actionTypes), "createAsyncAction expected actionTypes to be an Object containing valid type strings for keys: \"FAILED\", \"STARTED\", and \"SUCCEEDED\". Got: " + actionTypes);
  invariant(isFunction(requestFn), "createAsyncAction Expected requestFn to be a Function. Got: \"" + requestFn + "\"");
  invariant(isFunction(toRecordFn), "createAsyncAction expected toRecordFn to be a Function. Got: \"" + toRecordFn + "\"");
  var asyncActionDispatcher = buildAsyncActionDispatcher({
    actionTypes: actionTypes,
    failureMetaActionCreator: failureMetaActionCreator,
    successMetaActionCreator: successMetaActionCreator,
    toRecordFn: toRecordFn
  });

  var composed = function composed(requestArgs) {
    invariant(!requestArgs || isObject(requestArgs), "requestArgs must be an Object. Received " + typeof requestArgs);
    return asyncActionDispatcher(requestFn(requestArgs), requestArgs);
  };

  composed.asyncActionDispatcher = asyncActionDispatcher;
  return composed;
};