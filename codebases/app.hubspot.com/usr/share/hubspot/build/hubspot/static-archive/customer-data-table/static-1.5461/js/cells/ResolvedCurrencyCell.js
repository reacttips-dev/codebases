'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { MULTI_CURRENCY_INFORMATION } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { isError, isLoading } from 'reference-resolvers/utils';
import CurrencyCell from '../cells/CurrencyCell';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import get from 'transmute/get';

var ResolvedCurrencyCell = function ResolvedCurrencyCell(props) {
  var defaultCurrency = props.defaultCurrency,
      name = props.name,
      rest = _objectWithoutProperties(props, ["defaultCurrency", "name"]);

  if (isLoading(defaultCurrency)) {
    return '--';
  }

  if (isError(defaultCurrency)) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataTable.error.resolver"
    });
  }

  return /*#__PURE__*/_jsx(CurrencyCell, Object.assign({}, rest, {
    defaultCurrency: get('label', defaultCurrency),
    name: name
  }));
};

ResolvedCurrencyCell.displayName = 'ResolvedCurrencyCell';

var mapResolversToProps = function mapResolversToProps(resolvers) {
  // TODO: handle case when resolver doesn't exist
  return {
    defaultCurrency: resolvers[MULTI_CURRENCY_INFORMATION].byId('default')
  };
};

export default ResolveReferences(mapResolversToProps)(ResolvedCurrencyCell);