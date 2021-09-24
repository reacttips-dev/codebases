'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import BulkActionButton from './BulkActionButton';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import BulkRemoveFromObjectListModal from '../../../../lists/modals/BulkRemoveFromObjectListModal';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { isObjectTypeId, ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import PropTypes from 'prop-types';
import { useState } from 'react';

var BulkRemoveFromObjectListButton = function BulkRemoveFromObjectListButton(_ref) {
  var bulkActionProps = _ref.bulkActionProps,
      options = _ref.options;
  var checked = bulkActionProps.checked,
      clearSelection = bulkActionProps.clearSelection,
      isSelectionGreaterThanView = bulkActionProps.isSelectionGreaterThanView,
      listId = bulkActionProps.listId,
      objectType = bulkActionProps.objectType;
  var objectTypeId = isObjectTypeId(objectType) ? objectType : ObjectTypesToIds[objectType];

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isModalOpen = _useState2[0],
      setIsModalOpen = _useState2[1];

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [isModalOpen && /*#__PURE__*/_jsx(BulkRemoveFromObjectListModal, {
      clearSelection: clearSelection,
      listId: listId,
      ids: checked,
      objectTypeId: objectTypeId,
      onReject: function onReject() {
        return setIsModalOpen(false);
      }
    }), /*#__PURE__*/_jsx(BulkActionButton, {
      "data-selenium-test": "bulk-action-remove-from-object-list",
      disabled: isSelectionGreaterThanView,
      disabledTooltip: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "topbarContents.removeFromListDisabled"
      }),
      icon: "minus",
      onClick: function onClick() {
        return setIsModalOpen(true);
      },
      options: options,
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "topbarContents.removeFromList"
      })
    })]
  });
};

BulkRemoveFromObjectListButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object
};
export default BulkRemoveFromObjectListButton;