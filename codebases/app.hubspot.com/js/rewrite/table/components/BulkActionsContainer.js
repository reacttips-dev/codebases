'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';
import { Small } from 'UIComponents/elements';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useCanUserEditObjects } from '../../permissions/hooks/useCanUserEditObjects';
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, INVOICE_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import memoize from 'transmute/memoize';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import BulkDeleteButton from '../../crmObjects/components/BulkDeleteButton';
import BulkEditButton from '../../crmObjects/components/BulkEditButton';
import BulkAssignButton from '../../bulkActions/components/BulkAssignButton';
import BETBulkAssignButton from '../../bulkActions/components/BETBulkAssignButton';
import BETBulkRecycleButton from '../../bulkActions/components/BETBulkRecycleButton';
import BulkCreateTasksButton from '../../bulkActions/components/BulkCreateTasksButton';
import BulkAddToObjectListButton from '../../bulkActions/components/BulkAddToObjectListButton';
import BulkEnrollInSequenceButton from '../../bulkActions/components/BulkEnrollInSequenceButton';
import BulkAddToListButton from '../../bulkActions/components/BulkAddToListButton';
import BulkEnrollInWorkflowButton from '../../bulkActions/components/BulkEnrollInWorkflowButton';
import BulkAddGDPRLawfulBasisToProcessButton from '../../bulkActions/components/BulkAddGDPRLawfulBasisToProcessButton';
import BulkAddGDPRSubscriptionButton from '../../bulkActions/components/BulkAddGDPRSubscriptionButton';
import BulkUpdateDoubleOptInButton from '../../bulkActions/components/BulkUpdateDoubleOptInButton';
import BulkSendSurveyMonkeySurveyButton from '../../bulkActions/components/BulkSendSurveyMonkeySurveyButton';
import BulkSetMarketableButton from '../../bulkActions/components/BulkSetMarketableButton';
import BulkSetNonMarketableButton from '../../bulkActions/components/BulkSetNonMarketableButton';
import BulkMoveToClosedLostButton from '../../bulkActions/components/BulkMoveToClosedLostButton';
import { BulkActionsModalProvider } from '../../../crm_ui/lists/context/BulkActionsModalContext';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import LegacyBulkEditButton from '../../bulkActions/components/LegacyBulkEditButton';
import LegacyBulkDeleteButton from '../../bulkActions/components/LegacyBulkDeleteButton';
import { useHydratedSearchQuery } from '../../searchQuery/hooks/useHydratedSearchQuery';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import { useFetchDoubleOptInSetting } from '../../doubleOptIn/hooks/useFetchDoubleOptInSetting';
export var getBulkActionsByObjectTypeId = memoize(function (objectTypeId) {
  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      {
        return [BulkAssignButton, BETBulkAssignButton, BETBulkRecycleButton, LegacyBulkEditButton, LegacyBulkDeleteButton, BulkCreateTasksButton, BulkEnrollInSequenceButton];
      }

    case COMPANY_TYPE_ID:
      {
        return [BulkAssignButton, BETBulkAssignButton, BETBulkRecycleButton, LegacyBulkEditButton, LegacyBulkDeleteButton, BulkCreateTasksButton, BulkAddToObjectListButton];
      }

    case DEAL_TYPE_ID:
      {
        return [BulkAssignButton, LegacyBulkEditButton, LegacyBulkDeleteButton, BulkCreateTasksButton];
      }

    case TICKET_TYPE_ID:
      {
        return [BulkAssignButton, LegacyBulkEditButton, LegacyBulkDeleteButton, BulkCreateTasksButton];
      }

    case INVOICE_TYPE_ID:
      {
        return [BulkDeleteButton];
      }

    default:
      {
        return [BulkEditButton, BulkDeleteButton];
      }
  }
});
export var getMoreActionsDropdownButtonsByObjectTypeId = memoize(function (objectTypeId) {
  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      {
        return [BulkAddToListButton, BulkEnrollInWorkflowButton, BulkAddGDPRLawfulBasisToProcessButton, BulkAddGDPRSubscriptionButton, BulkUpdateDoubleOptInButton, BulkSendSurveyMonkeySurveyButton, BulkSetMarketableButton, BulkSetNonMarketableButton];
      }

    case DEAL_TYPE_ID:
      {
        return [BulkMoveToClosedLostButton];
      }

    default:
      {
        return [];
      }
  }
});

var BulkActionsContainer = function BulkActionsContainer(_ref) {
  var isSelectingEntireQuery = _ref.isSelectingEntireQuery,
      selection = _ref.selection,
      total = _ref.total,
      clearSelection = _ref.clearSelection;
  var objectTypeId = useSelectedObjectTypeId(); // HACK: This is used down in BulkUpdateDoubleOptInButton. This button will not render until this fetch is complete.
  // This is fine because it lives in the "More" dropdown, so it is unlikely users will notice it pop in. We will eventually
  // want to refactor this to live in the button, but it is not possible while we're wrapping the legacy button.

  useFetchDoubleOptInSetting(); // TODO: When we've migrated everything over to IKEA (at a minimum cobjects and new stobjects)
  // we should make this configurable as a behavior. It is not a behavior today because the legacy
  // codebase couldn't handle it, so we should wait to avoid introducing differences between the
  // two versions while we're still rolling IKEA out

  var buttons = getBulkActionsByObjectTypeId(objectTypeId);
  var moreDropdownButtons = getMoreActionsDropdownButtonsByObjectTypeId(objectTypeId);
  var showMoreDropdown = moreDropdownButtons.length > 0;
  var count = isSelectingEntireQuery ? total : selection.size;

  var _useHydratedSearchQue = useHydratedSearchQuery(),
      status = _useHydratedSearchQue.status,
      query = _useHydratedSearchQue.query;

  var selectedArray = useMemo(function () {
    return selection.toArray();
  }, [selection]);
  var canEditSelection = useCanUserEditObjects({
    objectIds: selectedArray,
    isSelectingEntireQuery: isSelectingEntireQuery,
    count: count
  });
  var onConfirmBulkAction = useCallback(function () {
    return clearSelection();
  }, [clearSelection]);
  return (
    /*#__PURE__*/
    // This is required for the "Add to object list" bulk action
    _jsxs(BulkActionsModalProvider, {
      children: [/*#__PURE__*/_jsx(Small, {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "index.bulkActions.selectedCount",
          options: {
            count: count
          }
        })
      }), /*#__PURE__*/_jsxs(UIButtonWrapper, {
        className: "m-left-4",
        horizontalGap: 20,
        verticalGap: -1,
        children: [buttons.map(function (Button, index) {
          return /*#__PURE__*/_jsx(Button, {
            query: query,
            queryHydrationStatus: status,
            canEditSelection: canEditSelection,
            isSelectingEntireQuery: isSelectingEntireQuery,
            selection: selection,
            total: total,
            inDropdown: false,
            onConfirmBulkAction: onConfirmBulkAction
          }, index);
        }), showMoreDropdown && /*#__PURE__*/_jsx(UIDropdown, {
          "data-selenium-test": "GridBulkActions__bulk-options",
          buttonUse: "link",
          buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "topbarContents.more"
          }),
          closeOnMenuClick: false,
          children: /*#__PURE__*/_jsx(UIList, {
            children: moreDropdownButtons.map(function (Button, index) {
              return /*#__PURE__*/_jsx(Button, {
                query: query,
                queryHydrationStatus: status,
                canEditSelection: canEditSelection,
                isSelectingEntireQuery: isSelectingEntireQuery,
                selection: selection,
                total: total,
                inDropdown: true,
                onConfirmBulkAction: onConfirmBulkAction
              }, index);
            })
          })
        })]
      })]
    })
  );
};

BulkActionsContainer.propTypes = {
  isSelectingEntireQuery: PropTypes.bool.isRequired,
  selection: PropTypes.instanceOf(ImmutableSet).isRequired,
  total: PropTypes.number.isRequired,
  clearSelection: PropTypes.func.isRequired
};
export default BulkActionsContainer;