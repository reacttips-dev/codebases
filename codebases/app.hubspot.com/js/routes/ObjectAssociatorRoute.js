'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import AssociateObjectEmbeddedReciever from '../crm_ui/associateObject/AssociateObjectEmbeddedReciever';
import { useQueryParams } from '../router/useQueryParams';
export default function ObjectAssociatorRoute() {
  var query = useQueryParams();
  useEffect(function () {
    document.title = 'Object Associator';
  }, []);
  return /*#__PURE__*/_jsx(AssociateObjectEmbeddedReciever, Object.assign({}, query));
}