/* eslint no-console: 0 */
import httpNoAuth from 'hub-http/clients/noAuthApiClient';
import enviro from 'enviro';

/**
 * @param {String} formUrl
 * @param {Object} data
 * @return {Promise}
 */
export var submitForm = function submitForm(formUrl, data) {
  if (enviro.getShort() !== 'prod') {
    console.log('Submission to pql form', formUrl, data);
  }

  return httpNoAuth.post(formUrl, {
    data: data,
    withCredentials: false
  });
};