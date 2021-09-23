'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import { getFullUrl } from 'hubspot-url-utils';
import PortalIdParser from 'PortalIdParser';
import UIModalIFrame from 'ui-addon-iframeable/host/UIModalIFrame';
import ObjectTypeIdType from 'customer-data-objects-ui-components/propTypes/ObjectTypeIdType';
import invariant from 'react-utils/invariant';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { denormalizeTypeId } from '../rewrite/utils/denormalizeTypeId';
export var IFRAME_INIT_ERROR = 'IFrame initialization failed';

var getObjectBuilderUrl = function getObjectBuilderUrl(objectTypeId) {
  return getFullUrl('app') + "/object-builder/" + PortalIdParser.get() + "/" + encodeURIComponent(objectTypeId) + "/embed";
};

var defaultIframePassthruProps = {
  id: 'object-builder-ui'
};

var ObjectBuilder = function ObjectBuilder(_ref) {
  var isCrmObject = _ref.isCrmObject,
      objectTypeId = _ref.objectTypeId,
      onCreateObjectSuccess = _ref.onCreateObjectSuccess,
      onCreateObjectFailure = _ref.onCreateObjectFailure;
  invariant(isCrmObject, "Cannot use Universal Object Builder with non CrmObject object type " + objectTypeId);
  var handleClose = useCallback(function (_ref2) {
    var addAnother = _ref2.addAnother,
        createdObjectId = _ref2.createdObjectId,
        error = _ref2.error,
        createdObjectTypeId = _ref2.createdObjectTypeId;

    if (createdObjectId) {
      if (onCreateObjectSuccess) {
        onCreateObjectSuccess({
          addAnother: addAnother,
          createdObjectId: createdObjectId,
          createdObjectTypeId: createdObjectTypeId
        });
        CrmLogger.log('createRecord', {
          type: objectTypeId.startsWith('2-') ? 'custom' : denormalizeTypeId(objectTypeId),
          objectTypeId: objectTypeId
        });
      }
    } else {
      // `error` will be undefined if the user cancelled the modal by clicking the 'X' or 'Cancel' buttons
      if (onCreateObjectFailure) {
        onCreateObjectFailure({
          error: error
        });
      }
    }
  }, [onCreateObjectSuccess, onCreateObjectFailure, objectTypeId]); // unable to initialize the iframe (onInitError), or unable to establish
  // communication with the iframe within a timeout (onReadyError).
  // close the panel so the user isn't stuck looking at an empty panel.

  var handleIFrameError = useCallback(function () {
    onCreateObjectFailure({
      error: new Error(IFRAME_INIT_ERROR),
      fatal: true
    });
  }, [onCreateObjectFailure]);
  return /*#__PURE__*/_jsx(UIModalIFrame, {
    appName: "crm-index-ui",
    height: "100%",
    iframePassthruProps: defaultIframePassthruProps,
    onClose: handleClose,
    onInitError: handleIFrameError,
    onMessage: emptyFunction,
    onReady: emptyFunction,
    onReadyError: handleIFrameError,
    show: true,
    src: getObjectBuilderUrl(objectTypeId),
    width: 600,
    use: "panel"
  });
};

ObjectBuilder.propTypes = {
  isCrmObject: PropTypes.bool.isRequired,
  objectTypeId: ObjectTypeIdType.isRequired,
  onCreateObjectSuccess: PropTypes.func,
  onCreateObjectFailure: PropTypes.func
};
export default ObjectBuilder;