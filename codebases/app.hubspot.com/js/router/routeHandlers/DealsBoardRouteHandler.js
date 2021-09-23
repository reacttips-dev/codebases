'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { generatePath, Redirect } from 'react-router-dom';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import { makeAsyncRoute } from '../../routes/makeAsyncRoute';
export var DealsBoardRouteAsync = makeAsyncRoute(function () {
  return import(
  /* webpackChunkName: "deals-board-route" */
  '../../routes/DealsBoardRoute').then(function (mod) {
    return mod.default;
  });
}, 'deals-board-route');

var DealsBoardRouteHandler = function DealsBoardRouteHandler(_ref) {
  var viewId = _ref.match.params.viewId,
      location = _ref.location;
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    var path = viewId ? generatePath('/objects/0-3/views/:viewId/board', {
      viewId: viewId
    }) : '/objects/0-3/board';
    return /*#__PURE__*/_jsx(Redirect, {
      to: Object.assign({}, location, {
        pathname: path
      })
    });
  }

  return /*#__PURE__*/_jsx(DealsBoardRouteAsync, {});
};

DealsBoardRouteHandler.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      viewId: PropTypes.string
    })
  }),
  location: PropTypes.object.isRequired
};
export default DealsBoardRouteHandler;