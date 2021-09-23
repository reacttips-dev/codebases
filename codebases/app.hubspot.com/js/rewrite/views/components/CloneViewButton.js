'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { useModalActions } from '../../overlay/hooks/useModalActions';

var CloneViewButton = function CloneViewButton(_ref) {
  var view = _ref.view,
      onClick = _ref.onClick;

  var _useModalActions = useModalActions(),
      openCloneViewModal = _useModalActions.openCloneViewModal;

  var handleClick = useCallback(function (event) {
    openCloneViewModal(view.id);
    onClick(event);
  }, [onClick, openCloneViewModal, view.id]);
  return /*#__PURE__*/_jsx(UIButton, {
    "data-selenium-test": "view-clone-btn",
    use: "link",
    onClick: handleClick,
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.views.buttons.clone"
    })
  });
};

CloneViewButton.propTypes = {
  view: PropTypes.instanceOf(ViewRecord).isRequired,
  onClick: PropTypes.func.isRequired
};
export default CloneViewButton;