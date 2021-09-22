/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+relay
 * 
 * @format
 */
// flowlint ambiguous-object-type:error
'use strict';

var _require = require('react'),
    useCallback = _require.useCallback,
    useEffect = _require.useEffect,
    useRef = _require.useRef;

/**
 * This hook returns a mutable React ref that holds the value of whether a
 * fetch request is in flight. The reason this is a mutable ref instead of
 * state is because we don't actually want to trigger an update when this
 * changes, but instead synchronously keep track of whether the network request
 * is in flight, for example in order to bail out of a request if one is
 * already in flight. If this was state, due to the nature of concurrent
 * updates, this value wouldn't be in sync with when the request is actually
 * in flight.
 * The additional functions returned by this Hook can be used to mutate
 * the ref.
 */
function useFetchTrackingRef() {
  var subscriptionRef = useRef(null);
  var isFetchingRef = useRef(false);
  var disposeFetch = useCallback(function () {
    if (subscriptionRef.current != null) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    isFetchingRef.current = false;
  }, []);
  var startFetch = useCallback(function (subscription) {
    subscriptionRef.current = subscription;
    isFetchingRef.current = true;
  }, []);
  var completeFetch = useCallback(function () {
    subscriptionRef.current = null;
    isFetchingRef.current = false;
  }, []); // Dipose of ongoing fetch on unmount

  useEffect(function () {
    return disposeFetch;
  }, [disposeFetch]);
  return {
    isFetchingRef: isFetchingRef,
    startFetch: startFetch,
    disposeFetch: disposeFetch,
    completeFetch: completeFetch
  };
}

module.exports = useFetchTrackingRef;