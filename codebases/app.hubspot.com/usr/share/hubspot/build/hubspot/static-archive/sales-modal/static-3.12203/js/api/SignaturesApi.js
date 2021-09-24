'use es6';

import apiClient from 'hub-http/clients/apiClient';
export function renderSignature(signatureHtml, emails) {
  var url = 'sales-email-signature/v1/signatures/render';
  return apiClient.post(url, {
    data: {
      emails: emails,
      signatureHtml: signatureHtml
    }
  }).then(function (response) {
    return response.renderedSignature;
  });
}