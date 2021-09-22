import _ from 'lodash';
import Supports from 'js/lib/supports';

    const CloudfrontApi = function(api, config) {
      this.api = api;
      this.config = config;
      this.cloudfrontEnabled = (
          Supports.cors &&
          config.url.cloudfront_api.indexOf("http") === 0);
    };

    CloudfrontApi.prototype.get = function(path, options) {
      if (this.cloudfrontEnabled) {
        if (path.indexOf("http") !== 0) {
          path = this.config.url.cloudfront_api + path;
        }
      }

      // We set the __cf_version and __cf_origin flags even if we're not using cloudfront. This helps to bust local caches.
      options = options || {};
      options.data = options.data || {};

      // Reset the cache after deploy.
      options.data.__cf_version = this.config.version;

      // On www.coursera.org, the response to API /topic/listfront has header
      //   Access-Control-Allow-Origin: https://www.coursera.org.
      // This is cached in cloudfront distribution 'd1h...'. However,
      // umich.coursera.org also uses cloudfront distribution 'd1h...' and so
      // it would get the same header, and the request would fail. It would need
      //   Access-Control-Allow-Origin: https://umich.coursera.org
      // to succeed. So, we need to add Origin to the cache key.
      // Cloudfront doesn't support Vary on Origin:
      //   http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#ResponseCustomContentNegotiation
      //   "The only acceptable value for the Vary header is Accept-Encoding. CloudFront ignores other values."
      // So we include it as a parameter, as suggested here:
      //   https://forums.aws.amazon.com/message.jspa?messageID=422532#422532

      // Some browsers don't support location.origin, so we construct it manually
      // See http://stackoverflow.com/a/6167979
      if (!wndw.location.origin) {
        wndw.location.origin = wndw.location.protocol + "//" + wndw.location.host;
      }

      options.data.__cf_origin = wndw.location.origin;
      return this.api.get(path, options);
    };

    export default function(api, config) {
      return new CloudfrontApi(api, config);
    };

