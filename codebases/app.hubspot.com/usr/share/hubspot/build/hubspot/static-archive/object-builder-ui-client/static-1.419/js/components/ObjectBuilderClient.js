'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { getFullUrl } from 'hubspot-url-utils';
import PropTypes from 'prop-types';
import PortalIdParser from 'PortalIdParser';
import { stringify } from 'hub-http/helpers/params';
import UIModalIFrame from 'ui-addon-iframeable/host/UIModalIFrame';
import { useQueryParams } from '../utils/useQueryParams';

var ObjectBuilderClient = function ObjectBuilderClient(_ref) {
  var appInfo = _ref.appInfo,
      _ref$appName = _ref.appName,
      appName = _ref$appName === void 0 ? 'object-builder-ui' : _ref$appName,
      objectTypeId = _ref.objectTypeId,
      onClose = _ref.onClose,
      _ref$onInitError = _ref.onInitError,
      onInitError = _ref$onInitError === void 0 ? function () {} : _ref$onInitError,
      _ref$onMessage = _ref.onMessage,
      onMessage = _ref$onMessage === void 0 ? function () {} : _ref$onMessage,
      _ref$onReady = _ref.onReady,
      onReady = _ref$onReady === void 0 ? function () {} : _ref$onReady,
      _ref$onReadyError = _ref.onReadyError,
      onReadyError = _ref$onReadyError === void 0 ? function () {} : _ref$onReadyError,
      _ref$show = _ref.show,
      show = _ref$show === void 0 ? true : _ref$show;

  var _useQueryParams = useQueryParams(),
      gated = _useQueryParams.gated,
      ungated = _useQueryParams.ungated;

  return /*#__PURE__*/_jsx(UIModalIFrame, {
    appName: appName,
    appInfo: appInfo,
    height: "100%",
    iframePassthruProps: {
      id: 'object-builder-ui'
    },
    onClose: onClose,
    onInitError: onInitError,
    onMessage: onMessage,
    onReady: onReady,
    onReadyError: onReadyError,
    show: show,
    src: getFullUrl('app') + "/object-builder/" + PortalIdParser.get() + "/" + objectTypeId + "/embed?" + stringify({
      gated: gated,
      ungated: ungated
    }),
    width: 600,
    use: "panel"
  });
};

ObjectBuilderClient.propTypes = {
  appInfo: PropTypes.object.isRequired,
  appName: PropTypes.string,
  objectTypeId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onInitError: PropTypes.func,
  onMessage: PropTypes.func,
  onReady: PropTypes.func,
  onReadyError: PropTypes.func,
  show: PropTypes.bool
};
export default ObjectBuilderClient;