'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import { transformDefault } from '../utils/transformDefault';

var DealsEntryRouteHandler = function DealsEntryRouteHandler(_ref) {
  var location = _ref.location;
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    return /*#__PURE__*/_jsx(Redirect, {
      to: Object.assign({}, location, {
        pathname: '/objects/0-3'
      })
    });
  }

  var DealsEntryRoute = transformDefault(require('../../routes/DealsEntryRoute')).default;
  return /*#__PURE__*/_jsx(DealsEntryRoute, {});
};

DealsEntryRouteHandler.propTypes = {
  location: PropTypes.object.isRequired
};
export default DealsEntryRouteHandler;