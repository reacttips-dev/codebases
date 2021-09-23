'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom';
import devLogger from 'react-utils/devLogger';
import { getDefaultNode } from '../utils/RootNode';
import UIFullScreen from '../dialog/UIFullScreen';
/**
 * @param  {React.Component}
 * @param  {HTMLElement}
 * @param  {?Object}
 * @param  {?React.Component} parentComponent - ReactComponent instance
 * @return {Promise}
 */

function doPrompt(Component, contextRootNode, additionalProps, parentComponent) {
  var element = document.createElement('div');

  var promiseCallback = function promiseCallback(resolve, reject) {
    var WrappedComponent = /*#__PURE__*/_jsx(UIFullScreen, {
      "data-layer-for": "Promptable",
      rootNode: contextRootNode,
      children: /*#__PURE__*/_jsx(Component, Object.assign({}, additionalProps, {
        onConfirm: resolve,
        onReject: reject
      }))
    });

    if (parentComponent) {
      ReactDOM.unstable_renderSubtreeIntoContainer(parentComponent, WrappedComponent, element);
    } else {
      ReactDOM.render(WrappedComponent, element);
    }
  };

  var promise = new Promise(promiseCallback);
  return promise.finally(function () {
    ReactDOM.unmountComponentAtNode(element);
  });
}
/**
 * @param  {React.Component}
 * @param  {HTMLElement}
 * @return {(additionalProps: ?Object) => Promise}
 */


export default function Promptable(Component) {
  var contextRootNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDefaultNode();
  devLogger.warn({
    message: 'Promptable: The `Promptable` function is deprecated. Try mounting `UIModal` directly.',
    url: 'https://git.hubteam.com/HubSpot/UIComponents/issues/7435',
    key: 'promptable-deprecation'
  });
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return doPrompt.apply(void 0, [Component, contextRootNode].concat(args));
  };
}