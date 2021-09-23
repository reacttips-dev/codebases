'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { useIsDeleteDisabledAndTooltip } from '../hooks/useIsDeleteDisabledAndTooltip';
import { useModalActions } from '../../overlay/hooks/useModalActions';

var BulkDeleteButton = function BulkDeleteButton(_ref) {
  var selection = _ref.selection,
      canEditSelection = _ref.canEditSelection,
      isSelectingEntireQuery = _ref.isSelectingEntireQuery,
      onConfirmBulkAction = _ref.onConfirmBulkAction;

  var _useModalActions = useModalActions(),
      openBulkDeleteModal = _useModalActions.openBulkDeleteModal;

  var handleClick = useCallback(function () {
    return openBulkDeleteModal({
      selection: selection,
      onConfirm: onConfirmBulkAction,
      isSelectingEntireQuery: isSelectingEntireQuery
    });
  }, [isSelectingEntireQuery, onConfirmBulkAction, openBulkDeleteModal, selection]);

  var _useIsDeleteDisabledA = useIsDeleteDisabledAndTooltip({
    canEditSelection: canEditSelection,
    isSelectingEntireQuery: isSelectingEntireQuery
  }),
      disabled = _useIsDeleteDisabledA.disabled,
      disabledTooltipMessage = _useIsDeleteDisabledA.disabledTooltipMessage;

  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: !disabled,
    title: disabled && /*#__PURE__*/_jsx(FormattedMessage, {
      message: disabledTooltipMessage
    }),
    children: /*#__PURE__*/_jsxs(UIButton, {
      "data-selenium-test": "bulk-action-delete",
      use: "link",
      onClick: handleClick,
      disabled: disabled,
      children: [/*#__PURE__*/_jsx(UIIcon, {
        className: "m-right-1",
        name: "delete"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.bulkActions.delete"
      })]
    })
  });
};

BulkDeleteButton.propTypes = {
  selection: PropTypes.instanceOf(ImmutableSet),
  canEditSelection: PropTypes.bool.isRequired,
  isSelectingEntireQuery: PropTypes.bool.isRequired,
  onConfirmBulkAction: PropTypes.func.isRequired
};
export default BulkDeleteButton;