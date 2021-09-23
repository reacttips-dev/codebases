'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { fromJS, Map as ImmutableMap } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
import * as MissingTokenTransformerTypes from 'sales-modal/constants/MissingTokenTransformerTypes';
export function fetchTemplates(templateIds) {
  return apiClient.get('sales-templates/v1/templates/batch', {
    query: {
      id: templateIds
    }
  }).then(function (templates) {
    return templates.reduce(function (acc, template) {
      return acc.set("" + template.id, fromJS(template));
    }, ImmutableMap());
  });
}
export function render(_ref) {
  var id = _ref.id,
      email = _ref.email,
      supplementalObjectType = _ref.supplementalObjectType,
      supplementalObjectId = _ref.supplementalObjectId,
      isUngatedForMissingTokenTransformer = _ref.isUngatedForMissingTokenTransformer;

  if (!isUngatedForMissingTokenTransformer) {
    var query = {};

    if (supplementalObjectId && supplementalObjectId !== 'null') {
      query = {
        supplementalObjectType: supplementalObjectType,
        supplementalObjectId: supplementalObjectId
      };
    }

    return apiClient.get("sales-templates/v1/templates/" + id + "/render/" + email, {
      query: query
    }).then(fromJS);
  }

  var supplementalObjects = {};

  if (supplementalObjectId && supplementalObjectId !== 'null') {
    supplementalObjects = _defineProperty({}, supplementalObjectType, supplementalObjectId);
  }

  return apiClient.post('sales-templates/v2/templates/render', {
    data: {
      templateId: id,
      contactEmail: email,
      missingTokenTransformer: MissingTokenTransformerTypes.WARNING_TEXT,
      supplementalObjects: supplementalObjects
    }
  }).then(fromJS);
}
export function batchRenderTemplates(_ref2) {
  var templateIds = _ref2.templateIds,
      contacts = _ref2.contacts,
      supplementalObjectId = _ref2.supplementalObjectId,
      supplementalObjectType = _ref2.supplementalObjectType;
  var emailToVid = contacts.mapKeys(function (vid) {
    return contacts.getIn([vid, 'properties', 'email', 'value']);
  }).map(function (contact) {
    return "" + (contact.get('vid') || contact.getIn(['properties', 'email', 'value']));
  });
  var emails = emailToVid.keySeq().toList();
  return apiClient.post('sales-templates/v1/templates/render/batch', {
    data: {
      ids: templateIds,
      toEmails: emails,
      showMissingProperties: true,
      supplementalObjectType: supplementalObjectType,
      supplementalObjectId: supplementalObjectId
    },
    timeout: 60000
  }).then(function (response) {
    response = fromJS(response);
    var renderedTemplates = response.get('failures').merge(response.get('successes'));
    return renderedTemplates.map(function (contact) {
      return contact.get('renderedEmailByTemplateId');
    }).mapKeys(function (email) {
      return emailToVid.get(email);
    });
  });
}