'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { generatePath } from 'react-router-dom';
import { makeAssociationId } from '../../rewrite/associations/utils/associationIdUtils';
import http from 'hub-http/clients/apiClient';
import keyBy from '../../utils/keyBy';
var ASSOCIATION_DEFINITION_BASE_URI = 'associations/v1/definitions';
export var fetchAssociationDefinitionsByObjectTypeId = function fetchAssociationDefinitionsByObjectTypeId(objectTypeId) {
  return http.get(generatePath(ASSOCIATION_DEFINITION_BASE_URI + "/:objectTypeId", {
    objectTypeId: objectTypeId
  })).then(function (response) {
    // HACK: Convert the REST response to match the GraphQL format. GraphQL
    // calls these fields by different names and IKEA expects all association
    // definitions to share the GraphQL schema format.
    var formattedResponse = response.map(function (_ref) {
      var category = _ref.category,
          id = _ref.id,
          inverseId = _ref.inverseId,
          rest = _objectWithoutProperties(_ref, ["category", "id", "inverseId"]);

      return Object.assign({}, rest, {
        associationCategory: category,
        associationTypeId: id,
        inverseAssociationTypeId: inverseId
      });
    });
    return keyBy(makeAssociationId, formattedResponse);
  });
};