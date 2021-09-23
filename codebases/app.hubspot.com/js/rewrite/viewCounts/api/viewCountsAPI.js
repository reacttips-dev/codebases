'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import http from 'hub-http/clients/apiClient';
var BASE_URL = '/sales/v2/settings/views/counts';
export var fetchViewCounts = function fetchViewCounts() {
  return http.get(BASE_URL).then(function (results) {
    var _viewCountPerObjectTy;

    return {
      portalId: results.portalId,
      perObjectTypeIdViewLimit: results.perCollectionViewLimit,
      viewCountPerObjectTypeId: (_viewCountPerObjectTy = {}, _defineProperty(_viewCountPerObjectTy, CONTACT_TYPE_ID, results.viewCountPerCollectionType.contacts), _defineProperty(_viewCountPerObjectTy, COMPANY_TYPE_ID, results.viewCountPerCollectionType.companies), _defineProperty(_viewCountPerObjectTy, DEAL_TYPE_ID, results.viewCountPerCollectionType.deals), _defineProperty(_viewCountPerObjectTy, TICKET_TYPE_ID, results.viewCountPerCollectionType.tickets), _viewCountPerObjectTy)
    };
  });
}; // HACK: The endpoint returns data for all object types when passed any object type id.
// See also: https://hubspot.slack.com/archives/C028JC2EF7U/p1630680408005400?thread_ts=1630039484.029600&cid=C028JC2EF7U

var BASE_URL_V3 = '/sales/v3/views/counts/by-object-type-id';
export var fetchViewCountsByTypeId = function fetchViewCountsByTypeId() {
  return http.get(BASE_URL_V3);
};