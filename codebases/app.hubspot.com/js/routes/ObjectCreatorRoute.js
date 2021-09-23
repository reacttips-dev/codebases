'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import ObjectCreatorContainer from '../crm_ui/creator/ObjectCreatorContainer';
import { useQueryParams } from '../router/useQueryParams';
export default function ObjectCreatorRoute() {
  var query = useQueryParams();
  useEffect(function () {
    document.title = 'Object Creator';
  }, []);
  return /*#__PURE__*/_jsx(ObjectCreatorContainer, Object.assign({}, query));
}