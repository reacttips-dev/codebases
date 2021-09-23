'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useMemo } from 'react';
import { saveUserSetting } from 'crm_data/settings/UserSettingsActions';
import { duck as cozyCardsDuck } from './cozyCards/entry';
import { duck as inactiveCardsDuck } from './inactiveCards/entry';
import invariant from 'react-utils/invariant';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { useStoreDependency } from 'general-store';
import { useIsRewriteEnabled } from '../../../rewrite/init/context/IsRewriteEnabledContext';
import { useUserSettingsActions } from '../../../rewrite/userSettings/hooks/useUserSettingsActions';
import { useGetInactiveCardsValue } from './inactiveCards/get';
import { useGetCozyCardsValue } from './cozyCards/get';
var CardPreferencesStateContext = /*#__PURE__*/createContext();
var ducks = [cozyCardsDuck, inactiveCardsDuck];
var rootStoresList = ducks.reduce(function (accSet, currentDuck) {
  return accSet.union(currentDuck.storesList);
}, ImmutableSet()).toArray();

var rootDeref = function rootDeref(_ref) {
  var objectType = _ref.objectType;
  return ducks.reduce(function (acc, currentDuck) {
    return acc.set(currentDuck.prefix, currentDuck.deref({
      objectType: objectType
    }));
  }, ImmutableMap());
};

var rootDep = {
  stores: rootStoresList,
  deref: function deref(_ref2) {
    var objectType = _ref2.objectType;
    var rootResult = rootDeref({
      objectType: objectType
    });
    return rootResult;
  }
};
export var useCardPreferencesRootState = function useCardPreferencesRootState(objectType) {
  var isRewriteEnabled = useIsRewriteEnabled(); // HACK: In the rewrite case we cannot easily roll our requests up into a single hook call at runtime
  // like we can in general-store by making a mega-dep. Instead we will manually build the map for
  // each duck. Ideally all this state management code goes away when we can remove the general-store code
  // anyway, so breaking from the intended pattern here shouldn't be too damaging.

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var inactiveCardState = useGetInactiveCardsValue(objectType); // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks

    var cozyCardsState = useGetCozyCardsValue(); // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks

    return useMemo(function () {
      var _ImmutableMap;

      return ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, inactiveCardsDuck.prefix, inactiveCardState), _defineProperty(_ImmutableMap, cozyCardsDuck.prefix, cozyCardsState), _ImmutableMap));
    }, [cozyCardsState, inactiveCardState]);
  } // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
  // eslint-disable-next-line react-hooks/rules-of-hooks


  return useStoreDependency(rootDep, {
    objectType: objectType
  });
};

var rootReducer = function rootReducer(state, action) {
  return ducks.reduce(function (lastState, currentDuck) {
    if (lastState.has(currentDuck.prefix)) {
      var stateSlice = lastState.get(currentDuck.prefix);
      var sliceReducer = currentDuck.reducer;
      return lastState.set(currentDuck.prefix, sliceReducer(stateSlice, action));
    }

    return lastState;
  }, state);
};

var getInitialState = function getInitialState(_ref3) {
  var storeContents = _ref3.storeContents,
      objectType = _ref3.objectType;
  return ducks.reduce(function (accumulator, currentDuck) {
    var initialStateForDuck = currentDuck.get({
      storeContents: storeContents,
      objectType: objectType
    });
    return accumulator.set(currentDuck.prefix, initialStateForDuck);
  }, ImmutableMap());
};

export var getActions = function getActions(_ref4) {
  var dispatch = _ref4.dispatch;

  /**
   * Reduce actions to one object and bind with dispatch
   *
   * will end up looking like {
   *     [prefix]: {
   *          [actionName]: function,
   *          ...
   *     },
   *     ...
   * }
   **/
  return ducks.reduce(function (actionsAccumulator, currentDuck) {
    var actionCreators = currentDuck.actions;

    for (var actionName in actionCreators) {
      if (actionCreators[actionName]) {
        // not required, but eslint complains if no if statement
        var currentActionCreator = actionCreators[actionName];
        var currentAction = currentActionCreator(dispatch);
        actionsAccumulator = actionsAccumulator.setIn([currentDuck.prefix, actionName], currentAction);
      }
    }

    return actionsAccumulator;
  }, ImmutableMap());
};

var getSaveFunctions = function getSaveFunctions(_ref5) {
  var objectType = _ref5.objectType,
      state = _ref5.state,
      storeContents = _ref5.storeContents,
      setUserSettingAction = _ref5.setUserSettingAction;
  var saveFunctions = ducks.reduce(function (accumulator, currentDuck) {
    var save = currentDuck.save({
      objectType: objectType,
      state: state,
      storeContents: storeContents,
      setUserSettingAction: setUserSettingAction
    });
    return accumulator.set(currentDuck.prefix, function () {
      return save(state.get(currentDuck.prefix));
    });
  }, ImmutableMap());
  return saveFunctions;
};

export var useSaveFunctions = function useSaveFunctions(_ref6) {
  var objectType = _ref6.objectType,
      state = _ref6.state,
      storeContents = _ref6.storeContents;
  var isRewriteEnabled = useIsRewriteEnabled();
  var setUserSettingAction = saveUserSetting;

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _useUserSettingsActio = useUserSettingsActions(),
        setUserSetting = _useUserSettingsActio.setUserSetting;

    setUserSettingAction = setUserSetting;
  }

  return useMemo(function () {
    return getSaveFunctions({
      objectType: objectType,
      state: state,
      storeContents: storeContents,
      setUserSettingAction: setUserSettingAction
    });
  }, [objectType, setUserSettingAction, state, storeContents]);
};
export var getResetFunctions = function getResetFunctions(_ref7) {
  var objectType = _ref7.objectType,
      actions = _ref7.actions,
      storeContents = _ref7.storeContents;
  var resetFunctions = ducks.reduce(function (accumulator, currentDuck) {
    var resetAction = actions.getIn([currentDuck.prefix, 'reset']); //use pre-dispatch-bound actions rather than raw actions

    var resetToState = currentDuck.get({
      storeContents: storeContents,
      objectType: objectType
    });
    return accumulator.set(currentDuck.prefix, function () {
      resetAction(resetToState);
    });
  }, ImmutableMap());
  return resetFunctions;
};
export var CardPreferencesProvider = function CardPreferencesProvider(_ref8) {
  var children = _ref8.children,
      objectType = _ref8.objectType;
  var storeContents = useCardPreferencesRootState(objectType);
  var initialState = getInitialState({
    storeContents: storeContents,
    objectType: objectType
  });

  var _useReducer = useReducer(rootReducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var actions = useMemo(function () {
    return getActions({
      dispatch: dispatch
    });
  }, [dispatch]);
  var saveFunctions = useSaveFunctions({
    objectType: objectType,
    state: state,
    storeContents: storeContents
  });
  var resetFunctions = useMemo(function () {
    return getResetFunctions({
      objectType: objectType,
      actions: actions,
      storeContents: storeContents
    });
  }, [objectType, actions, storeContents]);
  var value = useMemo(function () {
    return {
      state: state,
      actions: actions,
      saveFunctions: saveFunctions,
      resetFunctions: resetFunctions
    };
  }, [state, actions, saveFunctions, resetFunctions]);
  return /*#__PURE__*/_jsx(CardPreferencesStateContext.Provider, {
    value: value,
    children: children
  });
};
export var useCardPreferences = function useCardPreferences() {
  var context = useContext(CardPreferencesStateContext);
  invariant(context !== undefined, 'useCardPreferences must be used within a CardPreferencesProvider');
  return context;
};