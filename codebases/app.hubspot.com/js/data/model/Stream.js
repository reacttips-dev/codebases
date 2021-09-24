'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Map as ImmutableMap, OrderedMap, Record, Set as ImmutableSet } from 'immutable';
import { omit } from 'underscore';
import I18n from 'I18n';
import { DELETEABLE_STREAM_TYPES, EDITABLE_STREAM_TYPES, STREAM_INVALID_REASONS, STREAM_MAX_QUERY_LENGTH, STREAM_MAX_TERMS, STREAM_TYPES } from '../../lib/constants';
var DEFAULTS = {
  streamGuid: null,
  portalId: null,
  name: null,
  streamType: null,
  streamPriority: null,
  createdAt: null,
  updatedAt: null,
  succeededAt: null,
  lastItemAt: null,
  createdBy: null,
  updatedBy: null,
  description: null,
  purpose: null,
  definition: null,
  notificationSetting: null,
  state: null,
  items: OrderedMap(),
  itemsHaveLoaded: false,
  hasMoreItems: false,
  ignoreRetweets: false
};

var Stream = /*#__PURE__*/function (_Record) {
  _inherits(Stream, _Record);

  function Stream() {
    _classCallCheck(this, Stream);

    return _possibleConstructorReturn(this, _getPrototypeOf(Stream).apply(this, arguments));
  }

  _createClass(Stream, [{
    key: "cannotPreviewReasons",
    value: function cannotPreviewReasons() {
      // STREAM_INVALID_REASONS means we cannot preview, some mean we cannot save, some mean both
      var CAN_PREVIEW_WITH_INVALID_REASONS = [STREAM_INVALID_REASONS.missingName, STREAM_INVALID_REASONS.missingUserToNotify];
      var errors = this.validate().subtract(CAN_PREVIEW_WITH_INVALID_REASONS);

      if (errors.size) {
        return errors;
      }

      if (this.streamType === STREAM_TYPES.TWITTER_CONTACT_LIST) {
        errors = errors.add(STREAM_INVALID_REASONS.cannotPreviewContactList);
      }

      return errors;
    }
  }, {
    key: "getTotalSearchTerms",
    value: function getTotalSearchTerms() {
      var contains = this.definition.get('queryAny') || '';
      var requiredKeywords = this.definition.get('query') || '';
      var excludedKeywords = this.definition.get('queryNone') || '';
      var containsWords = contains.split(',');
      var requiredKeywordsWords = requiredKeywords.split(',');
      var excludedKeywordsWords = excludedKeywords.split(',');
      return containsWords.filter(function (term) {
        return term !== '';
      }).length + requiredKeywordsWords.filter(function (term) {
        return term !== '';
      }).length + excludedKeywordsWords.filter(function (term) {
        return term !== '';
      }).length;
    }
  }, {
    key: "validate",
    value: function validate() {
      var errors = ImmutableSet();

      if (!this.name) {
        errors = errors.add(STREAM_INVALID_REASONS.missingName);
      }

      if (this.streamType === STREAM_TYPES.TWITTER_SEARCH && !this.definition.get('queryAny')) {
        errors = errors.add(STREAM_INVALID_REASONS.missingQuery);
      }

      if (this.streamType === STREAM_TYPES.TWITTER_LIST && !this.definition.get('twitterListId')) {
        errors = errors.add(STREAM_INVALID_REASONS.missingTwitterList);
      }

      if (this.streamType === STREAM_TYPES.TWITTER_CONTACT_LIST && !this.definition.get('contactListId')) {
        errors = errors.add(STREAM_INVALID_REASONS.missingContactList);
      }

      var queryAny = this.definition.get('queryAny') || '';

      if (queryAny.length > STREAM_MAX_QUERY_LENGTH) {
        errors = errors.add(STREAM_INVALID_REASONS.queryAnyTooLong);
      }

      var totalSearchTerms = this.getTotalSearchTerms();

      if (!this.definition.get('includeRetweets')) {
        // ignore retweets
        if (totalSearchTerms > STREAM_MAX_TERMS - 1) {
          errors = errors.add(STREAM_INVALID_REASONS.queryAnyTooComplexIgnoreRetweets);
        }
      } else {
        // retweets
        if (totalSearchTerms > STREAM_MAX_TERMS) {
          errors = errors.add(STREAM_INVALID_REASONS.queryAnyTooComplex);
        }
      }

      if (this.notificationSetting && this.notificationSetting.get('notificationType') && this.notificationSetting.get('userIds') && this.notificationSetting.get('userIds').length === 0) {
        errors = errors.add(STREAM_INVALID_REASONS.missingUserToNotify);
      }

      if (!this.definition.get('twitterUserId')) {
        errors = errors.add(STREAM_INVALID_REASONS.missingTwitterUser);
      }

      return errors;
    }
  }, {
    key: "canPreview",
    value: function canPreview() {
      return this.cannotPreviewReasons().isEmpty();
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return this.validate().isEmpty();
    }
  }, {
    key: "hasRunBefore",
    value: function hasRunBefore() {
      return Boolean(this.succeededAt);
    }
  }, {
    key: "isProcessing",
    value: function isProcessing() {
      var updateTimeWindow = I18n.moment().utc().subtract(30, 'seconds');
      var couldBeReprocessing = I18n.moment.utc(this.updatedAt) > updateTimeWindow && this.itemsHaveLoaded && this.items.isEmpty();
      return !this.hasRunBefore() || couldBeReprocessing;
    }
  }, {
    key: "isUserEditable",
    value: function isUserEditable() {
      return EDITABLE_STREAM_TYPES.includes(this.streamType);
    }
  }, {
    key: "isUserDeleteable",
    value: function isUserDeleteable() {
      return DELETEABLE_STREAM_TYPES.includes(this.streamType);
    }
  }, {
    key: "getSimpleTypeName",
    value: function getSimpleTypeName() {
      return I18n.text("sui.monitoring.streamTypes." + this.streamType);
    }
  }, {
    key: "serialize",
    value: function serialize() {
      return omit(this.toJS(), 'items', 'hasMoreItems', 'itemsHaveLoaded');
    }
  }, {
    key: "serializeForPreview",
    value: function serializeForPreview() {
      return omit(this.serialize(), 'streamGuid', 'succeededAt');
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      attrs.definition = ImmutableMap(attrs.definition || {});
      attrs.notificationSetting = ImmutableMap(attrs.notificationSetting || {});
      return new Stream(attrs);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      return OrderedMap(data.streams.map(Stream.createFrom).map(function (i) {
        return [i.streamGuid, i];
      }));
    }
  }]);

  return Stream;
}(Record(DEFAULTS));

export { Stream as default };