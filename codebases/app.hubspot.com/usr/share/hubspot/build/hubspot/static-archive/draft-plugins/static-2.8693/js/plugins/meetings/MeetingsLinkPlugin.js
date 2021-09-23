'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import I18n from 'I18n';
import { createPlugin, pluginUtils } from 'draft-extend';
import createMeetingEntityOptions from '../../utils/createMeetingEntityOptions';
import MeetingsLinkButton from './MeetingsLinkButton';
import MeetingsLinkDecorator from './MeetingsLinkDecorator';
import { MEETINGS_LINK_TYPES as LINK_TYPES, MEETINGS_LINK_ENTITY_TYPE, MEETING_LINK_DOMAINS } from '../../lib/constants';
var REGEX_PATTERN = new RegExp('\\{\\{\\s?(?:(custom)\\.(sendermeetingslink|ownermeetingslink)|(owner)\\.(meetings_link))\\s?\\}\\}', 'gi');

var entityToHTML = function entityToHTML(entity, originalText) {
  if (entity.type === MEETINGS_LINK_ENTITY_TYPE) {
    var _entity$data = entity.data,
        type = _entity$data.type,
        customText = _entity$data.customText,
        linkURL = _entity$data.linkURL;
    var link;

    if (type === LINK_TYPES.OWNER) {
      link = '{{ owner.meetings_link }}';
    } else if (type === LINK_TYPES.SENDER) {
      link = "{{ custom." + type + " }}";
    } else {
      link = linkURL;
    }

    var text = customText ? originalText : link;
    return "<a href=\"" + link + "\">" + text + "</a>";
  }

  return originalText;
};

var textToEntity = function textToEntity(text, createEntity) {
  var results = [];
  text.replace(REGEX_PATTERN, function (match, customPrefix, customType, ownerPrefix, ownerType, offset) {
    if (ownerPrefix === 'owner' && ownerType === 'meetings_link') {
      customType = LINK_TYPES.OWNER;
    }

    results.push({
      offset: offset,
      length: match.length,
      result: I18n.text("draftPlugins.meetings." + customType),
      entity: createEntity.apply(void 0, _toConsumableArray(createMeetingEntityOptions(customType)))
    });
  });
  return results;
};

var htmlToEntity = function htmlToEntity(nodeName, node, createEntity) {
  if (nodeName === 'a' && node.hasAttribute('href')) {
    var url = node.getAttribute('href');

    if (MEETING_LINK_DOMAINS.some(function (domain) {
      return url.indexOf(domain) !== -1;
    })) {
      return createEntity.apply(void 0, _toConsumableArray(createMeetingEntityOptions(LINK_TYPES.CUSTOM, true, url)));
    }

    var result = REGEX_PATTERN.exec(node.getAttribute('href'));

    if (result !== null) {
      var _result = _slicedToArray(result, 5),
          __match = _result[0],
          __customPrefix = _result[1],
          originalCustomType = _result[2],
          ownerPrefix = _result[3],
          ownerType = _result[4];

      var customType = originalCustomType;

      if (ownerPrefix === 'owner' && ownerType === 'meetings_link') {
        customType = LINK_TYPES.OWNER;
      }

      return createEntity.apply(void 0, _toConsumableArray(createMeetingEntityOptions(customType, true)));
    }
  }

  return null;
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      onFetchMeetingsError = _ref.onFetchMeetingsError,
      onInsertMeetingsLink = _ref.onInsertMeetingsLink,
      zeroStateImageUrl = _ref.zeroStateImageUrl,
      getMeetingsLink = _ref.getMeetingsLink;

  return createPlugin({
    buttons: MeetingsLinkButton({
      onInsertMeetingsLink: onInsertMeetingsLink,
      zeroStateImageUrl: zeroStateImageUrl,
      getMeetingsLink: getMeetingsLink
    }),
    decorators: {
      strategy: pluginUtils.entityStrategy(MEETINGS_LINK_ENTITY_TYPE),
      component: MeetingsLinkDecorator({
        onFetchMeetingsError: onFetchMeetingsError,
        onInsertMeetingsLink: onInsertMeetingsLink,
        zeroStateImageUrl: zeroStateImageUrl,
        getMeetingsLink: getMeetingsLink
      })
    },
    entityToHTML: entityToHTML,
    textToEntity: textToEntity,
    htmlToEntity: htmlToEntity
  });
});