'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useCallback } from 'react';
import { useIsVisibleFilterPropertyName } from '../../properties/hooks/useIsVisibleFilterPropertyName';
import { useProperties } from '../../properties/hooks/useProperties';
import { usePropertyGroupsWithProperties } from '../../propertyGroups/hooks/usePropertyGroupsWithProperties';
import { BoardSortModal } from '../../../board/deals/components/BoardSortModal';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { alertSuccess } from '../../utils/alerts';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { useViewActions } from '../../views/hooks/useViewActions';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import update from 'transmute/update';
import getIn from 'transmute/getIn';

var doSuccessAlert = function doSuccessAlert(propertyLabel, orderText) {
  return alertSuccess({
    message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "pipelineBoardSortModal.alertSuccess.record",
      options: {
        propertyLabel: propertyLabel,
        orderText: orderText
      }
    })
  });
};

var BoardSortModalWrapper = function BoardSortModalWrapper() {
  var objectTypeId = useSelectedObjectTypeId();
  var isVisibleFilterPropertyName = useIsVisibleFilterPropertyName();
  var propertyGroups = usePropertyGroupsWithProperties();
  var filteredGroups = useMemo(function () {
    return propertyGroups.map(function (group) {
      return update('properties', function (groupProperties) {
        return groupProperties.filter(function (_ref) {
          var name = _ref.name;
          return isVisibleFilterPropertyName(name);
        });
      }, group);
    });
  }, [isVisibleFilterPropertyName, propertyGroups]);
  var properties = useProperties();
  var filteredProperties = useMemo(function () {
    return properties.filter(function (_ref2) {
      var name = _ref2.name;
      return isVisibleFilterPropertyName(name);
    });
  }, [isVisibleFilterPropertyName, properties]);

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  var _useViewActions = useViewActions(),
      onSortChanged = _useViewActions.onSortChanged;

  var handleConfirm = useCallback(function (_ref3) {
    var _ref3$target$value = _ref3.target.value,
        sortKey = _ref3$target$value.sortKey,
        direction = _ref3$target$value.direction,
        orderText = _ref3$target$value.orderText,
        propertyLabel = _ref3$target$value.propertyLabel;
    // HACK: Unsure what the difference between sortKey and sortColumnName is.
    // Might be related to customer-data-table in some way. In the rewrite, we
    // always pass both as the same value.
    onSortChanged({
      sortKey: sortKey,
      sortColumnName: sortKey,
      direction: direction
    });
    doSuccessAlert(propertyLabel, orderText);
    closeModal();
  }, [closeModal, onSortChanged]);
  var view = useCurrentView();
  var sortKey = getIn(['state', 'sortKey'], view);
  var order = getIn(['state', 'order'], view);
  return /*#__PURE__*/_jsx(BoardSortModal, {
    initialSortKey: sortKey,
    initialSortDirection: order,
    objectType: denormalizeTypeId(objectTypeId),
    visiblePropertiesByGroup: filteredGroups,
    properties: filteredProperties,
    onConfirm: handleConfirm,
    onReject: closeModal
  });
};

export default BoardSortModalWrapper;