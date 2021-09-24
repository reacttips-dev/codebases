'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import BulkAddToObjectListModalAsync from '../modals/BulkAddToObjectListModalAsync';
import emptyFunction from 'react-utils/emptyFunction';
import { createContext, useCallback, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
var initialContext = {
  addToObjectList: {
    isOpen: false,
    bulkActionProps: undefined,
    close: emptyFunction,
    open: emptyFunction
  }
};
var BulkActionsModalContext = /*#__PURE__*/createContext(initialContext);
export var actions = {
  ADD_TO_OBJECT_LIST_MODAL_CLOSED: 'ADD_TO_OBJECT_LIST_MODAL_CLOSED',
  ADD_TO_OBJECT_LIST_MODAL_OPENED: 'ADD_TO_OBJECT_LIST_MODAL_OPENED'
};
export var reducer = function reducer(state, action) {
  var type = action.type,
      payload = action.payload;

  switch (type) {
    case actions.ADD_TO_OBJECT_LIST_MODAL_CLOSED:
      return Object.assign({}, state, {
        addToObjectList: Object.assign({}, state.addToObjectList, {
          isOpen: false,
          bulkActionProps: undefined
        })
      });

    case actions.ADD_TO_OBJECT_LIST_MODAL_OPENED:
      return Object.assign({}, state, {
        addToObjectList: Object.assign({}, state.addToObjectList, {
          isOpen: true,
          bulkActionProps: payload.bulkActionProps
        })
      });

    default:
      {
        return state;
      }
  }
};
export var BulkActionsModalProvider = function BulkActionsModalProvider(_ref) {
  var children = _ref.children;

  var _useReducer = useReducer(reducer, initialContext),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var closeModalHandler = useCallback(function (closeAction) {
    return dispatch({
      type: closeAction
    });
  }, [dispatch]);
  var openModalHandler = useCallback(function (openAction) {
    var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return dispatch({
      type: openAction,
      payload: payload
    });
  }, [dispatch]);
  var value = useMemo(function () {
    return {
      addToObjectList: Object.assign({}, state.addToObjectList, {
        close: function close() {
          return closeModalHandler(actions.ADD_TO_OBJECT_LIST_MODAL_CLOSED);
        },
        open: function open(bulkActionProps) {
          return openModalHandler(actions.ADD_TO_OBJECT_LIST_MODAL_OPENED, {
            bulkActionProps: bulkActionProps
          });
        }
      })
    };
  }, [state, closeModalHandler, openModalHandler]);
  return /*#__PURE__*/_jsxs(BulkActionsModalContext.Provider, {
    value: value,
    children: [children, value.addToObjectList.isOpen && /*#__PURE__*/_jsx(BulkAddToObjectListModalAsync, {})]
  });
};
BulkActionsModalProvider.propTypes = {
  children: PropTypes.node.isRequired
};
BulkActionsModalProvider.defaultProps = {
  children: emptyFunction
};
export var BulkActionsModalConsumer = BulkActionsModalContext.Consumer;
export default BulkActionsModalContext;