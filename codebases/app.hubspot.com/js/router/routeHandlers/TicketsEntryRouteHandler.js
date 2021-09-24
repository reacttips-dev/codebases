'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import { transformDefault } from '../utils/transformDefault';

var TicketsEntryRouteHandler = function TicketsEntryRouteHandler(_ref) {
  var location = _ref.location;
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    return /*#__PURE__*/_jsx(Redirect, {
      to: Object.assign({}, location, {
        pathname: '/objects/0-5'
      })
    });
  }

  var TicketsEntryRoute = transformDefault(require('../../routes/TicketsEntryRoute')).default;
  return /*#__PURE__*/_jsx(TicketsEntryRoute, {});
};

TicketsEntryRouteHandler.propTypes = {
  location: PropTypes.object.isRequired
};
export default TicketsEntryRouteHandler;