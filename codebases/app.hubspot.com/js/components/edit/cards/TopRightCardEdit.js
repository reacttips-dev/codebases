'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { canWrite } from 'SequencesUI/lib/permissions';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';

var TopRightCardEdit = function TopRightCardEdit(_ref) {
  var titleUse = _ref.titleUse,
      isFirst = _ref.isFirst,
      isLast = _ref.isLast,
      moveCardUp = _ref.moveCardUp,
      moveCardDown = _ref.moveCardDown,
      handleEdit = _ref.handleEdit,
      handleDelete = _ref.handleDelete,
      disabled = _ref.disabled;
  return canWrite() ? /*#__PURE__*/_jsx(UIDropdown, {
    "data-selenium-test": "builder-card-actions-dropdown",
    buttonUse: titleUse === 'oz' ? 'link-on-bright' : 'link-on-dark',
    buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.cardActions.actions"
    }),
    placement: "bottom left",
    disabled: disabled,
    children: /*#__PURE__*/_jsxs(UIList, {
      children: [handleEdit && /*#__PURE__*/_jsx(UIButton, {
        onClick: handleEdit,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.cardActions.editTask"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: moveCardUp,
        disabled: isFirst,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.cardActions.moveUp"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: moveCardDown,
        disabled: isLast,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.cardActions.moveDown"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        "data-selenium-test": "delete-sequence-step-button",
        onClick: handleDelete,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.cardActions.delete"
        })
      })]
    })
  }) : null;
};

TopRightCardEdit.propTypes = {
  titleUse: PropTypes.string.isRequired,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  moveCardUp: PropTypes.func,
  moveCardDown: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  disabled: PropTypes.bool
};
export default TopRightCardEdit;