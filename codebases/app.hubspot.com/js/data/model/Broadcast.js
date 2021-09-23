'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { OrderedMap, Set as ImmutableSet, fromJS } from 'immutable';
import { BROADCAST_SERIALIZE_OMIT_PROPS, BROADCAST_VALIDATION_ERRORS, BROADCAST_MEDIA_TYPE, CLIENT_TAGS, QUOTED_STATUS_ATTRS, BROADCAST_STATUS_TYPE } from '../../lib/constants';
import BroadcastBase from './BroadcastBase';
import { copyBroadcastAttributes, getBroadcastRecord } from '../../lib/broadcastUtils';

var Broadcast = /*#__PURE__*/function (_BroadcastBase) {
  _inherits(Broadcast, _BroadcastBase);

  function Broadcast() {
    _classCallCheck(this, Broadcast);

    return _possibleConstructorReturn(this, _getPrototypeOf(Broadcast).apply(this, arguments));
  }

  _createClass(Broadcast, [{
    key: "validate",
    value: function validate() {
      var errors = ImmutableSet();
      var body = this.content.get('body');

      if (!body || !body.trim()) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.emptyContent);
      }

      return errors;
    }
  }, {
    key: "removeQuotedStatus",
    value: function removeQuotedStatus() {
      var self = this;
      QUOTED_STATUS_ATTRS.forEach(function (attr) {
        self = self.deleteIn(['content', attr]);
      });
      return self;
    }
  }, {
    key: "serialize",
    value: function serialize() {
      var data = this.toJS();
      BROADCAST_SERIALIZE_OMIT_PROPS.forEach(function (attr) {
        delete data[attr];
      });
      return Object.assign({}, data, {
        extraData: this.extraData.serialize(),
        content: Broadcast.serializeContent(data.content),
        broadcastMediaType: data.broadcastMediaType || BROADCAST_MEDIA_TYPE.NONE
      });
    }
  }, {
    key: "canEditStatus",
    value: function canEditStatus(userIsPublisher) {
      return userIsPublisher || this.getStatusType() === BROADCAST_STATUS_TYPE.draft;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (attrs instanceof Broadcast) {
        return attrs;
      }

      attrs = copyBroadcastAttributes(attrs);
      return new Broadcast(fromJS(attrs));
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      return new OrderedMap(data.map(Broadcast.createFrom).map(function (b) {
        return [b.broadcastGuid, b];
      }));
    }
  }, {
    key: "createForComposer",
    value: function createForComposer(channels, attrs) {
      return Broadcast.createFrom(Object.assign({
        channelKeys: channels.map(function (c) {
          return c.channelKey;
        }).toSet(),
        clientTag: CLIENT_TAGS.SocialUI_composer
      }, attrs));
    }
  }, {
    key: "createFromPost",
    value: function createFromPost(channels, attrs) {
      var files = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var channel = channels.find(function (c) {
        return c.channelId === attrs.channelId;
      });

      var _files = _slicedToArray(files, 1),
          file = _files[0];

      var content = {
        body: attrs.body,
        fileId: files.length !== 0 ? file.id : null,
        originalBody: attrs.body,
        cloneFailed: typeof attrs.get === 'function' ? attrs.get('cloneFailed') : null,
        photoUrl: attrs.mediaType === BROADCAST_MEDIA_TYPE.PHOTO ? this.getPhotoUrl(attrs, files) : null,
        originalLink: attrs.metadata.originalLink
      };
      var broadcastAttrs = {
        channelKey: channel.channelKey,
        channelGuid: channel.channelGuid,
        broadcastMediaType: attrs.mediaType,
        content: content,
        extraData: {
          files: files
        }
      };
      return Broadcast.createForComposer(channels, broadcastAttrs);
    }
  }, {
    key: "getPhotoUrl",
    value: function getPhotoUrl(attrs, files) {
      var _files2 = _slicedToArray(files, 1),
          file = _files2[0];

      return file ? file.url : attrs.metadata.mediaUrl || null;
    }
  }, {
    key: "serializeContent",
    value: function serializeContent(content) {
      if (content.uncompressedLinks) {
        content.uncompressedLinks = JSON.stringify(content.uncompressedLinks);
      }

      delete content.autoUpdatedBody;
      return content;
    }
  }]);

  return Broadcast;
}(BroadcastBase(getBroadcastRecord()));

export { Broadcast as default };