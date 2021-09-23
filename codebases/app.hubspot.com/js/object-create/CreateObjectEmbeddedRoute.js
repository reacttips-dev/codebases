'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import CreateObjectEmbeddedReceiver from './CreateObjectEmbeddedReceiver';
import { useQueryParams } from '../router/useQueryParams';
export default function ObjectCreatorRoute() {
  var query = useQueryParams();
  useEffect(function () {
    document.title = 'Controlled Object Creator';
  }, []);
  return /*#__PURE__*/_jsx(CreateObjectEmbeddedReceiver, Object.assign({}, query));
}