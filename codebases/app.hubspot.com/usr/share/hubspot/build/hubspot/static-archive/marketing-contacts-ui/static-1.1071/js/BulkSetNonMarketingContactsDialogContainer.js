'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import BulkSetNonMarketingContactsDialog from './BulkSetNonMarketingContactsDialog';
import { fetchReport, fetchSearch } from 'marketing-contacts-client/api/SearchAPI';
import { fetchNextChange } from 'marketing-contacts-client/api/nextChangeAPI';

function BulkSetNonMarketingContactsDialogContainer(props) {
  var onReject = props.onReject,
      selectionCount = props.selectionCount,
      isFilterApplied = props.isFilterApplied,
      allSelected = props.allSelected,
      query = props.query,
      onConfirm = props.onConfirm;

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      isNextChangeDateLoading = _useState2[0],
      setIsNextChangeDateLoading = _useState2[1];

  var _useState3 = useState(undefined),
      _useState4 = _slicedToArray(_useState3, 2),
      nextChangeDate = _useState4[0],
      setNextChangeDate = _useState4[1];

  var _useState5 = useState(true),
      _useState6 = _slicedToArray(_useState5, 2),
      isReportLoading = _useState6[0],
      setIsReportLoading = _useState6[1];

  var _useState7 = useState(undefined),
      _useState8 = _slicedToArray(_useState7, 2),
      marketingCount = _useState8[0],
      setMarketingCount = _useState8[1];

  var _useState9 = useState(undefined),
      _useState10 = _slicedToArray(_useState9, 2),
      nonMarketingCount = _useState10[0],
      setNonMarketingCount = _useState10[1];

  var _useState11 = useState(undefined),
      _useState12 = _slicedToArray(_useState11, 2),
      pendingCount = _useState12[0],
      setPendingCount = _useState12[1];

  var _useState13 = useState(false),
      _useState14 = _slicedToArray(_useState13, 2),
      applyToAll = _useState14[0],
      setApplyToAll = _useState14[1];

  var _useState15 = useState(true),
      _useState16 = _slicedToArray(_useState15, 2),
      isAllLoading = _useState16[0],
      setIsAllLoading = _useState16[1];

  var _useState17 = useState(undefined),
      _useState18 = _slicedToArray(_useState17, 2),
      allMarketingContacts = _useState18[0],
      setAllMarketingContacts = _useState18[1];

  useEffect(function () {
    if (!isAllLoading) {
      return;
    }

    setIsAllLoading(false);
    fetchSearch([{
      filters: [{
        property: 'hs_marketable_status',
        operator: 'IN',
        values: ['true']
      }]
    }]).then(function (response) {
      setAllMarketingContacts(response.total);
    }).catch(function (error) {
      return console.error(error);
    });
  }, [isAllLoading]);
  useEffect(function () {
    if (!isNextChangeDateLoading) {
      return;
    }

    setIsNextChangeDateLoading(false);
    fetchNextChange().then(function (_ref) {
      var effectiveAt = _ref.effectiveAt;
      setNextChangeDate(I18n.moment(effectiveAt).format('ll'));
    }).catch(function (error) {
      console.error(error);
      setNextChangeDate('error');
    });
  }, [isNextChangeDateLoading]);
  useEffect(function () {
    if (!isReportLoading) {
      return;
    }

    var filterGroups = [];
    var searchQuery;

    if (Array.isArray(query)) {
      filterGroups = [{
        filters: [{
          property: 'vid',
          operator: 'IN',
          values: query
        }]
      }];
    } else {
      filterGroups = query.filterGroups;
      searchQuery = query.query;
    }

    setIsReportLoading(false);
    fetchReport(['hs_marketable_status', 'hs_marketable_until_renewal'], filterGroups, searchQuery).then(function (response) {
      var marketableCount = response.aggregations.hs_marketable_status.reduce(function (acc, value) {
        acc[value.key] = value.count;
        return acc;
      }, {
        true: 0,
        false: 0
      });
      var untilRenewalCount = response.aggregations.hs_marketable_until_renewal.reduce(function (acc, value) {
        acc[value.key] = value.count;
        return acc;
      }, {
        true: 0,
        false: 0
      });
      setMarketingCount(marketableCount.true - untilRenewalCount.true);
      setNonMarketingCount(marketableCount.false);
      setPendingCount(untilRenewalCount.true);
    }).catch(function (error) {
      return console.error(error);
    });
  }, [isReportLoading, query]);
  var handleConfirm = useCallback(function () {
    onConfirm({
      marketingCount: marketingCount,
      applyToAll: applyToAll
    });
  }, [onConfirm, marketingCount, applyToAll]);
  var handleChecked = useCallback(function (_ref2) {
    var checked = _ref2.target.checked;
    setApplyToAll(checked);
  }, [setApplyToAll]);
  return /*#__PURE__*/_jsxs(UIModal, {
    onEsc: onReject,
    width: 600,
    use: "success",
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: onReject
      }), /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "marketing-contacts-ui.bulkSetNonMarketingPrompt.modalTitle"
        })
      })]
    }), allMarketingContacts === undefined || nonMarketingCount === undefined || pendingCount === undefined || nextChangeDate === undefined ? /*#__PURE__*/_jsx(UIDialogBody, {
      children: /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true,
        minHeight: 200
      })
    }) : /*#__PURE__*/_jsx(BulkSetNonMarketingContactsDialog, {
      handleConfirm: handleConfirm,
      handleChecked: handleChecked,
      marketingCount: marketingCount,
      nonMarketingCount: nonMarketingCount,
      onReject: onReject,
      selectionCount: selectionCount,
      pendingCount: pendingCount,
      nextChangeDate: nextChangeDate,
      allSelected: allSelected,
      applyToAll: applyToAll,
      isFilterApplied: isFilterApplied
    })]
  });
}

var propTypes = Object.assign({
  selectionCount: PropTypes.number.isRequired,
  isFilterApplied: PropTypes.bool.isRequired,
  allSelected: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
}, PromptablePropInterface);
BulkSetNonMarketingContactsDialogContainer.propTypes = propTypes;
export default BulkSetNonMarketingContactsDialogContainer;