'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionButton from './BulkActionButton';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import StaticListMembershipsContainer from '../../../../listMembership/StaticListMembershipsContainer';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { CrmLogger, ListsLogger } from 'customer-data-tracking/loggers';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';
import { createElement } from 'react';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import Promptable from 'UIComponents/decorators/Promptable';

var BulkAddToListButton = function BulkAddToListButton(_ref) {
  var bulkActionProps = _ref.bulkActionProps,
      options = _ref.options;

  var _bulkActionProps$toJS = bulkActionProps.toJS(),
      allSelected = _bulkActionProps$toJS.allSelected,
      listId = _bulkActionProps$toJS.listId,
      selectionCount = _bulkActionProps$toJS.selectionCount,
      checked = _bulkActionProps$toJS.checked,
      query = _bulkActionProps$toJS.query;

  var onClick = function onClick() {
    Promptable(StaticListMembershipsContainer)({
      objectType: CONTACT,
      isBulkAdd: true,
      objectCount: selectionCount,
      allContactsSelected: allSelected,
      selectedVids: checked,
      fromListId: listId
    }).then(function () {
      ListsLogger.log('bulkAddToList', {
        objectTypeId: CONTACT_TYPE_ID,
        screen: listId ? 'list-detail' : 'contacts',
        subscreen: 'index',
        subscreen2: 'bulk-list-modal'
      });
    }, rethrowError);
    CrmLogger.log('indexInteractions', {
      action: 'open bulk add to list modal'
    });
  };

  var disabled = false; // not viewing a list and more then a page is selected

  if (allSelected && !listId) {
    disabled = true;
  } // viewing a list, more then a page is selected and the is a filter applied


  if (allSelected && listId && query.query.length) {
    disabled = true;
  }

  return /*#__PURE__*/_jsx(BulkActionButton, {
    disabled: disabled,
    disabledTooltip: /*#__PURE__*/createElement(FormattedReactMessage, {
      message: 'topbarContents.addToListDisabled'
    }),
    icon: "bulletList",
    onClick: onClick,
    options: options,
    title: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "topbarContents.addToList"
    })
  });
};

BulkAddToListButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object
};
export default BulkAddToListButton;