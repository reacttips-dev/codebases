'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

var _OBJECT_SELECT_LABEL_;

import { Fragment, useCallback } from 'react';
import UIFormControl from 'UIComponents/form/UIFormControl';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import DraftAssociationObjectSelect from './DraftAssociationObjectSelect';
import DraftAssociationLabelSelect from './DraftAssociationLabelSelect';
var OBJECT_SELECT_LABEL_KEY_MAP = (_OBJECT_SELECT_LABEL_ = {}, _defineProperty(_OBJECT_SELECT_LABEL_, COMPANY, 'sidebar.associateObjectDialog.associateTab.DraftAssociationSelects.objectSelectLabel.COMPANY'), _defineProperty(_OBJECT_SELECT_LABEL_, CONTACT, 'sidebar.associateObjectDialog.associateTab.DraftAssociationSelects.objectSelectLabel.CONTACT'), _defineProperty(_OBJECT_SELECT_LABEL_, DEAL, 'sidebar.associateObjectDialog.associateTab.DraftAssociationSelects.objectSelectLabel.DEAL'), _defineProperty(_OBJECT_SELECT_LABEL_, TICKET, 'sidebar.associateObjectDialog.associateTab.DraftAssociationSelects.objectSelectLabel.TICKET'), _OBJECT_SELECT_LABEL_);

var DraftAssociationSelects = function DraftAssociationSelects(_ref) {
  var draftKey = _ref.draftKey,
      selectedObjectId = _ref.selectedObjectId,
      selectedLabels = _ref.selectedLabels,
      objectType = _ref.objectType,
      associationObjectType = _ref.associationObjectType,
      onUpdateDraftAssociation = _ref.onUpdateDraftAssociation,
      hasFlexAssocScope = _ref.hasFlexAssocScope;
  var handleObjectIdUpdate = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    onUpdateDraftAssociation(draftKey, {
      objectId: value,
      labels: selectedLabels
    });
  }, [draftKey, selectedLabels, onUpdateDraftAssociation]);
  var handleLabelsUpdate = useCallback(function (value) {
    onUpdateDraftAssociation(draftKey, {
      objectId: selectedObjectId,
      labels: value
    });
  }, [draftKey, selectedObjectId, onUpdateDraftAssociation]);
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: OBJECT_SELECT_LABEL_KEY_MAP[associationObjectType]
      }),
      required: true,
      children: /*#__PURE__*/_jsx(DraftAssociationObjectSelect, {
        objectType: associationObjectType,
        onChange: handleObjectIdUpdate,
        multi: false,
        value: selectedObjectId
      })
    }), hasFlexAssocScope && /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sidebar.associateObjectDialog.associateTab.DraftAssociationSelects.associationLabelsSelect.label"
      }),
      className: "p-top-4",
      tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sidebar.associateObjectDialog.associateTab.DraftAssociationSelects.associationLabelsSelect.tooltip"
      }),
      tooltipPlacement: 'top right',
      children: /*#__PURE__*/_jsx(DraftAssociationLabelSelect, {
        onChange: handleLabelsUpdate,
        selectedLabels: selectedLabels,
        objectType: objectType,
        associationObjectType: associationObjectType
      })
    })]
  });
};

DraftAssociationSelects.propTypes = {
  draftKey: PropTypes.number.isRequired,
  selectedObjectId: PropTypes.string,
  selectedLabels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
  })),
  onUpdateDraftAssociation: PropTypes.func.isRequired,
  objectType: ObjectTypesType.isRequired,
  associationObjectType: ObjectTypesType.isRequired,
  hasFlexAssocScope: PropTypes.bool.isRequired
};
export default DraftAssociationSelects;