'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

var _ADD_ANOTHER_ASSOCIAT;

import { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import DraftAssociationSelects from './DraftAssociationSelects';
import DraftAssociationPrimarySelect from './DraftAssociationPrimarySelect';
import AssociateObjectTabFooter from './AssociateObjectTabFooter';
import UIButton from 'UIComponents/button/UIButton';
import HR from 'UIComponents/elements/HR';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconButton from 'UIComponents/button/UIIconButton';
import { DISTANCE_MEASUREMENT_MEDIUM } from 'HubStyleTokens/sizes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import PropTypes from 'prop-types';
import StandardObjectReferenceResolversProvider from './StandardObjectReferenceResolversProvider';
import { bulkAddAssociationLabels } from '../dependencies/labels/AssociationLabelsAPI';
import { HUBSPOT_DEFINED_ASSOCIATION_CATEGORY, PRIMARY_ASSOCIATION_BY_OBJECT_TYPES, UNLABELED_ASSOCIATION_BY_OBJECT_TYPES } from '../dependencies/labels/AssociationLabelConstants';
import ScopesContainer from '../../../setup-object-embed/containers/ScopesContainer';
import { isScoped } from '../../../setup-object-embed/containers/ScopeOperators';
import { NONE_PROVIDED } from '../dependencies/primaryAssociationConstants';
var DraftAssociationWrapper = styled.div.withConfig({
  displayName: "AssociateObjectTabContent__DraftAssociationWrapper",
  componentId: "sc-1tag8bd-0"
})(["position:relative;"]);
var RemoveDraftAssociationButtonWrapper = styled.div.withConfig({
  displayName: "AssociateObjectTabContent__RemoveDraftAssociationButtonWrapper",
  componentId: "sc-1tag8bd-1"
})(["position:absolute;top:", ";right:0;"], function (_ref) {
  var draftIndex = _ref.draftIndex;
  return draftIndex > 0 ? DISTANCE_MEASUREMENT_MEDIUM : 0;
});
var ADD_ANOTHER_ASSOCIATION_BUTTON_KEY_MAP = (_ADD_ANOTHER_ASSOCIAT = {}, _defineProperty(_ADD_ANOTHER_ASSOCIAT, CONTACT, 'sidebar.associateObjectDialog.associateTab.AssociateObjectTabContent.associateAnotherObject.CONTACT'), _defineProperty(_ADD_ANOTHER_ASSOCIAT, COMPANY, 'sidebar.associateObjectDialog.associateTab.AssociateObjectTabContent.associateAnotherObject.COMPANY'), _defineProperty(_ADD_ANOTHER_ASSOCIAT, DEAL, 'sidebar.associateObjectDialog.associateTab.AssociateObjectTabContent.associateAnotherObject.DEAL'), _defineProperty(_ADD_ANOTHER_ASSOCIAT, TICKET, 'sidebar.associateObjectDialog.associateTab.AssociateObjectTabContent.associateAnotherObject.TICKET'), _ADD_ANOTHER_ASSOCIAT);
var EMPTY_DRAFT_ASSOCIATION = {
  objectId: null,
  labels: []
};
var INITIAL_DRAFT_STATE = [EMPTY_DRAFT_ASSOCIATION];

var AssociateObjectTabContent = function AssociateObjectTabContent(_ref2) {
  var objectType = _ref2.objectType,
      subjectId = _ref2.subjectId,
      associationObjectType = _ref2.associationObjectType,
      onConfirm = _ref2.onConfirm,
      onConfirmError = _ref2.onConfirmError,
      onReject = _ref2.onReject,
      primaryAssociatedObjectId = _ref2.primaryAssociatedObjectId,
      isUngatedForFlexibleAssociations = _ref2.isUngatedForFlexibleAssociations;

  var _useState = useState(INITIAL_DRAFT_STATE),
      _useState2 = _slicedToArray(_useState, 2),
      draftAssociations = _useState2[0],
      setDraftAssociations = _useState2[1];

  var _useState3 = useState(NONE_PROVIDED),
      _useState4 = _slicedToArray(_useState3, 2),
      draftChosenPrimaryIndex = _useState4[0],
      setDraftChosenPrimaryIndex = _useState4[1];

  var shouldShowPrimarySelect = associationObjectType === COMPANY && isUngatedForFlexibleAssociations;
  var hasFlexAssocScope = isScoped(ScopesContainer.get(), 'custom-association-labels');
  var handleAddAnotherDraftAssociation = useCallback(function () {
    setDraftAssociations([].concat(_toConsumableArray(draftAssociations), [EMPTY_DRAFT_ASSOCIATION]));
  }, [draftAssociations, setDraftAssociations]); // generating a new primary association if chosen during associate existing flow

  var generatePrimaryAssociation = useCallback(function () {
    if (draftChosenPrimaryIndex !== NONE_PROVIDED) {
      var primaryAssociationTypeId = PRIMARY_ASSOCIATION_BY_OBJECT_TYPES[objectType][associationObjectType];
      return {
        fromObjectId: subjectId,
        toObjectId: draftAssociations[draftChosenPrimaryIndex].objectId,
        associationCategory: HUBSPOT_DEFINED_ASSOCIATION_CATEGORY,
        associationTypeId: primaryAssociationTypeId
      };
    }

    return undefined;
  }, [associationObjectType, draftAssociations, draftChosenPrimaryIndex, objectType, subjectId]);
  var handleSaveAssociations = useCallback(function () {
    var fromObjectType = objectType;
    var toObjectType = associationObjectType; // the association used when no labels are specified

    var unlabeledAssociationTypeId = UNLABELED_ASSOCIATION_BY_OBJECT_TYPES[fromObjectType][toObjectType];
    /**
     * this reducer takes the data from the format of:
     * [
     *   {
     *     objectId: ['123'],
     *     labels: [
     *       {
     *         id: '4',
     *         category: 'HUBSPOT_DEFINED',
     *       },
     *       {
     *         id: '5',
     *         category: 'USER_DEFINED'
     *       },
     *     ]
     *   },
     *   ...
     * ]
     *
     * to the format of:
     *
     * [
     *   {
     *      fromObjectId: subjectId,
     *      toObjectId: '123',
     *      associationCategory: 'HUBSPOT_DEFINED',
     *      associationTypeId: 4,
     *   }
     *   {
     *      fromObjectId: subjectId,
     *      toObjectId: '123',
     *      associationCategory: 'USER_DEFINED',
     *      associationTypeId: 5,
     *   }
     *   ...
     * ]
     *
     * after this conversion...
     * - each label + objectId combination has its own entry in the
     *   resulting array
     * - any associations without labels will be given the "unlabeled"
     *   association ID
     */

    var associationLabelSaveData = draftAssociations.reduce(function (acc, _ref3) {
      var draftAssociationId = _ref3.objectId,
          labels = _ref3.labels;
      var fromObjectId = subjectId;
      var toObjectId = draftAssociationId;

      if (!labels.length) {
        // add association in the "unlabeled" association type if
        // no label is selected
        return [].concat(_toConsumableArray(acc), [{
          fromObjectId: fromObjectId,
          toObjectId: toObjectId,
          associationCategory: HUBSPOT_DEFINED_ASSOCIATION_CATEGORY,
          associationTypeId: unlabeledAssociationTypeId
        }]);
      }

      return acc.concat(labels.map(function (_ref4) {
        var id = _ref4.id,
            category = _ref4.category;
        return {
          fromObjectId: fromObjectId,
          toObjectId: toObjectId,
          associationCategory: category,
          associationTypeId: id
        };
      }));
    }, []);
    var newPrimaryAssociation = generatePrimaryAssociation();

    if (newPrimaryAssociation) {
      associationLabelSaveData.push(newPrimaryAssociation);
    }

    bulkAddAssociationLabels(associationLabelSaveData).then(function () {
      onConfirm({
        idsToAssociate: draftAssociations.map(function (_ref5) {
          var objectId = _ref5.objectId;
          return objectId;
        }),
        isUsingFlexibleAssociationsFlow: true,
        addedLabelData: JSON.stringify(draftAssociations)
      });
    }).catch(onConfirmError).done();
  }, [draftAssociations, objectType, associationObjectType, generatePrimaryAssociation, subjectId, onConfirm, onConfirmError]);
  var handleUpdateDraftAssociation = useCallback(function (draftKey, updatedDraftAssociation) {
    setDraftAssociations(draftAssociations.map(function (draftAssociation, index) {
      return index === draftKey ? updatedDraftAssociation : draftAssociation;
    }));
  }, [draftAssociations, setDraftAssociations]);
  var createRemoveDraftAssociationHandler = useCallback(function (draftKey) {
    return function () {
      setDraftAssociations(draftAssociations.filter(function (_, index) {
        return index !== draftKey;
      })); // Need to either shift the primary chosen index down by one if a
      // previous draft was removed or we've removed the chosen primary one

      if (draftKey <= draftChosenPrimaryIndex) {
        var newDraftChosenPrimaryIndex = draftKey < draftChosenPrimaryIndex ? draftChosenPrimaryIndex - 1 : NONE_PROVIDED;
        setDraftChosenPrimaryIndex(newDraftChosenPrimaryIndex);
      }
    };
  }, [draftAssociations, setDraftAssociations, draftChosenPrimaryIndex, setDraftChosenPrimaryIndex]);
  var renderDraftAssociationSelects = useCallback(function (draftAssociation, index) {
    return /*#__PURE__*/_jsxs(DraftAssociationWrapper, {
      children: [index > 0 && /*#__PURE__*/_jsx(HR, {})
      /* only render a divider for associations beyond the first */
      , /*#__PURE__*/_jsx(DraftAssociationSelects, {
        objectType: objectType,
        associationObjectType: associationObjectType,
        draftKey: index,
        selectedObjectId: draftAssociation.objectId,
        selectedLabels: draftAssociation.labels,
        onUpdateDraftAssociation: handleUpdateDraftAssociation,
        hasFlexAssocScope: hasFlexAssocScope
      }), shouldShowPrimarySelect && /*#__PURE__*/_jsx(DraftAssociationPrimarySelect, {
        associationObjectType: associationObjectType,
        draftChosenPrimaryIndex: draftChosenPrimaryIndex,
        draftKey: index,
        draftObjectId: draftAssociation.objectId,
        numberOfAssociations: draftAssociations.length,
        objectType: objectType,
        primaryAssociatedObjectId: primaryAssociatedObjectId,
        setDraftChosenPrimaryIndex: setDraftChosenPrimaryIndex,
        subjectId: subjectId,
        isUngatedForFlexibleAssociations: isUngatedForFlexibleAssociations
      }), /*#__PURE__*/_jsx(RemoveDraftAssociationButtonWrapper, {
        draftIndex: index,
        children: /*#__PURE__*/_jsx(UIIconButton, {
          use: "transparent",
          size: "extra-small",
          placement: "top left",
          onClick: createRemoveDraftAssociationHandler(index),
          disabled: draftAssociations.length <= 1,
          children: /*#__PURE__*/_jsx(UIIcon, {
            name: "remove"
          })
        })
      })]
    }, index);
  }, [objectType, associationObjectType, handleUpdateDraftAssociation, createRemoveDraftAssociationHandler, hasFlexAssocScope, primaryAssociatedObjectId, draftAssociations, draftChosenPrimaryIndex, setDraftChosenPrimaryIndex, subjectId, shouldShowPrimarySelect, isUngatedForFlexibleAssociations]);
  var isSaveDisabled = useMemo(function () {
    // company fields are marked as required, so disable save if any are blank
    return draftAssociations.some(function (_ref6) {
      var objectId = _ref6.objectId;
      return !objectId;
    });
  }, [draftAssociations]);
  return /*#__PURE__*/_jsxs(StandardObjectReferenceResolversProvider, {
    children: [draftAssociations.map(renderDraftAssociationSelects), /*#__PURE__*/_jsx(UIButton, {
      use: "transparent",
      className: "p-left-0 p-top-10",
      onClick: handleAddAnotherDraftAssociation,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        "data-selenium-test": "associate-another-button",
        message: ADD_ANOTHER_ASSOCIATION_BUTTON_KEY_MAP[associationObjectType]
      })
    }), /*#__PURE__*/_jsx(AssociateObjectTabFooter, {
      isSaveDisabled: isSaveDisabled,
      onConfirm: handleSaveAssociations,
      onReject: onReject
    })]
  });
};

AssociateObjectTabContent.propTypes = {
  objectType: ObjectTypesType.isRequired,
  associationObjectType: ObjectTypesType.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onConfirmError: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  primaryAssociatedObjectId: PropTypes.number,
  subjectId: PropTypes.string.isRequired,
  isUngatedForFlexibleAssociations: PropTypes.bool.isRequired
};
export default AssociateObjectTabContent;