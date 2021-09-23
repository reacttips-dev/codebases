'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import ReferenceObjectTypesType from 'reference-resolvers/schema/ReferenceObjectTypesType';
import ReferenceInputEnumSearch from 'customer-data-reference-ui-components/enum/ReferenceInputEnumSearch';
var propTypes = {
  referenceObjectType: ReferenceObjectTypesType.isRequired,
  resolvers: PropTypes.object
};

var ConnectedAPIDropdown = function ConnectedAPIDropdown(props) {
  var resolvers = props.resolvers,
      referenceObjectType = props.referenceObjectType,
      rest = _objectWithoutProperties(props, ["resolvers", "referenceObjectType"]);

  return /*#__PURE__*/_jsx(ReferenceInputEnumSearch, Object.assign({}, rest, {
    resolver: resolvers[referenceObjectType]
  }));
};

ConnectedAPIDropdown.propTypes = propTypes;
var getResolvers = ConnectReferenceResolvers(function (resolvers) {
  return {
    resolvers: resolvers
  };
});
export default getResolvers(ConnectedAPIDropdown);