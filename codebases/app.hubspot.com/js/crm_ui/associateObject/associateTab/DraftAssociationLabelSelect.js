'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useStoreDependency } from 'general-store';
import AssociationLabelsStore from '../dependencies/labels/AssociationLabelsStore';
import { ASSOCIATION_LABEL_SELECT_BLOCKLIST, LABEL_ID_TO_TRANSLATION_KEY, HUBSPOT_DEFINED_ASSOCIATION_CATEGORY } from '../dependencies/labels/AssociationLabelConstants';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import UISelect from 'UIComponents/input/UISelect';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import PortalIdParser from 'PortalIdParser';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds'; // exported for unit tests only

export var _getDisplayText = function _getDisplayText(_ref) {
  var label = _ref.label,
      id = _ref.id,
      category = _ref.category;

  if (category === HUBSPOT_DEFINED_ASSOCIATION_CATEGORY && LABEL_ID_TO_TRANSLATION_KEY[id]) {
    return I18n.text(LABEL_ID_TO_TRANSLATION_KEY[id]);
  }

  return label;
}; // used so we can keep track of the association category and ID at the same time
// when converting to a select option, which must be a string, number, or bool

var toAssociationCategoryId = function toAssociationCategoryId(_ref2) {
  var id = _ref2.id,
      category = _ref2.category;
  return category + ":" + id;
};

var toAssociationLabelObject = function toAssociationLabelObject(associationCategoryId) {
  var _associationCategoryI = associationCategoryId.split(':'),
      _associationCategoryI2 = _slicedToArray(_associationCategoryI, 2),
      category = _associationCategoryI2[0],
      id = _associationCategoryI2[1];

  return {
    category: category,
    id: id
  };
};

var associationLabelDefinitionsDependency = {
  stores: [AssociationLabelsStore],
  deref: function deref(_ref3) {
    var fromObjectType = _ref3.fromObjectType,
        toObjectType = _ref3.toObjectType;
    return AssociationLabelsStore.get({
      fromObjectType: fromObjectType,
      toObjectType: toObjectType
    });
  }
};

var DraftAssociationLabelSelect = function DraftAssociationLabelSelect(_ref4) {
  var objectType = _ref4.objectType,
      associationObjectType = _ref4.associationObjectType,
      _ref4$selectedLabels = _ref4.selectedLabels,
      selectedLabels = _ref4$selectedLabels === void 0 ? [] : _ref4$selectedLabels,
      onChange = _ref4.onChange;
  var associationLabelDefinitions = useStoreDependency(associationLabelDefinitionsDependency, {
    fromObjectType: objectType,
    toObjectType: associationObjectType
  });
  var handleChange = useCallback(function (_ref5) {
    var value = _ref5.target.value;
    onChange(value.map(toAssociationLabelObject));
  }, [onChange]);
  var selectOptions = useMemo(function () {
    if (!associationLabelDefinitions) {
      return [];
    }

    return associationLabelDefinitions.filter(function (_ref6) {
      var id = _ref6.id,
          category = _ref6.category;
      return !ASSOCIATION_LABEL_SELECT_BLOCKLIST.includes(id) || category !== HUBSPOT_DEFINED_ASSOCIATION_CATEGORY;
    }).map(function (associationLabel) {
      return {
        text: _getDisplayText(associationLabel),
        value: toAssociationCategoryId(associationLabel)
      };
    });
  }, [associationLabelDefinitions]);
  var selectedAssociationCategoryIds = useMemo(function () {
    return selectedLabels.map(toAssociationCategoryId);
  }, [selectedLabels]);
  return /*#__PURE__*/_jsx(UISelect, {
    multi: true,
    options: selectOptions,
    onChange: handleChange,
    value: selectedAssociationCategoryIds,
    className: "labels-select",
    dropdownFooter: /*#__PURE__*/_jsx(UILink, {
      external: true,
      href: "/association-settings/" + PortalIdParser.get() + "/?type=" + ObjectTypesToIds[objectType],
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sidebar.associateObjectDialog.associateTab.DraftAssociationLabelSelect.manageLabels"
      })
    })
  });
};

DraftAssociationLabelSelect.propTypes = {
  selectedLabels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
  })),
  onChange: PropTypes.func.isRequired,
  objectType: ObjectTypesType.isRequired,
  associationObjectType: ObjectTypesType.isRequired
};
export default DraftAssociationLabelSelect;