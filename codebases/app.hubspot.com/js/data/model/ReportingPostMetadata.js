'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, OrderedSet, Record } from 'immutable';
import ReportingPostLink from './ReportingPostLink';
import ReportingPostMedia from './ReportingPostMedia';
var DEFAULTS = {
  mediaTitle: null,
  mediaUrl: null,
  thumbnailUrl: null,
  networkObjectId: null,
  networkParentId: null,
  networkType: null,
  description: null,
  locale: null,
  privacyStatus: null,
  source: null,
  remoteContentId: null,
  remoteContentType: null,
  videoDurationSeconds: null,
  link: null,
  originalLink: null,
  links: List(),
  media: List(),
  tags: List(),
  replyStatusIds: OrderedSet(),
  targetCountries: OrderedSet(),
  targetLanguageLabels: OrderedSet(),
  targetLanguages: OrderedSet(),
  targetLocationLabels: OrderedSet()
};

var ReportingPostMetadata = /*#__PURE__*/function (_Record) {
  _inherits(ReportingPostMetadata, _Record);

  function ReportingPostMetadata() {
    _classCallCheck(this, ReportingPostMetadata);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReportingPostMetadata).apply(this, arguments));
  }

  _createClass(ReportingPostMetadata, [{
    key: "isTargeted",
    value: function isTargeted() {
      return !this.targetCountries.isEmpty() || !this.targetLanguages.isEmpty();
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (attrs.links) {
        attrs.links = ReportingPostLink.createFromArray(attrs.links);
      }

      if (attrs.media) {
        attrs.media = ReportingPostMedia.createFromArray(attrs.media);
      }

      if (attrs.tags) {
        attrs.tags = List(attrs.tags);
      }

      if (attrs.replyStatusIds) {
        attrs.replyStatusIds = OrderedSet(attrs.replyStatusIds);
      }

      if (attrs.targetCountries) {
        attrs.targetCountries = OrderedSet(attrs.targetCountries);
      }

      if (attrs.targetLanguageLabels) {
        attrs.targetLanguageLabels = OrderedSet(attrs.targetLanguageLabels);
      }

      if (attrs.targetLanguages) {
        attrs.targetLanguages = OrderedSet(attrs.targetLanguages);
      }

      if (attrs.targetLocationLabels) {
        attrs.targetLocationLabels = OrderedSet(attrs.targetLocationLabels);
      }

      return new ReportingPostMetadata(attrs);
    }
  }]);

  return ReportingPostMetadata;
}(Record(DEFAULTS));

export { ReportingPostMetadata as default };