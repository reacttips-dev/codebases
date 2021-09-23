'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { memo } from 'react';
import PropTypes from 'prop-types';
import EmbeddedContextPropType from 'ui-addon-iframeable/embed/EmbeddedContextPropType';
import { NavMarker } from 'react-rhumb';
import EmbeddableComponentClientContainer from '../containers/EmbeddableComponentClientContainer';
import CallingWidgetCommunicatorContainer from '../containers/CallingWidgetCommunicatorContainer';
import { AssociationsContextProvider } from '../../associations/context/AssociationsContext';
import CallingClientWithContext from './CallingClientWithContext';
import CallingWidgetErrorBoundary from './CallingWidgetErrorBoundary';

function CallingWidgetWrapper(_ref) {
  var objectTypeId = _ref.objectTypeId,
      subjectId = _ref.subjectId,
      onReady = _ref.onReady,
      embeddedContext = _ref.embeddedContext;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "INDEX_LOAD"
    }), /*#__PURE__*/_jsx(CallingWidgetErrorBoundary, {
      embeddedContext: embeddedContext,
      children: /*#__PURE__*/_jsx(AssociationsContextProvider, {
        objectTypeId: objectTypeId,
        subjectId: subjectId,
        children: /*#__PURE__*/_jsx(EmbeddableComponentClientContainer, {
          onReady: onReady,
          embeddedContext: embeddedContext,
          children: /*#__PURE__*/_jsx(CallingClientWithContext, {
            children: /*#__PURE__*/_jsx(CallingWidgetCommunicatorContainer, {})
          })
        })
      })
    })]
  });
}

CallingWidgetWrapper.propTypes = {
  objectTypeId: PropTypes.string,
  subjectId: PropTypes.string,
  onReady: PropTypes.func.isRequired,
  embeddedContext: EmbeddedContextPropType
};
export default /*#__PURE__*/memo(CallingWidgetWrapper);