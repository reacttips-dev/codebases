import PostmanGatewayService from '../../../../js/utils/PostmanGatewayService';

const URL = '/ws/proxy',
  DEFAULT_METHOD = 'POST';

export const HTTPGatewayService = {
  request: async function (options) {
    let requestUrl = options.url || URL,
      method = options.method || DEFAULT_METHOD;

    let response = await PostmanGatewayService.request(requestUrl, {
      method: method,
      body: JSON.stringify(options.data),
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      returnRawResponse: true // setting it to true as some of our
      // components are dependent on body of 4xx response
      // e.g Team discovery: email verification
    });

    if (response.ok) {
      return { body: await response.json() };
    }

    return Promise.reject(await response.json());
  }
};
