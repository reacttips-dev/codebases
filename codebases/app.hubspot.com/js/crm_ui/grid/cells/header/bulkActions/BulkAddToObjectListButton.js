'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionButton from './BulkActionButton';
import BulkActionsModalContext from '../../../../lists/context/BulkActionsModalContext';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import { CrmLogger } from 'customer-data-tracking/loggers';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { useContext } from 'react';

var BulkAddToObjectListButton = function BulkAddToObjectListButton(_ref) {
  var bulkActionProps = _ref.bulkActionProps,
      options = _ref.options;
  var modalContext = useContext(BulkActionsModalContext);
  var isSelectionGreaterThanView = bulkActionProps.isSelectionGreaterThanView;

  var onClick = function onClick() {
    modalContext.addToObjectList.open(bulkActionProps);
    CrmLogger.log('indexInteractions', {
      action: 'open bulk add to list modal'
    });
  };

  return /*#__PURE__*/_jsx(BulkActionButton, {
    "data-selenium-test": "bulk-action-add-to-object-list",
    disabled: isSelectionGreaterThanView,
    disabledTooltip: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "topbarContents.addToListDisabled"
    }),
    icon: "bulletList",
    onClick: onClick,
    options: options,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "topbarContents.addToList"
    })
  });
};

BulkAddToObjectListButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object
};
export default BulkAddToObjectListButton;