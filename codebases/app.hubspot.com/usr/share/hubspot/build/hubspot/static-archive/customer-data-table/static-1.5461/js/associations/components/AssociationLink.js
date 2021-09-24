'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import PropTypes from 'prop-types';
import { isError, isLoading } from 'reference-resolvers/utils';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import UILink from 'UIComponents/link/UILink';
import { createLinkFromIdAndObjectType } from 'customer-data-table/tableFunctions';
import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import getIn from 'transmute/getIn';
import LoadingCell from '../../cells/LoadingCell';
import ResolverLoading from 'reference-resolvers/schema/ResolverLoading';
import EmptyState from '../../Components/EmptyState';
import ResolverError from 'reference-resolvers/schema/ResolverError';
import { AssociationDefinitionType } from '../propTypes/AssociationDefinitionType';
import AssociationAvatar from './AssociationAvatar';
export var AssociationLink = function AssociationLink(_ref) {
  var associationDefinition = _ref.associationDefinition,
      objectId = _ref.objectId,
      object = _ref.object;
  var objectTypeId = getIn(['toObjectTypeDefinition', 'objectTypeId'], associationDefinition);
  var objectType = ObjectTypeFromIds[objectTypeId] || objectTypeId;

  if (isLoading(object)) {
    return /*#__PURE__*/_jsx(LoadingCell, {});
  }

  if (isError(object)) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  var url = createLinkFromIdAndObjectType(objectId, objectType); // TODO: Right now we're using the label directly out of the resolved object
  // but in the future we'll want to move to the standard property formatter
  // to handle cases where the label is not a simple string or needs special
  // handling.

  return /*#__PURE__*/_jsxs("span", {
    className: "flex-row align-center truncate-text",
    children: [/*#__PURE__*/_jsx(AssociationAvatar, {
      object: object,
      objectTypeId: objectTypeId
    }), /*#__PURE__*/_jsx(UILink, {
      className: "text-left truncate-text",
      external: true,
      href: url,
      children: object.label
    })]
  });
};
export var mapResolversToProps = function mapResolversToProps(resolvers, _ref2) {
  var associationDefinition = _ref2.associationDefinition,
      objectId = _ref2.objectId;
  var toObjectTypeDefinition = associationDefinition.toObjectTypeDefinition;
  var objectTypeId = toObjectTypeDefinition.objectTypeId,
      primaryDisplayLabelPropertyName = toObjectTypeDefinition.primaryDisplayLabelPropertyName;

  var _resolvers$CUSTOM_OBJ = resolvers.CUSTOM_OBJECT(),
      resolverFactory = _resolvers$CUSTOM_OBJ.resolverFactory,
      resolversCache = _resolvers$CUSTOM_OBJ.resolversCache;

  var options = {}; // Contacts has a special label formatter built into the resolver that we
  // don't want to override.
  // See: https://git.hubteam.com/HubSpot/reference-resolvers/blob/master/static/js/formatters/formatContacts.js

  var hasSpecialFormatter = objectTypeId === CONTACT_TYPE_ID;

  if (!hasSpecialFormatter) {
    options.formatterOptions = {
      getters: {
        getLabel: getIn(['properties', primaryDisplayLabelPropertyName, 'value'])
      }
    };
  }

  var CustomObjectResolver = resolverFactory(objectTypeId, options);
  var resolver = CustomObjectResolver(resolversCache);
  return {
    object: resolver.byId(objectId)
  };
};
AssociationLink.propTypes = {
  associationDefinition: AssociationDefinitionType.isRequired,
  object: PropTypes.oneOfType([PropTypes.instanceOf(ReferenceRecord), PropTypes.instanceOf(ResolverLoading), PropTypes.instanceOf(ResolverError)]),
  objectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};
export default ResolveReferences(mapResolversToProps, AssociationLink);