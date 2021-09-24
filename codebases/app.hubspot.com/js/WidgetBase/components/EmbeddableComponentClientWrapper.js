'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import { AssociationsContext } from '../../associations/context/AssociationsContext';
import EmbeddableComponentClient from './EmbeddableComponentClient';

function EmbeddableComponentClientWrapper(props) {
  var uasAssociations = useContext(AssociationsContext);
  return /*#__PURE__*/_jsx(EmbeddableComponentClient, Object.assign({}, props, {
    uasAssociations: uasAssociations
  }));
}

export default EmbeddableComponentClientWrapper;