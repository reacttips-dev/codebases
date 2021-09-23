'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { createPlugin, pluginUtils } from 'draft-extend';
import TransformText from 'draft-plugins/plugins/TransformText';
import MergeTagGroupDecorator from './MergeTagGroupDecorator';
import { createPluginStack } from '../createPluginStack';
import MergeTagSelectPopoverWrapper from './MergeTagSelectPopoverWrapper';
import MergeTagGroupButton from './MergeTagGroupButton';
import MergeTagDefaultOptions from './MergeTagDefaultOptions';
import { EntityTypes } from '../../lib/mergeTagConstants';
import { createTracker } from '../../tracking/usageTracker';
import getMergeTags from '../../utils/getMergeTags';
import { formatMergeTag } from '../../utils/propertyUtils';
import createEntityOptions from '../../utils/createMergeTagEntityOptions';
var Tracker;

var getPrefixes = function getPrefixes(mergeTags) {
  return mergeTags.map(function (tag) {
    return tag.toLowerCase();
  }).join('|');
};

var MergeTagGroupPlugin = function MergeTagGroupPlugin(options) {
  if (!Tracker) {
    Tracker = createTracker();
  }

  var optionsWithDefaults = Object.assign({}, MergeTagDefaultOptions, {}, options);
  var buttonClassName = optionsWithDefaults.buttonClassName,
      contentType = optionsWithDefaults.contentType,
      includeTicketTokens = optionsWithDefaults.includeTicketTokens,
      includeCustomTokens = optionsWithDefaults.includeCustomTokens,
      onInsertToken = optionsWithDefaults.onInsertToken,
      tracker = optionsWithDefaults.tracker,
      showButtonIcon = optionsWithDefaults.showButtonIcon;
  var mergeTags = getMergeTags({
    includeTicketTokens: includeTicketTokens,
    includeCustomTokens: includeCustomTokens
  });

  var textToEntity = function textToEntity(text, createEntity) {
    var result = [];
    var prefixes = getPrefixes(mergeTags);
    var pattern = new RegExp("\\{\\{\\s?(?:(" + prefixes + ")\\.)([^\\s{}]*)\\s?\\}\\}", 'gi');
    text.replace(pattern, function (match, prefix, property, offset) {
      var entityData = {
        prefix: prefix,
        property: property
      };
      result.push({
        offset: offset,
        length: match.length,
        entity: createEntity.apply(void 0, _toConsumableArray(createEntityOptions(entityData))),
        result: prefix + "." + property
      });
    });
    return result;
  };

  var entityToHTML = function entityToHTML(entity, originalText) {
    if (entity.type === EntityTypes.MERGE_TAG) {
      var _entity$data = entity.data,
          prefix = _entity$data.prefix,
          property = _entity$data.property;
      return "{{ " + prefix + "." + property + " }}";
    }

    return originalText;
  };

  var MergeTagGroupButtonWrapper = MergeTagSelectPopoverWrapper(MergeTagGroupButton, {
    buttonClassName: buttonClassName,
    mergeTags: mergeTags,
    createEntityOptions: createEntityOptions,
    tracker: tracker,
    onInsertToken: onInsertToken,
    contentType: contentType,
    showButtonIcon: showButtonIcon,
    Tracker: Tracker
  });
  return createPlugin({
    displayName: 'MergeTagGroupPlugin',
    decorators: {
      strategy: pluginUtils.entityStrategy(EntityTypes.MERGE_TAG),
      component: MergeTagGroupDecorator
    },
    buttons: MergeTagGroupButtonWrapper,
    textToEntity: textToEntity,
    entityToHTML: entityToHTML
  });
};

export default (function (options) {
  var transformOptions = {
    dataProp: 'flattenedProperties',
    entityType: EntityTypes.MERGE_TAG,
    dataFind: function dataFind(flattenedProperties, entity) {
      var _entity$getData = entity.getData(),
          prefix = _entity$getData.prefix,
          property = _entity$getData.property;

      var tagName = formatMergeTag(prefix, property, flattenedProperties);
      return {
        text: tagName
      };
    }
  };
  return createPluginStack(TransformText(transformOptions), MergeTagGroupPlugin(options));
});