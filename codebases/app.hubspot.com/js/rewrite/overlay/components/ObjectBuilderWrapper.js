'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ObjectBuilder, { IFRAME_INIT_ERROR } from '../../../objectBuilder/ObjectBuilder';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useCrmObjectsActions } from '../../crmObjects/hooks/useCrmObjectsActions';
import { usePanelActions } from '../hooks/usePanelActions';
import { alertFailure } from '../../utils/alerts';

var getCreateObjectFailureMessage = function getCreateObjectFailureMessage(error) {
  var response = error.responseJSON;

  if (error.message === IFRAME_INIT_ERROR) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.objectBuilder.errorInitFailed"
    });
  } else if (response && response.message) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.objectBuilder.error"
    });
  }

  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.alerts.objectBuilder.errorUnknown"
  });
};

var ObjectBuilderWrapper = function ObjectBuilderWrapper() {
  var objectTypeId = useSelectedObjectTypeId();

  var _usePanelActions = usePanelActions(),
      closePanel = _usePanelActions.closePanel;

  var _useCrmObjectsActions = useCrmObjectsActions(),
      crmObjectCreated = _useCrmObjectsActions.crmObjectCreated;

  var handleCreateObjectSuccess = useCallback(function (_ref) {
    var _ref$addAnother = _ref.addAnother,
        addAnother = _ref$addAnother === void 0 ? false : _ref$addAnother,
        createdObjectId = _ref.createdObjectId,
        createdObjectTypeId = _ref.createdObjectTypeId;
    return crmObjectCreated({
      objectTypeId: createdObjectTypeId,
      objectId: Number(createdObjectId)
    }).then(function () {
      if (!addAnother) {
        closePanel();
      }
    }).catch();
  }, [closePanel, crmObjectCreated]);
  var handleCreateObjectFailure = useCallback(function () {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        error = _ref2.error,
        fatal = _ref2.fatal;

    if (error) {
      var message = getCreateObjectFailureMessage(error);
      alertFailure({
        message: message
      });
    }

    if (!error || fatal) {
      // Close the panel if the user cancelled it or if a fatal error occurs
      // (e.g., iframe initialization failed), otherwise leave it open so the
      // user doesn't lose any entered data
      closePanel();
    }
  }, [closePanel]);
  return /*#__PURE__*/_jsx(ObjectBuilder, {
    isCrmObject: true,
    objectTypeId: objectTypeId,
    onCreateObjectSuccess: handleCreateObjectSuccess,
    onCreateObjectFailure: handleCreateObjectFailure
  });
};

export default ObjectBuilderWrapper;