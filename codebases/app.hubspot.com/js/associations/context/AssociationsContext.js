'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, memo, useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import { IsUngatedForViewCommunicatePermissionsContext } from 'universal-associations-select/components/IsUngatedForViewCommunicatePermissionsContext';
import { useFetchUniversalEngagementAssociations } from '../hooks/useFetchUniversalAssociationsSearch';
import { isUngatedFor } from '../../Auth/selectors/authSelectors';
import { ASSOCIATIONS_SUCCEEDED, associationsReducer } from './AssociationsContextReducer';
import { getEngagementIdFromState } from '../../engagement/selectors/getEngagement';
export var AssociationsContext = /*#__PURE__*/createContext();
export var AssociationsDispatchContext = /*#__PURE__*/createContext();

function AssociationsProvider(_ref) {
  var objectTypeId = _ref.objectTypeId,
      subjectId = _ref.subjectId,
      engagementId = _ref.engagementId,
      children = _ref.children,
      isUngatedForViewCommunicatePermissions = _ref.isUngatedForViewCommunicatePermissions;
  var associations = useFetchUniversalEngagementAssociations({
    engagementId: engagementId,
    objectTypeId: objectTypeId,
    subjectId: subjectId,
    isUngatedForViewCommunicatePermissions: isUngatedForViewCommunicatePermissions
  });

  var _useReducer = useReducer(associationsReducer, associations),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  useEffect(function () {
    if (state.get('loading') !== associations.get('loading') || state.get('error') !== associations.get('error')) {
      dispatch({
        type: ASSOCIATIONS_SUCCEEDED,
        payload: associations
      });
    }
  }, [associations, state]);
  return /*#__PURE__*/_jsx(AssociationsContext.Provider, {
    value: state,
    children: /*#__PURE__*/_jsx(IsUngatedForViewCommunicatePermissionsContext.Provider, {
      value: isUngatedForViewCommunicatePermissions,
      children: /*#__PURE__*/_jsx(AssociationsDispatchContext.Provider, {
        value: dispatch,
        children: children
      })
    })
  });
}

var mapStateToProps = function mapStateToProps(state) {
  var UAS_VIEW_COMMUNICATE_PERMISSIONS = 'UAS:ViewCommunicatePermissions';
  return {
    engagementId: getEngagementIdFromState(state),
    isUngatedForViewCommunicatePermissions: isUngatedFor(state, {
      gate: UAS_VIEW_COMMUNICATE_PERMISSIONS
    })
  };
};

var ConnectedAssociationsProvider = connect(mapStateToProps)(AssociationsProvider);
export var AssociationsContextProvider = /*#__PURE__*/memo(ConnectedAssociationsProvider);
export var AssociationsContextConsumer = AssociationsContext.Consumer;
export var AssociationsDispatchContextConsumer = AssociationsDispatchContext.Consumer;