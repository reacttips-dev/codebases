'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { DataFetchingClient, DataFetchingClientProvider } from 'data-fetching-client';
var client = new DataFetchingClient();
export var ProvideDataFetchingClient = function ProvideDataFetchingClient(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_jsx(DataFetchingClientProvider, {
    client: client,
    children: children
  });
};