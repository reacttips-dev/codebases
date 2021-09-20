import { isServedFromPublicWorkspaceDomain } from '../../appsdk/utils/commonWorkspaceUtils';
import CurrentUserDetailsService from '../services/CurrentUserDetailsService';

const ACCESS_TOKEN_HEADER = 'x-access-token';

class PostmanGatewayService {

  /**
   *
   * @param {string} path
   * @param {Request} request [The Request object](https://developer.mozilla.org/en-US/docs/Web/API/Request)
   * @param {Object} options
   * @param {Object} options.returnRawResponse Returns [the Response object](https://developer.mozilla.org/en-US/docs/Web/API/Response) or else returns the response as JSON if set false
   */
  static async request (path, request, options = { returnRawResponse: false }) {
    let accessToken = null,
      gatewayUrl = null,
      fallbackGatewayUrl = null,
      basePath = null,
      fullPath = null;

    if (window.SDK_PLATFORM === 'desktop') {

      fallbackGatewayUrl = window.postman_gateway_http_public_url;

      let userData = CurrentUserDetailsService.getCurrentUserDetails();

      if (userData) {
        gatewayUrl = _.get(userData, 'http_gateway_url');
        accessToken = _.get(userData, 'access_token');
      }

      if (request && accessToken) {
        _.set(request, `headers.${ACCESS_TOKEN_HEADER}`, accessToken);
      }

      basePath = gatewayUrl || fallbackGatewayUrl;
      fullPath = `${basePath}${path}`;
    }

    if (window.SDK_PLATFORM === 'browser') {

      fallbackGatewayUrl = isServedFromPublicWorkspaceDomain() ? window.postman_gateway_http_public_url : window.postman_gateway_http_private_url;
      basePath = window.HTTP_GATEWAY_URL || fallbackGatewayUrl;
      fullPath = `${basePath}${path}`;

      if (request && !request.credentials) {
        request.credentials = 'include';
      }
    }

    let response = await fetch(fullPath, request);

    if (!options.returnRawResponse) {

      // we return the response as json only if status is 2xx, else we throw an error
      if (response.ok) {
        return response.json();
      }
      else {
        throw new Error('Cannot parse the response as json');
      }
    }

    return response;
  }
}

export default PostmanGatewayService;
