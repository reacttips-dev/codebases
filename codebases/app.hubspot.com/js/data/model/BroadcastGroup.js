'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Map as ImmutableMap, OrderedMap, Record } from 'immutable';
import { clone, pick } from 'underscore';
import I18n from 'I18n';
import Broadcast from './Broadcast';
import BroadcastGroupMessage from './BroadcastGroupMessage';
import PagePreview from './PagePreview';
import { BROADCAST_STATUS, BROADCAST_PUBLISH_TYPE, BROADCAST_MEDIA_TYPE, ACCOUNT_TYPES, getNetworkFromChannelKey, CHANNEL_TYPES, CLIENT_TAGS, CONTENT_TYPE, BROADCAST_VALIDATION_ERRORS, NETWORKS_AVAILABLE_FOR_POST_TARGETING, MULTI_IMAGE_ACCOUNT_TYPES } from '../../lib/constants';
import { generateUID } from '../../lib/utils';
import { prepareForClone } from '../../lib/draft/utils';
import { parseUrl } from 'hub-http/helpers/url';
import { parse } from 'hub-http/helpers/params';
var DEFAULTS = {
  messages: List(),
  // these are actually Broadcast attrs but are the same across all messages and copied when new broadcasts are added
  createdBy: null,
  campaignGuid: null,
  clientTag: null,
  body: null,
  // for when launched from embed with prepopulated text but no channel
  link: null,
  // an alternative to launching with body
  photoUrl: null,
  // another alternative to launching with body
  remoteContentId: null,
  // for when launched from embed in youtube reports
  remoteContentType: null,
  // for when launched from embed in youtube reports
  streamItem: null,
  // when launched from Monitoring to quote a tweet, so we can create a socialItemAction
  blogPost: null,
  // when launched from blog autopublish customization
  triggerAt: null,
  // when launched from calendar, to prepopulate the scheduled time
  options: ImmutableMap(),
  // some contextual flags that we need lots of places throughout composing/validating, preventing need to pass in constantly
  missingChannel: false
};

var BroadcastGroup = /*#__PURE__*/function (_Record) {
  _inherits(BroadcastGroup, _Record);

  function BroadcastGroup() {
    _classCallCheck(this, BroadcastGroup);

    return _possibleConstructorReturn(this, _getPrototypeOf(BroadcastGroup).apply(this, arguments));
  }

  _createClass(BroadcastGroup, [{
    key: "validate",
    value: function validate() {
      var _this = this;

      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var errorMap = List();
      var hoursThreshold = 24;
      errorMap = OrderedMap(this.messages.map(function (b) {
        return [b.uid, b.validate(_this.options)];
      })); // validate rights for publishing / schedule and drafts

      if (opts.canPublishChannelKeys) {
        this.messages.forEach(function (b) {
          if (b.channelKeys.intersect(opts.canPublishChannelKeys).size < b.channelKeys.size) {
            errorMap = errorMap.update(b.uid, function (error) {
              return error.add(BROADCAST_VALIDATION_ERRORS.userCannotPublish);
            });
          }
        });
      }

      var messagesByTextContent = this.messages.filter(function (b) {
        return b.network === ACCOUNT_TYPES.twitter;
      }).groupBy(function (m) {
        return m.broadcast.content.get('body').trim();
      }).filter(function (m) {
        return m.size > 1;
      });
      var broacastTimesByUid = ImmutableMap();
      messagesByTextContent.forEach(function (messages) {
        broacastTimesByUid = ImmutableMap(messages.map(function (bgm) {
          return [bgm.uid, bgm.publishType === BROADCAST_PUBLISH_TYPE.schedule ? I18n.moment(bgm.broadcast.triggerAt) : I18n.moment()];
        }));
        broacastTimesByUid.forEach(function (currentTime, currentUid) {
          var otherTimes = broacastTimesByUid.delete(currentUid);
          otherTimes.forEach(function (otherTime, otherUid) {
            var hoursDifference = I18n.moment.duration(currentTime.diff(otherTime)).asHours();

            if (Math.abs(hoursDifference) < hoursThreshold) {
              errorMap = errorMap.update(currentUid, function (error) {
                return error.add(BROADCAST_VALIDATION_ERRORS.duplicateTwitterContent);
              });
              errorMap = errorMap.update(otherUid, function (error) {
                return error.add(BROADCAST_VALIDATION_ERRORS.duplicateTwitterContent);
              });
            }
          });
        });
      });
      return errorMap.filter(function (errs) {
        return errs.size;
      });
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return this.validate().every(function (errors) {
        return errors.isEmpty();
      });
    }
  }, {
    key: "hasContent",
    value: function hasContent() {
      return this.messages.some(function (m) {
        return m.hasContent();
      });
    }
  }, {
    key: "getNonEmptyMessages",
    value: function getNonEmptyMessages() {
      return this.messages.filter(function (m) {
        return m.hasContent();
      });
    }
  }, {
    key: "allHaveChannel",
    value: function allHaveChannel() {
      return this.messages.every(function (m) {
        return !m.channelKeys.isEmpty();
      });
    }
  }, {
    key: "hasChanges",
    value: function hasChanges() {
      return this.messages.some(function (m) {
        return m.hasChanges();
      });
    }
  }, {
    key: "isUploadedGroup",
    value: function isUploadedGroup() {
      return this.messages.size === 1 && this.messages.first().broadcast.isUploaded();
    }
  }, {
    key: "getPublishType",
    value: function getPublishType() {
      if (this.messages.size === 1 || this.messages.map(function (m) {
        return m.publishType;
      }).toSet().size === 1) {
        return this.messages.first().publishType;
      } // we have multiple messages of mixed publishTypes, so use 'schedule'


      return BROADCAST_PUBLISH_TYPE.schedule;
    }
  }, {
    key: "getBroadcastGuids",
    value: function getBroadcastGuids() {
      return this.messages.reduce(function (acc, message) {
        return message.broadcastGuids.size ? acc.concat(message.broadcastGuids) : acc.push(message.broadcast.broadcastGuid);
      }, List());
    }
  }, {
    key: "mergeBroadcastUpdate",
    value: function mergeBroadcastUpdate(attrs, index) {
      attrs = clone(attrs);
      var self = this.setIn(['messages', index], this.messages.get(index).mergeBroadcastUpdate(attrs));

      if (attrs.campaignGuid && this.messages.size === 1) {
        self = self.set('campaignGuid', attrs.campaignGuid);
      }

      return self;
    }
  }, {
    key: "updateMessageWithFile",
    value: function updateMessageWithFile(fmFile, index) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.setIn(['messages', index], this.messages.get(index).updateWithFile(fmFile, opts));
    }
  }, {
    key: "updateWithPagePreview",
    value: function updateWithPagePreview(page, index, twitterChannels) {
      var message = this.messages.get(index);

      if (!message) {
        return this;
      }

      if (this.messages.some(function (m) {
        return m.isBlogPostAutoPublish;
      })) {
        return this;
      }

      message = message.mergeIn(['broadcast'], this.getRemoteContentFromUrl(page.url));
      var self = this.setIn(['messages', index], message.updateWithPagePreview(page, twitterChannels));

      if (this.messages.size === 1 && self.messages.get(index).broadcast.campaignGuid) {
        return self.set('campaignGuid', self.messages.get(index).broadcast.campaignGuid);
      }

      return self;
    }
  }, {
    key: "getBroadcastMediaType",
    value: function getBroadcastMediaType() {
      if (this.messages.isEmpty() && (this.body || this.link || this.photoUrl)) {
        if (this.photoUrl) {
          return BROADCAST_MEDIA_TYPE.PHOTO;
        }

        return BROADCAST_MEDIA_TYPE.NONE;
      }

      var lastBroadcast = this.messages.last().broadcast;
      return lastBroadcast.broadcastMediaType;
    }
  }, {
    key: "getBroadcastExtraData",
    value: function getBroadcastExtraData(network) {
      var lastBroadcast = this.messages.last().broadcast;
      var shouldCopyExtraData = MULTI_IMAGE_ACCOUNT_TYPES.includes(network);

      if (shouldCopyExtraData) {
        return lastBroadcast.get('extraData');
      }

      return lastBroadcast.get('extraData').toSingleFile();
    }
  }, {
    key: "clearBroadcastAuthorHandle",
    value: function clearBroadcastAuthorHandle(network, page) {
      // remove the `by @username` we add to plain urls that have twitter author handles if copying to other network
      var lastMessage = this.messages.last();
      var lastMessageBody = lastMessage.broadcast.content.get('body').trim();

      if (page && lastMessage.network === ACCOUNT_TYPES.twitter && network !== ACCOUNT_TYPES.twitter) {
        var twitterAuthorMention = I18n.text('sui.composer.body.twitterBy') + " @" + page.twitterHandles.first();

        if (lastMessageBody.endsWith(twitterAuthorMention)) {
          return lastMessageBody.replace(twitterAuthorMention, '').trim();
        }
      }

      return lastMessageBody;
    }
  }, {
    key: "getBroadcastContent",
    value: function getBroadcastContent(network, page) {
      var contentAttrs = {};

      if (this.messages.isEmpty() && (this.body || this.link || this.photoUrl)) {
        // code path generally from the composer embed/extension which can pass in body text, links, photoUrl, see broadcast-editor/redux/actions.js
        contentAttrs.body = this.link || '';

        if (this.body) {
          contentAttrs.body = this.link ? this.body + " " + this.link : this.body;
        }

        if (this.photoUrl) {
          contentAttrs.photoUrl = this.photoUrl;
        }

        return contentAttrs;
      }

      var lastMessage = this.messages.last();
      var lastBroadcast = lastMessage.broadcast;
      contentAttrs = lastBroadcast.content.toJS();

      if (page && lastMessage.network === ACCOUNT_TYPES.twitter && network !== ACCOUNT_TYPES.twitter) {
        contentAttrs.body = this.clearBroadcastAuthorHandle(network, page);
      }

      if (lastBroadcast.content.get('originalLink') && !lastMessage.primaryUrlInBody()) {
        contentAttrs = Object.assign({}, contentAttrs, {
          link: null,
          originalLink: null,
          uncompressedLinks: null,
          title: null,
          description: null,
          imageUrl: null
        });
      } else if (page && lastMessage.primaryUrlInBody()) {
        var validatedImages = page.getValidImages(network);

        if (!validatedImages.isEmpty()) {
          // revert to to the first image on the PagePreview in the case the last one was removed
          contentAttrs = Object.assign({}, contentAttrs, {
            title: page.getTitle(network),
            description: page.getDescription(network),
            imageUrl: contentAttrs.imageUrl ? validatedImages.first().url : null,
            linkPreviewSuppressed: false
          });
        } else {
          contentAttrs = Object.assign({}, contentAttrs, {
            title: page.getTitle(network),
            description: page.getDescription(network),
            imageUrl: null
          });
        }
      }

      return contentAttrs;
    }
  }, {
    key: "getBroadcastTargetLocations",
    value: function getBroadcastTargetLocations(network) {
      return this.getBroadcastPostTargetingConfig(network).targetLocations;
    }
  }, {
    key: "getBroadcastTargetLanguages",
    value: function getBroadcastTargetLanguages(network) {
      return this.getBroadcastPostTargetingConfig(network).targetLanguages;
    }
  }, {
    key: "getBroadcastPostTargetingConfig",
    value: function getBroadcastPostTargetingConfig(network) {
      var lastMessage = this.messages.last();

      if (NETWORKS_AVAILABLE_FOR_POST_TARGETING.includes(network)) {
        return {
          targetLocations: lastMessage.broadcast.targetLocations,
          targetLanguages: lastMessage.broadcast.targetLanguages
        };
      }

      return {
        targetLocations: List(),
        targetLanguages: List()
      };
    }
  }, {
    key: "getBroadcastTriggerAt",
    value: function getBroadcastTriggerAt(network) {
      var lastMessage = this.messages.last(); // scheduled time should be copied over if new message is on different network, or last message used a custom time

      if (lastMessage.publishType === BROADCAST_PUBLISH_TYPE.schedule && (lastMessage.network !== network || !lastMessage.slot)) {
        return lastMessage.broadcast.triggerAt;
      }

      return 0; // default value for publish now
    }
  }, {
    key: "getBroadcast",
    value: function getBroadcast(channels, page) {
      var network = channels.first().accountSlug;
      var broadcast = Broadcast.createForComposer(channels).merge({
        createdBy: this.createdBy,
        campaignGuid: this.campaignGuid
      });

      if (!this.messages.isEmpty()) {
        var lastMessage = this.messages.last();
        var lastBroadcast = lastMessage.broadcast;
        broadcast = broadcast.merge({
          remoteContentId: lastBroadcast.get('remoteContentId'),
          remoteContentType: lastBroadcast.get('remoteContentType'),
          extraData: this.getBroadcastExtraData(network),
          broadcastMediaType: this.getBroadcastMediaType(),
          triggerAt: this.getBroadcastTriggerAt(network),
          content: this.getBroadcastContent(network, page),
          targetLocations: this.getBroadcastTargetLocations(network),
          targetLanguages: this.getBroadcastTargetLanguages(network)
        }); // for Twitter only

        broadcast = this.parseMentions(broadcast, lastMessage.get('network'), network);
      } else if (this.body || this.link || this.photoUrl) {
        // code path generally from the composer embed/extension which can pass in body text, links, photoUrl, see broadcast-editor/redux/actions.js
        broadcast = broadcast.merge({
          content: this.getBroadcastContent(network, page),
          broadcastMediaType: this.getBroadcastMediaType()
        });
      } else if (this.triggerAt) {
        broadcast = broadcast.set('triggerAt', this.triggerAt);
      } // When composing a message from 0 will ignore any of previous cases and will go straigh here.


      return broadcast.merge({
        remoteContentId: this.remoteContentId,
        remoteContentType: this.remoteContentType,
        clientTag: this.clientTag || broadcast.clientTag
      });
    }
  }, {
    key: "getMinTriggerAt",
    value: function getMinTriggerAt(network, hubSettings) {
      if (this.messages.isEmpty()) {
        return 0;
      }

      var lastMessage = this.messages.last();
      var lastBroadcast = lastMessage.broadcast;

      if (lastMessage.network !== network || !lastMessage.slot) {
        return lastBroadcast.triggerAt;
      } else if (hubSettings && hubSettings.getDelayOffset() > 0) {
        var delayMs = hubSettings.getDelayOffset();
        return I18n.moment(lastBroadcast.triggerAt + delayMs).portalTz().startOf('day').valueOf();
      }

      return lastBroadcast.triggerAt;
    }
  }, {
    key: "getSlot",
    value: function getSlot() {
      if (!this.messages.isEmpty()) {
        return this.messages.last().slot;
      }

      return null;
    }
  }, {
    key: "getTwitterStatus",
    value: function getTwitterStatus(network) {
      if (network === ACCOUNT_TYPES.twitter && this.messages.last() && this.messages.last().twitterStatus) {
        return this.messages.last().twitterStatus;
      }

      return null;
    }
  }, {
    key: "getPublishTypeForNewMessage",
    value: function getPublishTypeForNewMessage(network) {
      var lastMessage = this.messages.last();

      if (lastMessage && lastMessage.publishType === BROADCAST_PUBLISH_TYPE.now && lastMessage.network !== network) {
        return BROADCAST_PUBLISH_TYPE.now;
      } else if (this.triggerAt) {
        return BROADCAST_PUBLISH_TYPE.schedule;
      }

      return BROADCAST_PUBLISH_TYPE.schedule;
    }
  }, {
    key: "addMessageForChannels",
    value: function addMessageForChannels(channels, publishType, page, hubSettings) {
      var network = channels.first().accountSlug;
      var message = new BroadcastGroupMessage({
        network: network,
        broadcast: this.getBroadcast(channels, page),
        minTriggerAt: this.getMinTriggerAt(network, hubSettings),
        slot: this.getSlot(),
        imageIndex: 0,
        // was this supposed to be for the image preview arrow selector?
        twitterStatus: this.getTwitterStatus(network),
        uid: generateUID(),
        file: this.messages.last() && this.messages.last().file,
        cosContent: this.messages.last() && this.messages.last().cosContent,
        publishType: this.getPublishTypeForNewMessage(network),
        channelKeys: channels.map(function (c) {
          return c.channelKey;
        }).toSet()
      });
      return this.set('messages', this.messages.push(message));
    }
  }, {
    key: "parseMentions",
    value: function parseMentions(broadcast, fromNetwork, toNetwork) {
      if (toNetwork !== ACCOUNT_TYPES.twitter && broadcast.content.get('quotedStatusUrl')) {
        return broadcast.removeQuotedStatus();
      }

      broadcast = broadcast.setIn(['content', 'body'], prepareForClone(broadcast.content.get('body'), fromNetwork, toNetwork));

      if (broadcast.content.get('originalBody')) {
        broadcast = broadcast.setIn(['content', 'originalBody'], prepareForClone(broadcast.content.get('originalBody'), fromNetwork, toNetwork));
      }

      if (broadcast.get('extraData') && broadcast.get('extraData').body) {
        broadcast = broadcast.setIn(['extraData', 'body'], prepareForClone(broadcast.get('extraData').body, fromNetwork, toNetwork));
      }

      return broadcast;
    }
  }, {
    key: "getRemoteContentFromUrl",
    value: function getRemoteContentFromUrl(url) {
      var parsedUrl = parseUrl(url);

      if (parsedUrl.hostname === 'www.youtube.com') {
        return {
          remoteContentId: parse(url.split('?')[1]).v,
          remoteContentType: ACCOUNT_TYPES.youtube
        };
      }

      return {};
    }
  }, {
    key: "serialize",
    value: function serialize(channels) {
      var broadcasts = [];
      this.getNonEmptyMessages().forEach(function (m) {
        broadcasts = broadcasts.concat(m.serialize(channels));
      });
      return broadcasts;
    }
  }, {
    key: "blogPostPagePreview",
    value: function blogPostPagePreview() {
      if (this.blogPost) {
        return PagePreview.createFrom({
          url: this.blogPost.get('url'),
          title: this.blogPost.get('title'),
          description: this.blogPost.get('description'),
          images: this.blogPost.get('featuredImage') ? [this.blogPost.get('featuredImage')] : OrderedMap(),
          success: true,
          isBlogPostCustomization: true
        });
      }

      return null;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (attrs.blogPost) {
        attrs.blogPost = ImmutableMap(attrs.blogPost);
      }

      if (attrs.options) {
        attrs.options = ImmutableMap(attrs.options);
      }

      var data = new BroadcastGroup(attrs);

      if (attrs.content && attrs.network && !attrs.messages) {
        var broadcastAttrs = pick(attrs, 'content', 'extraData', 'triggerAt', 'serviceId', 'clientTag');
        var broadcast = Broadcast.createFrom(Object.assign({}, broadcastAttrs));
        attrs.messages = [{
          broadcast: broadcast,
          network: attrs.network,
          channelKeys: attrs.channelKeys
        }];
      }

      if (attrs.messages) {
        data = data.set('messages', List(attrs.messages.map(function (message) {
          return message instanceof BroadcastGroupMessage ? message : BroadcastGroupMessage.createFrom(message);
        })));
      }

      return data;
    }
  }, {
    key: "createFromBroadcast",
    value: function createFromBroadcast(broadcast, network) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ImmutableMap();
      network = network || broadcast.channel.accountSlug;

      if (broadcast.channel && broadcast.channel.channelSlug === CHANNEL_TYPES.instagram) {
        network = ACCOUNT_TYPES.instagram;
      }

      var message = BroadcastGroupMessage.createFromBroadcast({
        network: network,
        broadcast: broadcast
      });
      return new BroadcastGroup({
        messages: List.of(message),
        campaignGuid: broadcast.campaignGuid,
        createdBy: broadcast.createdBy,
        originalContent: broadcast.content,
        options: options
      });
    }
  }, {
    key: "createFromBroadcasts",
    value: function createFromBroadcasts(broadcasts) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var messages = broadcasts.map(function (broadcast) {
        return BroadcastGroupMessage.createFromBroadcast({
          network: broadcast.channel && broadcast.channel.accountSlug || options.networks && options.networks.get(broadcast.broadcastGuid),
          broadcast: broadcast
        }, options);
      });
      return new BroadcastGroup({
        messages: messages,
        options: options.broadcastGroupOptions
      });
    }
  }, {
    key: "cloneFromBroadcasts",
    value: function cloneFromBroadcasts(broadcasts, attrs) {
      var _this2 = this;

      var createdBy = attrs.createdBy,
          options = attrs.options,
          _attrs$triggerAt = attrs.triggerAt,
          triggerAt = _attrs$triggerAt === void 0 ? null : _attrs$triggerAt,
          _attrs$clientTag = attrs.clientTag,
          clientTag = _attrs$clientTag === void 0 ? CLIENT_TAGS.SocialUI_clone : _attrs$clientTag;
      var self = null;
      broadcasts.forEach(function (_broadcast) {
        var network = getNetworkFromChannelKey(_broadcast.channelKey);

        if (_broadcast.channel && _broadcast.channel.channelSlug === CHANNEL_TYPES.instagram) {
          network = ACCOUNT_TYPES.instagram;
        }

        var data = pick(_broadcast.serialize ? _broadcast.serialize() : _broadcast.toJS(), 'content', 'extraData', 'channelKey', 'serviceId', 'campaignGuid', 'broadcastMediaType', 'targetLocations', 'targetLanguages');
        data.content.body = data.content.originalBody;
        delete data.content.originalBody;
        delete data.content.link;

        if (data.broadcastMediaType === BROADCAST_MEDIA_TYPE.NONE) {
          delete data.content.fileId;
        }

        var broadcast = Broadcast.createFrom(Object.assign({}, data, {
          createdBy: createdBy,
          triggerAt: triggerAt,
          clientTag: clientTag
        }));

        if (!self) {
          self = _this2.createFromBroadcast(broadcast, network || _broadcast.channel.accountSlug, options);
        } else {
          // when cloning multiple broadcasts, do not set triggerAt and do not pick next available slot
          var message = BroadcastGroupMessage.createFromBroadcast({
            network: network,
            broadcast: broadcast
          }).merge({
            autoPickSlot: false
          });
          self = self.set('messages', self.messages.push(message));
        }
      });
      return self.set('clientTag', clientTag);
    }
  }, {
    key: "cloneFromBroadcast",
    value: function cloneFromBroadcast(broadcast, attrs) {
      return this.cloneFromBroadcasts([broadcast], attrs);
    }
  }, {
    key: "createForAutoPublish",
    value: function createForAutoPublish(blogPost, channels) {
      var broadcasts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : List();
      var body = blogPost.description ? blogPost.title + " - " + blogPost.description : blogPost.title;
      var broadcastTemplate = {
        content: {
          title: blogPost.title,
          description: blogPost.description,
          body: body,
          imageUrl: blogPost.featuredImage
        },
        clientTag: 'blog-autopublish-customization',
        remoteContentType: CONTENT_TYPE.cosblog,
        remoteContentId: blogPost.id,
        status: BROADCAST_STATUS.CREATED_BAP
      };
      var channelsByAccountType = channels.groupBy(function (c) {
        return c.accountSlug;
      });
      var broadcastsByNetwork = broadcasts.groupBy(function (b) {
        return b.getNetwork();
      });
      var messages = channelsByAccountType.map(function (networkChannels, network) {
        broadcasts = broadcastsByNetwork.get(network);

        if (broadcasts && broadcasts.first().content) {
          broadcastTemplate = broadcasts.first();
          broadcastTemplate = broadcastTemplate.setIn(['content', 'imageUrl'], blogPost.featuredImage);
        } else {
          if (network === ACCOUNT_TYPES.linkedin) {
            broadcastTemplate.content.body = blogPost.title;
          }
        }

        var broadcastGuids = broadcasts && broadcasts.map(function (b) {
          return b.broadcastGuid;
        }).toOrderedSet();
        return BroadcastGroupMessage.createFrom({
          isBlogPostAutoPublish: true,
          network: network,
          publishType: BROADCAST_PUBLISH_TYPE.bap,
          channelKeys: networkChannels.map(function (c) {
            return c.channelKey;
          }).toArray(),
          broadcastGuids: broadcastGuids,
          broadcast: broadcasts ? broadcastTemplate : Broadcast.createFrom(broadcastTemplate)
        });
      }).toArray();
      return BroadcastGroup.createFrom({
        messages: messages,
        blogPost: blogPost
      });
    }
  }]);

  return BroadcastGroup;
}(Record(DEFAULTS));

export { BroadcastGroup as default };