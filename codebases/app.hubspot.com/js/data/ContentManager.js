'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';
var CONTENT_ATTRS = ['id', 'state', 'name', 'htmlTitle', 'publishDate', 'absoluteUrl', 'campaign', 'language'];

var ContentManager = /*#__PURE__*/function () {
  function ContentManager(client) {
    _classCallCheck(this, ContentManager);

    this.client = client;
  }

  _createClass(ContentManager, [{
    key: "fetchAllBlogs",
    value: function fetchAllBlogs() {
      var query = {
        property: CONTENT_ATTRS.concat('rootUrl'),
        limit: 100
      };
      return this.client.get('blog-settings/v1/blogs', {
        query: query
      });
    }
  }, {
    key: "fetchPosts",
    value: function fetchPosts(search) {
      var states = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['scheduled', 'published'];
      var query = {
        state__in: states.join(','),
        archived: false,
        property: CONTENT_ATTRS,
        order: '-publish_date',
        limit: 100
      };

      if (search) {
        query.name__icontains = search;
      }

      return this.client.get('blogs/v3/blog-posts', {
        query: query
      });
    }
  }, {
    key: "fetchPages",
    value: function fetchPages(search) {
      var query = {
        state__in: ['PUBLISHED', 'PUBLISHED_AB', 'SCHEDULED', 'SCHEDULED_AB', 'PUBLISHED_OR_SCHEDULED'],
        archived: false,
        domain__nlike: ['sandbox%hs-sites.com&', 'classic-migration-sandbox%&'],
        property: CONTENT_ATTRS,
        limit: 100
      };

      if (search) {
        query.name__icontains = search;
      }

      return this.client.get('content/api/v4/pages', {
        query: query,
        timeout: 30 * 1000
      });
    }
  }, {
    key: "fetchContent",
    value: function fetchContent(id) {
      return this.client.get("content/api/v4/contents/" + id);
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new ContentManager(http);
    }
  }]);

  return ContentManager;
}();

export { ContentManager as default };