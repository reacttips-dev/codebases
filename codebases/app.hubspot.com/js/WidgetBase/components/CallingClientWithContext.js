'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import { AssociationsContextConsumer, AssociationsDispatchContextConsumer } from '../../associations/context/AssociationsContext';
import CallingClientContainer from '../containers/CallingClientContainer';

function CallingClientWithContext(props) {
  return /*#__PURE__*/_jsx(AssociationsContextConsumer, {
    children: function children(uasAssociations) {
      return /*#__PURE__*/_jsx(AssociationsDispatchContextConsumer, {
        children: function children(associationsDispatch) {
          return /*#__PURE__*/_jsx(CallingClientContainer, Object.assign({
            uasAssociations: uasAssociations,
            updateUASAssociations: associationsDispatch
          }, props));
        }
      });
    }
  });
}

export default /*#__PURE__*/memo(CallingClientWithContext);