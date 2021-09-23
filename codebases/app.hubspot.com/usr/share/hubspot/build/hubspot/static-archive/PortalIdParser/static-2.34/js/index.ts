"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  id: null,
  pathRegex: /^\/(?:[A-Za-z0-9-_]*)\/(\d+)(?:\/|$)/,
  queryParamRegex: /(?:\?|&)portalid=(\d+)/i,
  getPortalIdFromPath: function getPortalIdFromPath(regex) {
    if (document) {
      if (regex == null) {
        regex = this.pathRegex;
      }

      return this.parsePortalIdFromString(document.location.pathname, regex);
    }
  },
  getPortalIdFromQueryParam: function getPortalIdFromQueryParam() {
    if (document) {
      return this.parsePortalIdFromString(document.location.search, this.queryParamRegex);
    }
  },
  parsePortalIdFromString: function parsePortalIdFromString(string, regex) {
    var idRe = regex.exec(string);
    var portalId = idRe != null ? idRe[1] : undefined;
    return portalId ? +portalId : undefined;
  },
  get: function get(options) {
    if (options == null) {
      options = {};
    }

    if (this.id && !options.reparse) {
      return this.id;
    }

    var id = this.getPortalIdFromPath(options.regex) || this.getPortalIdFromQueryParam();

    if (!options.preserveGlobalId) {
      if (window.hubspot == null) {
        window.hubspot = {};
      }

      if (window.hubspot.portal == null) {
        window.hubspot.portal = {};
      }

      if (window.hubspot.portal.id == null) {
        window.hubspot.portal.id = id;
      }

      if (id) {
        this.id = id;
      }
    }

    return id;
  }
};
exports.default = _default;
module.exports = exports.default;