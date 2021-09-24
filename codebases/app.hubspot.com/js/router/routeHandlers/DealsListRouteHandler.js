'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { generatePath, Redirect } from 'react-router-dom';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import { transformDefault } from '../utils/transformDefault';

var DealsListRouteHandler = function DealsListRouteHandler(_ref) {
  var viewId = _ref.match.params.viewId,
      location = _ref.location;
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    var path = viewId ? generatePath('/objects/0-3/views/:viewId/list', {
      viewId: viewId
    }) : '/objects/0-3/list';
    return /*#__PURE__*/_jsx(Redirect, {
      to: Object.assign({}, location, {
        pathname: path
      })
    });
  }

  var DealsIndexRoute = transformDefault(require('../../routes/DealsIndexRoute')).default;
  return /*#__PURE__*/_jsx(DealsIndexRoute, {});
};

DealsListRouteHandler.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      viewId: PropTypes.string
    })
  }),
  location: PropTypes.object.isRequired
};
export default DealsListRouteHandler;