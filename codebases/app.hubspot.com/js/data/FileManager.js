'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { DrawerFileAccess } from 'FileManagerLib/enums/FileAccess';
import http from 'hub-http/clients/apiClient';
var BASE_PATH = 'filemanager/api/v2';
var BASE_PATH_V3 = 'filemanager/api/v3';

var FileManager = /*#__PURE__*/function () {
  function FileManager(client) {
    _classCallCheck(this, FileManager);

    this.client = client;
  }

  _createClass(FileManager, [{
    key: "uploadFile",
    value: function uploadFile(file, _ref, onProgress) {
      var folderPath = _ref.folderPath;
      var data = new FormData();
      data.append('file', file);
      data.append('options', JSON.stringify({
        access: DrawerFileAccess.VISIBLE_IN_APP_PUBLIC_TO_ALL_INDEXABLE
      }));

      if (folderPath) {
        data.append('folderPath', folderPath);
      }

      var options = {
        data: data,
        timeout: 60 * 1000,
        headers: {
          'content-type': false
        },
        processData: false
      };

      if (onProgress) {
        options.withXhr = function (xhr) {
          xhr.upload.addEventListener('progress', onProgress, false);
        };
      }

      return this.client.post(BASE_PATH_V3 + "/files/upload", options);
    }
  }, {
    key: "fetchFile",
    value: function fetchFile(id) {
      return this.client.get(BASE_PATH + "/files/" + id);
    }
  }, {
    key: "fetchRecentFile",
    value: function fetchRecentFile() {
      var query = {
        is_cta_image: 0,
        folder_id: 'None',
        type: 'IMG',
        order_by: '-updated',
        limit: 1
      };
      return this.client.get('filemanager/api/v2/files', {
        query: query
      });
    }
  }, {
    key: "fetchImageInfo",
    value: function fetchImageInfo(url) {
      var query = {
        url: url
      };
      return this.client.get(BASE_PATH_V3 + "/files/image-info", {
        query: query
      });
    }
  }, {
    key: "downloadFromUrl",
    value: function downloadFromUrl(url, opts) {
      var data = Object.assign({}, opts, {}, {
        url: url,
        domained_url: true,
        access: DrawerFileAccess.VISIBLE_IN_APP_PUBLIC_TO_ALL_INDEXABLE
      });
      var query = {
        url: url
      }; // just for diagnostics

      return this.client.post(BASE_PATH_V3 + "/files/synchronous-download-from-url", {
        data: data,
        query: query,
        timeout: 15000
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new FileManager(http);
    }
  }]);

  return FileManager;
}();

export { FileManager as default };