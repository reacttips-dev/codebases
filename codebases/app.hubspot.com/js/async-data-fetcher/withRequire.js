'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { getStatus, getData } from 'conversations-async-data/async-data/operators/getters';
/**
 * Component HOC for resolving props {data, status, retry} from fetchAsyncDataHOC & AsyncData
 *
 * @param {Function} RequireComponent
 * @returns {Function}
 */

export var withRequire = function withRequire(RequireComponent) {
  return function (resolveProps) {
    return function (Component) {
      var resultFunc = function resultFunc(props) {
        return /*#__PURE__*/_jsx(RequireComponent, Object.assign({}, props, {
          children: function children(_ref) {
            var asyncData = _ref.asyncData,
                retry = _ref.retry;
            var data = getData(asyncData);
            var dataProps = {
              data: data,
              status: getStatus(asyncData)
            };

            if (typeof resolveProps === 'function') {
              dataProps = resolveProps(dataProps);
            }

            return /*#__PURE__*/_jsx(Component, Object.assign({}, dataProps, {
              retry: retry
            }, props));
          }
        }));
      };

      resultFunc.wrappedInstance = Component;
      return resultFunc;
    };
  };
};