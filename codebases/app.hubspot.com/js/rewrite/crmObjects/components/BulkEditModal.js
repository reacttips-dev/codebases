'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { useCallback, useState, useMemo } from 'react';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import UIButton from 'UIComponents/button/UIButton';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIMatchTextArea from 'UIComponents/input/UIMatchTextArea';
import UIModal from 'UIComponents/dialog/UIModal';
import H2 from 'UIComponents/elements/headings/H2';
import BulkPropertySelect from './BulkPropertySelect';
import BulkPropertyEditor from './BulkPropertyEditor';
import UIForm from 'UIComponents/form/UIForm';
import { useCrmObjectsActions } from '../hooks/useCrmObjectsActions';
import { alertFailure, alertSuccess } from '../../utils/alerts';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useModalData } from '../../overlay/hooks/useModalData';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useCurrentPipeline } from '../../pipelines/hooks/useCurrentPipeline';
import { useViewObjectCount } from '../../table/hooks/useViewObjectCount';
import { useHydratedSearchQuery } from '../../searchQuery/hooks/useHydratedSearchQuery';

var doSuccessAlert = function doSuccessAlert(count) {
  return alertSuccess({
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.bulkEdit.success.message",
      options: {
        count: count
      }
    })
  });
};

var doFailureAlert = function doFailureAlert(count) {
  return alertFailure({
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.bulkEdit.failure.title",
      options: {
        count: count
      }
    })
  });
};

var BulkEditModal = function BulkEditModal() {
  var _useSelectedObjectTyp = useSelectedObjectTypeDef(),
      pipelinePropertyName = _useSelectedObjectTyp.pipelinePropertyName,
      pipelineStagePropertyName = _useSelectedObjectTyp.pipelineStagePropertyName;

  var currentPipeline = useCurrentPipeline();

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      selectedPropertyName = _useState2[0],
      setSelectedPropertyName = _useState2[1];

  var _useState3 = useState({}),
      _useState4 = _slicedToArray(_useState3, 2),
      propertyUpdates = _useState4[0],
      setPropertyUpdates = _useState4[1];

  var handlePropertyNameChange = useCallback(function (propertyName) {
    if ([pipelinePropertyName, pipelineStagePropertyName].includes(propertyName)) {
      var _setPropertyUpdates;

      setPropertyUpdates((_setPropertyUpdates = {}, _defineProperty(_setPropertyUpdates, pipelinePropertyName, get('pipelineId', currentPipeline) || ''), _defineProperty(_setPropertyUpdates, pipelineStagePropertyName, getIn(['stages', 0, 'stageId'], currentPipeline) || ''), _setPropertyUpdates));
    } else {
      setPropertyUpdates(_defineProperty({}, propertyName, ''));
    }

    setSelectedPropertyName(propertyName);
  }, [currentPipeline, pipelinePropertyName, pipelineStagePropertyName]);
  var handlePropertyValueChange = useCallback(function (name, value) {
    return setPropertyUpdates(function (currentValues) {
      return Object.assign({}, currentValues, _defineProperty({}, name, value));
    });
  }, []);

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  var _useModalData = useModalData(),
      selection = _useModalData.selection,
      isSelectingEntireQuery = _useModalData.isSelectingEntireQuery;

  var _useCrmObjectsActions = useCrmObjectsActions(),
      updateCrmObjects = _useCrmObjectsActions.updateCrmObjects;

  var viewObjectCount = useViewObjectCount();

  var _useHydratedSearchQue = useHydratedSearchQuery(),
      hydratedSearchQuery = _useHydratedSearchQue.query;

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isApplyToAllChecked = _useState6[0],
      setApplyToAllChecked = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      isLoading = _useState8[0],
      setIsLoading = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      isMatched = _useState10[0],
      setMatched = _useState10[1];

  var count = isSelectingEntireQuery ? viewObjectCount : selection.size;
  var handleApplyToAllChange = useCallback(function (_ref) {
    var checked = _ref.target.checked;
    setApplyToAllChecked(checked);
  }, [setApplyToAllChecked]);
  var handleMatchedChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setMatched(value);
  }, [setMatched]);
  var handleSubmit = useCallback(function (event) {
    var filterGroups = hydratedSearchQuery.filterGroups,
        query = hydratedSearchQuery.query;
    event.preventDefault();
    setIsLoading(true);
    return updateCrmObjects({
      objectIds: selection.toArray(),
      propertyValues: Object.entries(propertyUpdates).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            name = _ref4[0],
            value = _ref4[1];

        return {
          name: name,
          value: value
        };
      }),
      isSelectingEntireQuery: isSelectingEntireQuery,
      filterGroups: filterGroups,
      query: query,
      // TODO: When we can support more than one object in the stage change modal,
      // we should remove this flag.
      bypassStagePropertyRequirements: true
    }).then(function () {
      setIsLoading(false);
      doSuccessAlert(count);
      closeModal();
    }).catch(function () {
      setIsLoading(false);
      doFailureAlert(count);
    });
  }, [closeModal, count, hydratedSearchQuery, isSelectingEntireQuery, propertyUpdates, selection, updateCrmObjects]);
  var propertyUpdatesEntries = Object.entries(propertyUpdates);
  var isSaveDisabled = useMemo(function () {
    if (!selectedPropertyName) {
      return true;
    }

    if (isSelectingEntireQuery && (!isMatched || !isApplyToAllChecked)) {
      return true;
    }

    return propertyUpdatesEntries.some(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          name = _ref6[0],
          value = _ref6[1];

      return [pipelinePropertyName, pipelineStagePropertyName].includes(name) && !value;
    });
  }, [isApplyToAllChecked, isMatched, isSelectingEntireQuery, pipelinePropertyName, pipelineStagePropertyName, propertyUpdatesEntries, selectedPropertyName]);
  return /*#__PURE__*/_jsx(UIModal, {
    children: /*#__PURE__*/_jsxs(UIForm, {
      onSubmit: handleSubmit,
      children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: closeModal
        }), /*#__PURE__*/_jsx(H2, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.bulkActions.modals.edit.title",
            options: {
              count: count
            }
          })
        })]
      }), /*#__PURE__*/_jsxs(UIDialogBody, {
        children: [/*#__PURE__*/_jsx(BulkPropertySelect, {
          value: selectedPropertyName,
          onPropertyNameChange: handlePropertyNameChange
        }), selectedPropertyName && propertyUpdatesEntries.map(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              name = _ref8[0],
              value = _ref8[1];

          return /*#__PURE__*/_jsx(BulkPropertyEditor, {
            propertyName: name,
            value: value,
            onPropertyValueChange: handlePropertyValueChange
          }, name);
        }), selectedPropertyName && isSelectingEntireQuery && /*#__PURE__*/_jsxs(UIForm, {
          children: [/*#__PURE__*/_jsx(UIFormControl, {
            className: "m-y-4",
            label: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "index.bulkActions.modals.edit.label"
            }),
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "index.bulkActions.modals.edit.boldMove",
              options: {
                count: count
              }
            })
          }), /*#__PURE__*/_jsx(UIMatchTextArea, {
            match: String(count),
            onMatchedChange: handleMatchedChange
          }), /*#__PURE__*/_jsx(UICheckbox, {
            checked: isApplyToAllChecked,
            onChange: handleApplyToAllChange,
            className: "m-top-2",
            "data-test-id": "apply-to-all-checkbox",
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "index.bulkActions.modals.edit.confirmApplyToAll"
            })
          })]
        })]
      }), /*#__PURE__*/_jsxs(UIDialogFooter, {
        children: [/*#__PURE__*/_jsx(UILoadingButton, {
          "data-selenium-test": "base-dialog-confirm-btn",
          use: "primary",
          type: "submit",
          loading: isLoading,
          disabled: isSaveDisabled,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.bulkActions.modals.edit.confirm"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "secondary",
          onClick: closeModal,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.bulkActions.modals.edit.reject"
          })
        })]
      })]
    })
  });
};

export default BulkEditModal;