'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Set as ImmutableSet } from 'immutable';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import { useIsEditDisabledAndTooltip } from '../hooks/useIsEditDisabledAndTooltip';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { useModalActions } from '../../overlay/hooks/useModalActions';

var BulkEditButton = function BulkEditButton(_ref) {
  var selection = _ref.selection,
      canEditSelection = _ref.canEditSelection,
      isSelectingEntireQuery = _ref.isSelectingEntireQuery;

  var _useModalActions = useModalActions(),
      openBulkEditModal = _useModalActions.openBulkEditModal;

  var handleClick = useCallback(function () {
    return openBulkEditModal({
      selection: selection,
      isSelectingEntireQuery: isSelectingEntireQuery
    });
  }, [isSelectingEntireQuery, openBulkEditModal, selection]);

  var _useIsEditDisabledAnd = useIsEditDisabledAndTooltip({
    canEditSelection: canEditSelection,
    isSelectingEntireQuery: isSelectingEntireQuery
  }),
      disabled = _useIsEditDisabledAnd.disabled,
      disabledTooltipMessage = _useIsEditDisabledAnd.disabledTooltipMessage;

  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: !disabled,
    title: disabled && /*#__PURE__*/_jsx(FormattedMessage, {
      message: disabledTooltipMessage
    }),
    children: /*#__PURE__*/_jsxs(UIButton, {
      "data-selenium-test": "bulk-action-edit",
      use: "link",
      disabled: disabled,
      onClick: handleClick,
      children: [/*#__PURE__*/_jsx(UIIcon, {
        className: "m-right-1",
        name: "edit"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.bulkActions.edit"
      })]
    })
  });
};

BulkEditButton.propTypes = {
  selection: PropTypes.instanceOf(ImmutableSet).isRequired,
  canEditSelection: PropTypes.bool.isRequired,
  isSelectingEntireQuery: PropTypes.bool.isRequired
};
export default BulkEditButton;