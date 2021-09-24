'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { compose, createPlugin, pluginUtils } from 'draft-extend';
import TransformText from 'draft-plugins/plugins/TransformText';
import MissingMergeTagPluginComponent from './MissingMergeTagPluginComponent';
import { ENTITY_TYPE } from 'sales-modal/utils/enrollModal/missingMergeTags';
import { formatMergeTag } from 'draft-plugins/utils/propertyUtils';

var MissingMergeTagPlugin = function MissingMergeTagPlugin() {
  var PREFIX = '\\w*';
  var PROPERTY = '[^\\s{}]*';
  var REGEX_PATTERN = new RegExp("\\{\\{\\s?(?:(missing)\\.)(" + PREFIX + "\\." + PROPERTY + ")\\s?\\}\\}", 'gi');

  var createEntityOptions = function createEntityOptions(type) {
    return [ENTITY_TYPE, 'IMMUTABLE', {
      type: type
    }];
  };

  var textToEntity = function textToEntity(text, createEntity) {
    var results = [];
    text.replace(REGEX_PATTERN, // eslint-disable-next-line no-unused-vars
    function (match, propertyType, property, offset, string) {
      results.push({
        offset: offset,
        length: match.length,
        result: property,
        entity: createEntity.apply(void 0, _toConsumableArray(createEntityOptions(property)))
      });
    });
    return results;
  };

  return createPlugin({
    decorators: {
      strategy: pluginUtils.entityStrategy(ENTITY_TYPE),
      component: MissingMergeTagPluginComponent
    },
    textToEntity: textToEntity
  });
};

export default (function () {
  var opts = {
    dataProp: 'flattenedProperties',
    entityType: ENTITY_TYPE,
    dataFind: function dataFind(flattenedProperties, entity) {
      var _entity$getData = entity.getData(),
          type = _entity$getData.type;

      var _type$split = type.split('.'),
          _type$split2 = _slicedToArray(_type$split, 2),
          prefix = _type$split2[0],
          property = _type$split2[1];

      var tagName = formatMergeTag(prefix, property, flattenedProperties);
      return {
        text: tagName
      };
    }
  };
  return compose(TransformText(opts), MissingMergeTagPlugin());
});