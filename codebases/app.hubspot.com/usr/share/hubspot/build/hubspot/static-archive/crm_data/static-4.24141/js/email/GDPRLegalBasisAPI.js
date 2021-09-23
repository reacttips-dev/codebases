'use es6';

import { post } from 'crm_data/api/ImmutableAPI';

var getURI = function getURI(_ref) {
  var engagementId = _ref.engagementId,
      emailAddress = _ref.emailAddress,
      lawfulBasis = _ref.lawfulBasis,
      explanation = _ref.explanation;
  var baseURI = "email/v2/contacts/" + encodeURIComponent(emailAddress) + "/subscriptions/one-off-legal-basis";
  var queryParams = "?legalBasis=" + lawfulBasis + "&legalBasisExplanation=" + explanation + "&engagementId=" + engagementId;
  return "" + baseURI + queryParams;
};

export function provideLegalBasis(data) {
  return post(getURI(data));
}