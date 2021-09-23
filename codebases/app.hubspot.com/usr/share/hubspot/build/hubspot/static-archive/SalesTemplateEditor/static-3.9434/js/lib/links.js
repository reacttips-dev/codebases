'use es6';

import { getFullUrl } from 'hubspot-url-utils';
import PortalIdParser from 'PortalIdParser';
var portalId = PortalIdParser.get();
export var templates = function templates() {
  return getFullUrl('app') + "/templates/" + portalId;
};
export var invalidTemplateArticle = function invalidTemplateArticle() {
  return 'https://knowledge.hubspot.com/articles/kcs_article/sequences/why-wont-my-sequence-load';
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}