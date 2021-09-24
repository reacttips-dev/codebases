'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import { SOCIAL_POSTS } from '../../constants/dataTypes';

var prefix = function prefix(key) {
  return "reporting-data.properties." + key + ".count";
};

var specificLabels = ImmutableMap(_defineProperty({}, SOCIAL_POSTS, prefix('socialPosts')));

var getLabel = function getLabel(dataType) {
  return specificLabels.has(dataType) ? I18n.text(specificLabels.get(dataType)) : I18n.text(prefix('common'), {
    object: I18n.SafeString(I18n.text("reporting-data.dataTypes." + dataType))
  });
};

export default (function (dataType) {
  return ImmutableMap({
    count: ImmutableMap({
      name: 'count',
      label: getLabel(dataType),
      type: 'number'
    })
  });
});
export var customObjectCountProperty = function customObjectCountProperty(pluralName) {
  return ImmutableMap({
    count: ImmutableMap({
      name: 'count',
      label: I18n.text('reporting-data.properties.common.count', {
        object: pluralName
      }),
      type: 'number'
    })
  });
};