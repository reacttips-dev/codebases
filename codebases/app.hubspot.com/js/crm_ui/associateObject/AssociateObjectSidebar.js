'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useState, useEffect } from 'react';
import AssociateObjectSidebarContent from './AssociateObjectSidebarContent';
import { associate, disassociate } from 'crm_data/associations/AssociationsActions';
import partial from 'transmute/partial';
import { createObject } from '../creator/ObjectCreator';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { CONTACT, DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { List, Record } from 'immutable';
import PropTypes from 'prop-types';
import ProfileObjectTypesType from 'customer-data-objects-ui-components/propTypes/ProfileObjectTypesType';
import ImmutablePropTypes from 'react-immutable-proptypes';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { isLoading } from 'crm_data/flux/LoadingStatus';
import { sendOptionIds, getSuggestedAssociations } from './AssociationsMLAPI';
import { NONE_PROVIDED } from './dependencies/primaryAssociationConstants';
import useIsUngatedForFlexibleAssociations from './dependencies/useIsUngatedForFlexibleAssociations';
import withGateOverride from 'crm_data/gates/withGateOverride';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import { useStoreDependency } from 'general-store';
var isUngatedForSuggestedAssociationsDataCollectionDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('records-suggested-associations', IsUngatedStore.get('records-suggested-associations'));
  }
};
var isUngatedForSuggestedAssociationsDisplayDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('records-suggested-associations-fe', IsUngatedStore.get('records-suggested-associations-fe'));
  }
};

var AssociateObjectSidebar = function AssociateObjectSidebar(_ref) {
  var onObjectCreated = _ref.onObjectCreated,
      onConfirmError = _ref.onConfirmError,
      onAssociationsUpdated = _ref.onAssociationsUpdated,
      associationObjectType = _ref.associationObjectType,
      objectCreatorParams = _ref.objectCreatorParams,
      objectType = _ref.objectType,
      onReject = _ref.onReject,
      primaryAssociatedObjectId = _ref.primaryAssociatedObjectId,
      sourceApp = _ref.sourceApp,
      subjectId = _ref.subjectId,
      bodyText = _ref.bodyText,
      isEmbedded = _ref.isEmbedded;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      suggestedAssociations = _useState2[0],
      setSuggestedAssociations = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      response = _useState4[0],
      setResponse = _useState4[1];

  var objectHasPrimary = primaryAssociatedObjectId !== NONE_PROVIDED;
  var isUngatedForFlexibleAssociations = useIsUngatedForFlexibleAssociations(objectType, associationObjectType);
  var isUngatedForSuggestedAssociationsDataCollection = useStoreDependency(isUngatedForSuggestedAssociationsDataCollectionDependency);
  var isUngatedForSuggestedAssociationsDisplay = useStoreDependency(isUngatedForSuggestedAssociationsDisplayDependency);
  useEffect(function () {
    if (isUngatedForSuggestedAssociationsDataCollection && objectType === CONTACT && associationObjectType === DEAL) {
      getSuggestedAssociations({
        fromObjectType: objectType,
        fromObjectId: subjectId,
        toObjectType: associationObjectType
      }).then(function (apiResponse) {
        setResponse(apiResponse);
        setSuggestedAssociations(isUngatedForSuggestedAssociationsDisplay && apiResponse.get('crmObjectOptionsByPriority').slice(0, 3).map(function (item) {
          return {
            id: item.get('objectId'),
            text: item.get('name'),
            value: associationObjectType + " " + item.get('objectId'),
            objectType: associationObjectType
          };
        }).toArray());
      }).catch(function (error) {
        throw error;
      });
    }
  }, [objectType, subjectId, associationObjectType, isUngatedForSuggestedAssociationsDisplay, isUngatedForSuggestedAssociationsDataCollection]);
  var handleCreateNewObject = useCallback(function (options) {
    CrmLogger.logImmediate('associateSidebarInteraction', {
      action: 'Created a new object from the associate panel',
      subAction: objectHasPrimary ? 'Has Primary' : 'Does not have primary',
      type: associationObjectType
    });
    createObject(Object.assign({}, options, {
      objectType: associationObjectType,
      associationObjectId: subjectId,
      associationObjectType: objectType,
      sourceApp: sourceApp,
      isUngatedForFlexibleAssociations: isUngatedForFlexibleAssociations
    })).then(function (object) {
      return onObjectCreated(object, !!options.addNew);
    }).catch(onConfirmError);
  }, [onObjectCreated, onConfirmError, associationObjectType, subjectId, objectHasPrimary, objectType, sourceApp, isUngatedForFlexibleAssociations]);
  var handleUpdateObjectAssociations = useCallback(function (options) {
    var idsToAssociate = options.idsToAssociate,
        idsToDisassociate = options.idsToDisassociate,
        _options$isUsingFlexi = options.isUsingFlexibleAssociationsFlow,
        isUsingFlexibleAssociationsFlow = _options$isUsingFlexi === void 0 ? false : _options$isUsingFlexi,
        addedLabelData = options.addedLabelData;

    if (isUsingFlexibleAssociationsFlow) {
      CrmLogger.logImmediate('associateSidebarInteraction', {
        action: 'Associated objects from the associate panel with flexible associations flow',
        subAction: objectHasPrimary ? 'Has Primary' : 'Does not have primary',
        type: associationObjectType,
        addedLabelData: addedLabelData
      });
    } else {
      CrmLogger.logImmediate('associateSidebarInteraction', {
        action: 'Associated objects from the associate panel',
        subAction: objectHasPrimary ? 'Has Primary' : 'Does not have primary',
        type: associationObjectType
      });
    } // in this case ids can only be added and the component calling already handled
    // updating associations, this is just to keep backwards compatibility with the
    // onAssociationsUpdated callback


    if (isUsingFlexibleAssociationsFlow) {
      onAssociationsUpdated([], idsToAssociate);
    }

    var requests = [];

    if (idsToDisassociate.length) {
      requests = idsToDisassociate.map(function (id) {
        return disassociate(subjectId, id, objectType, associationObjectType);
      });
    }

    if (idsToAssociate.length) {
      requests.push(associate(subjectId, List(idsToAssociate), objectType, associationObjectType));

      if (isUngatedForSuggestedAssociationsDataCollection && objectType === CONTACT && associationObjectType === DEAL) {
        sendOptionIds({
          response: response,
          fromObjectType: objectType,
          toObjectType: associationObjectType,
          toObjectIds: idsToAssociate
        });
      }
    }

    Promise.all(requests).then(partial(onAssociationsUpdated, idsToDisassociate, idsToAssociate)).catch(onConfirmError);
  }, [response, onConfirmError, onAssociationsUpdated, associationObjectType, objectType, objectHasPrimary, subjectId, isUngatedForSuggestedAssociationsDataCollection]);

  var renderLoading = function renderLoading() {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      grow: true,
      minHeight: 200
    });
  };

  if (!objectType || !associationObjectType || !sourceApp || !subjectId || !objectCreatorParams || isLoading(primaryAssociatedObjectId) && isUngatedForFlexibleAssociations) {
    return renderLoading();
  }

  return /*#__PURE__*/_jsx(AssociateObjectSidebarContent, {
    associationObjectType: associationObjectType,
    objectCreatorParams: objectCreatorParams,
    objectType: objectType,
    onConfirmAssociate: handleUpdateObjectAssociations,
    onConfirmCreate: handleCreateNewObject,
    onConfirmError: onConfirmError,
    onReject: onReject,
    primaryAssociatedObjectId: primaryAssociatedObjectId,
    subjectId: subjectId,
    suggestedAssociations: suggestedAssociations,
    bodyText: bodyText,
    isEmbedded: isEmbedded
  });
};

AssociateObjectSidebar.propTypes = {
  onObjectCreated: PropTypes.func.isRequired,
  onConfirmError: PropTypes.func.isRequired,
  onAssociationsUpdated: PropTypes.func.isRequired,
  associationObjectType: ProfileObjectTypesType,
  objectCreatorParams: PropTypes.shape({
    sourceApp: PropTypes.string,
    objectType: ProfileObjectTypesType,
    association: PropTypes.string,
    properties: PropTypes.instanceOf(Record),
    additionalRequiredProperties: ImmutablePropTypes.listOf(PropTypes.string)
  }),
  objectType: ProfileObjectTypesType,
  onReject: PropTypes.func.isRequired,
  primaryAssociatedObjectId: PropTypes.number,
  sourceApp: PropTypes.string,
  subjectId: PropTypes.string,
  bodyText: PropTypes.string,
  isEmbedded: PropTypes.bool
};
export default AssociateObjectSidebar;