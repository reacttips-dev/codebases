'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import Raven from 'Raven';
import { Map as ImmutableMap } from 'immutable';
import * as SequencesApi from 'sales-modal/api/SequencesApi';
import * as TemplatesApi from 'sales-modal/api/TemplatesApi';
import * as SignaturesApi from 'sales-modal/api/SignaturesApi';
import { LINK_TYPES, LINK_TOKEN } from 'EmailSignatureEditor/plugins/unsubscribe/UnsubscribeConstants';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import getTemplateIds from 'sales-modal/utils/enrollModal/getTemplateIds';
export default (function (_ref) {
  var supplementalObjectType = _ref.supplementalObjectType,
      supplementalObjectId = _ref.supplementalObjectId,
      sequence = _ref.sequence,
      hasEnrolledSequence = _ref.hasEnrolledSequence,
      contacts = _ref.contacts,
      enrollType = _ref.enrollType;

  if (hasEnrolledSequence) {
    return Promise.resolve(ImmutableMap());
  }

  var templateIds = getTemplateIds(sequence);
  var getRenderedTemplatesInSequences = templateIds.length ? TemplatesApi.batchRenderTemplates({
    supplementalObjectType: supplementalObjectType,
    supplementalObjectId: supplementalObjectId,
    templateIds: templateIds,
    contacts: contacts
  }) : Promise.resolve(ImmutableMap());
  var getUnrenderedTemplates = enrollType === EnrollTypes.BULK_ENROLL && templateIds.length ? TemplatesApi.fetchTemplates(templateIds) : Promise.resolve({});
  var emails = contacts.reduce(function (acc, contact) {
    acc.push(contact.getIn(['properties', 'email', 'value']));
    return acc;
  }, []);
  var getRenderedUnsubscribeLink = SignaturesApi.renderSignature(LINK_TOKEN, emails);
  var getUnsubscribeLinkType = SequencesApi.fetchUnsubscribeLinkType().then(function (userAttributes) {
    return userAttributes.get('unsubscribeLinkType');
  }, function () {
    return LINK_TYPES.PREFER_LESS;
  });
  return Promise.all([getRenderedTemplatesInSequences, getRenderedUnsubscribeLink, getUnsubscribeLinkType, getUnrenderedTemplates]).then(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 4),
        renderedTemplates = _ref3[0],
        unsubscribeLink = _ref3[1],
        unsubscribeLinkType = _ref3[2],
        unrenderedTemplates = _ref3[3];

    return {
      renderedTemplates: renderedTemplates,
      unsubscribeLink: unsubscribeLink,
      unsubscribeLinkType: unsubscribeLinkType,
      unrenderedTemplates: unrenderedTemplates
    };
  }, function (err) {
    Raven.captureMessage('Sequence enroll template render error', {
      extra: {
        statusCode: err.status,
        statusText: err.statusText,
        responseText: err.responseText
      }
    });
    throw err;
  });
});